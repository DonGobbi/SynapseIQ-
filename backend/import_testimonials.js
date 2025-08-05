// Script to import testimonials from JSON file into SQLite database
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Ensure database directory exists
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

// Connect to the database
const dbPath = path.join(dbDir, 'synapseiq.db');
const db = new sqlite3.Database(dbPath);

console.log(`Connected to database: ${dbPath}`);

// Create testimonials table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      rating INTEGER NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      featured BOOLEAN NOT NULL DEFAULT 0,
      date TEXT NOT NULL
    )
  `);
  
  // Read testimonials from JSON file
  const testimonialsPath = path.join(__dirname, 'testimonials_data.json');
  const testimonials = JSON.parse(fs.readFileSync(testimonialsPath, 'utf8'));
  
  console.log(`Read ${testimonials.length} testimonials from JSON file`);
  
  // Clear existing testimonials
  db.run('DELETE FROM testimonials', function(err) {
    if (err) {
      console.error('Error clearing existing testimonials:', err.message);
      return;
    }
    
    console.log('Cleared existing testimonials');
    
    // Prepare insert statement
    const stmt = db.prepare(`
      INSERT INTO testimonials (name, company, position, rating, content, image, featured, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Insert testimonials
    let successCount = 0;
    testimonials.forEach((testimonial) => {
      stmt.run(
        testimonial.name,
        testimonial.company,
        testimonial.position,
        testimonial.rating,
        testimonial.content,
        testimonial.image,
        testimonial.featured ? 1 : 0,
        testimonial.date,
        function(err) {
          if (err) {
            console.error(`Error inserting testimonial for ${testimonial.name}:`, err.message);
          } else {
            successCount++;
          }
        }
      );
    });
    
    // Finalize statement
    stmt.finalize(() => {
      console.log(`Successfully imported ${successCount} testimonials`);
      
      // Verify import by counting testimonials
      db.get('SELECT COUNT(*) as count FROM testimonials', (err, row) => {
        if (err) {
          console.error('Error counting testimonials:', err.message);
        } else {
          console.log(`Total testimonials in database: ${row.count}`);
        }
        
        // Count featured testimonials
        db.get('SELECT COUNT(*) as count FROM testimonials WHERE featured = 1', (err, row) => {
          if (err) {
            console.error('Error counting featured testimonials:', err.message);
          } else {
            console.log(`Featured testimonials in database: ${row.count}`);
          }
          
          // Close database connection
          db.close();
          console.log('Database connection closed');
        });
      });
    });
  });
});
