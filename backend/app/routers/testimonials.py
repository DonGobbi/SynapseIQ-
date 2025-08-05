from fastapi import APIRouter, HTTPException, Depends, Form, File, UploadFile
from pydantic import BaseModel, Field
from typing import Optional, List
import os
import json
from datetime import datetime
import sqlite3
from pathlib import Path
import shutil

# Initialize router
router = APIRouter()

# Database connection
def get_db_connection():
    conn = sqlite3.connect("./data/synapseiq.db")
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database tables
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create testimonials table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        company TEXT NOT NULL,
        position TEXT NOT NULL,
        rating REAL NOT NULL,
        content TEXT NOT NULL,
        image TEXT,
        featured BOOLEAN DEFAULT FALSE,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Ensure images directory exists
image_dir = Path("./public/images/testimonials")
image_dir.mkdir(parents=True, exist_ok=True)

# Pydantic models for request validation
class TestimonialBase(BaseModel):
    name: str
    company: str
    position: str
    rating: float = Field(..., ge=1, le=5)
    content: str
    featured: bool = False

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(TestimonialBase):
    name: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    rating: Optional[float] = Field(None, ge=1, le=5)
    content: Optional[str] = None
    featured: Optional[bool] = None

class Testimonial(TestimonialBase):
    id: int
    image: Optional[str] = None
    date: str

    class Config:
        orm_mode = True

# Get all testimonials
@router.get("/", response_model=List[Testimonial])
async def get_testimonials(featured_only: bool = False):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if featured_only:
            cursor.execute("SELECT * FROM testimonials WHERE featured = TRUE ORDER BY date DESC")
        else:
            cursor.execute("SELECT * FROM testimonials ORDER BY date DESC")
            
        testimonials = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return testimonials
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve testimonials: {str(e)}")

# Get a specific testimonial by ID
@router.get("/{testimonial_id}", response_model=Testimonial)
async def get_testimonial(testimonial_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        testimonial = cursor.fetchone()
        conn.close()
        
        if testimonial is None:
            raise HTTPException(status_code=404, detail="Testimonial not found")
            
        return dict(testimonial)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve testimonial: {str(e)}")

# Create a new testimonial
@router.post("/", response_model=Testimonial, status_code=201)
async def create_testimonial(testimonial: TestimonialCreate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """
            INSERT INTO testimonials (name, company, position, rating, content, featured)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                testimonial.name,
                testimonial.company,
                testimonial.position,
                testimonial.rating,
                testimonial.content,
                testimonial.featured
            )
        )
        
        testimonial_id = cursor.lastrowid
        conn.commit()
        
        # Fetch the created testimonial
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        created_testimonial = dict(cursor.fetchone())
        
        conn.close()
        return created_testimonial
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create testimonial: {str(e)}")

# Update an existing testimonial
@router.put("/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: int, testimonial_update: TestimonialUpdate):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if testimonial exists
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        existing = cursor.fetchone()
        
        if existing is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Build update query dynamically based on provided fields
        update_fields = {}
        for field, value in testimonial_update.dict(exclude_unset=True).items():
            if value is not None:
                update_fields[field] = value
        
        if not update_fields:
            conn.close()
            return dict(existing)
        
        # Construct SQL query
        set_clause = ", ".join([f"{field} = ?" for field in update_fields.keys()])
        values = list(update_fields.values())
        values.append(testimonial_id)
        
        cursor.execute(f"UPDATE testimonials SET {set_clause} WHERE id = ?", values)
        conn.commit()
        
        # Fetch the updated testimonial
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        updated_testimonial = dict(cursor.fetchone())
        
        conn.close()
        return updated_testimonial
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update testimonial: {str(e)}")

# Delete a testimonial
@router.delete("/{testimonial_id}")
async def delete_testimonial(testimonial_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if testimonial exists and get image path if any
        cursor.execute("SELECT image FROM testimonials WHERE id = ?", (testimonial_id,))
        testimonial = cursor.fetchone()
        
        if testimonial is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Delete the testimonial
        cursor.execute("DELETE FROM testimonials WHERE id = ?", (testimonial_id,))
        conn.commit()
        conn.close()
        
        # Delete the image file if it exists
        if testimonial['image']:
            image_path = Path(f"./public{testimonial['image']}")
            if image_path.exists():
                image_path.unlink()
        
        return {"status": "success", "message": "Testimonial deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete testimonial: {str(e)}")

# Upload testimonial image
@router.post("/{testimonial_id}/image")
async def upload_testimonial_image(testimonial_id: int, file: UploadFile = File(...)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if testimonial exists
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        testimonial = cursor.fetchone()
        
        if testimonial is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Delete old image if exists
        if testimonial['image']:
            old_image_path = Path(f"./public{testimonial['image']}")
            if old_image_path.exists():
                old_image_path.unlink()
        
        # Save new image
        file_extension = os.path.splitext(file.filename)[1]
        image_name = f"testimonial_{testimonial_id}{file_extension}"
        image_path = f"/static/images/testimonials/{image_name}"
        file_location = f"./public/images/testimonials/{image_name}"
        
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Update testimonial with new image path
        cursor.execute(
            "UPDATE testimonials SET image = ? WHERE id = ?",
            (image_path, testimonial_id)
        )
        conn.commit()
        
        # Fetch the updated testimonial
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        updated_testimonial = dict(cursor.fetchone())
        
        conn.close()
        return updated_testimonial
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

# Toggle featured status
@router.patch("/{testimonial_id}/featured")
async def toggle_featured_status(testimonial_id: int, featured: bool = Form(...)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if testimonial exists
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        testimonial = cursor.fetchone()
        
        if testimonial is None:
            conn.close()
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        # Update featured status
        cursor.execute(
            "UPDATE testimonials SET featured = ? WHERE id = ?",
            (featured, testimonial_id)
        )
        conn.commit()
        
        # Fetch the updated testimonial
        cursor.execute("SELECT * FROM testimonials WHERE id = ?", (testimonial_id,))
        updated_testimonial = dict(cursor.fetchone())
        
        conn.close()
        return updated_testimonial
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update featured status: {str(e)}")
