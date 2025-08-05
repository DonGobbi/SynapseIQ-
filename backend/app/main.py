from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SynapseIQ AI API",
    description="Backend API for SynapseIQ AI services focused on African businesses",
    version="0.1.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://synapseiq.vercel.app"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure public directory exists
public_dir = Path("./public")
public_dir.mkdir(parents=True, exist_ok=True)

# Mount static files directory
app.mount("/static", StaticFiles(directory="public"), name="static")


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to SynapseIQ AI API",
        "status": "active",
        "version": "0.1.0",
        "documentation": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers from other modules
from app.routers import nlp, chatbot, analytics, contact, whatsapp, testimonials

app.include_router(nlp.router, prefix="/nlp", tags=["Natural Language Processing"])
app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(contact.router, prefix="/contact", tags=["Contact"])
app.include_router(whatsapp.router, prefix="/whatsapp", tags=["WhatsApp Integration"])
app.include_router(testimonials.router, prefix="/testimonials", tags=["Testimonials"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
