/**
 * Simple database server to read Strapi's SQLite database
 * This bypasses the broken Strapi API and reads directly from the database
 */

const http = require('http');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const PORT = 3333;
const DB_PATH = path.join(__dirname, 'strapi-fresh/strapi-fresh/strapi-new/.tmp/data.db');

// Create server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/api/home-page-live' && req.method === 'GET') {
    // Open database
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database error' }));
        return;
      }
    });
    
    // Query home page data
    db.get(
      `SELECT id, document_id, title, hero_title, hero_subtitle, hero_section_visible 
       FROM home_pages 
       WHERE id = 1`,
      (err, row) => {
        if (err) {
          console.error('Query error:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Query error' }));
          db.close();
          return;
        }
        
        if (!row) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No data found' }));
          db.close();
          return;
        }
        
        // Format response like Strapi would
        const response = {
          data: {
            id: row.id,
            documentId: row.document_id,
            title: row.title,
            heroTitle: row.hero_title,
            heroSubtitle: row.hero_subtitle,
            heroSectionVisible: Boolean(row.hero_section_visible),
          },
          meta: {
            source: 'direct-database',
            timestamp: new Date().toISOString()
          }
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
        
        console.log(`✅ Served data: heroSectionVisible=${row.hero_section_visible}`);
        db.close();
      }
    );
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Database server running at http://localhost:${PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PORT}/api/home-page-live`);
  console.log(`💾 Reading from: ${DB_PATH}`);
  console.log(`🔄 This server reads LIVE data directly from Strapi's database`);
});