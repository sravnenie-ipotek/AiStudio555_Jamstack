/**
 * Local Development Server
 * Uses Docker PostgreSQL instead of Railway
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool for local Docker database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // No SSL for local Docker
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('Make sure Docker PostgreSQL is running: docker compose up -d');
  } else {
    console.log('✅ Connected to local PostgreSQL:', res.rows[0].now);
  }
});

// Enhanced CORS for local development
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3005',
      'http://localhost:8000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3005',
      'http://127.0.0.1:8000',
      'file://' // Allow file protocol for local HTML files
    ];
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.log('⚠️ CORS blocked origin:', origin);
      callback(null, true); // Allow anyway in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

// Development logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 500 ? '\x1b[31m' : // red
                   status >= 400 ? '\x1b[33m' : // yellow
                   status >= 300 ? '\x1b[36m' : // cyan
                   status >= 200 ? '\x1b[32m' : // green
                   '\x1b[0m'; // default
    
    console.log(`${color}${req.method} ${req.url} ${status} - ${duration}ms\x1b[0m`);
  });
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT 1');
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      LIMIT 5
    `);
    
    res.json({
      status: 'healthy',
      environment: 'local',
      database: 'connected',
      tables: tableCheck.rows.map(r => r.table_name),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Development info endpoint
app.get('/api/dev-info', async (req, res) => {
  try {
    const tables = await pool.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns 
              WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const counts = {};
    for (const table of tables.rows) {
      try {
        const result = await pool.query(`SELECT COUNT(*) FROM ${table.table_name}`);
        counts[table.table_name] = {
          columns: table.column_count,
          rows: parseInt(result.rows[0].count)
        };
      } catch (e) {
        counts[table.table_name] = { error: e.message };
      }
    }
    
    res.json({
      environment: 'local',
      database: {
        host: 'localhost',
        port: 5432,
        database: 'aistudio_db'
      },
      tables: counts,
      endpoints: [
        '/health',
        '/api/dev-info',
        '/api/courses',
        '/api/teachers',
        '/api/blog-posts',
        '/api/home-page',
        '/api/career-center-page',
        '/api/career-orientation-page',
        '/content-admin-comprehensive.html'
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes with enhanced error handling
app.get('/api/courses', async (req, res) => {
  try {
    const locale = req.query.locale || 'en';
    const preview = req.query.preview === 'true';
    
    console.log(`📚 Fetching courses (locale: ${locale}, preview: ${preview})`);
    
    const query = `
      SELECT * FROM courses 
      WHERE locale = $1 OR locale = 'en'
      ORDER BY locale = $1 DESC, id ASC
    `;
    
    const result = await pool.query(query, [locale]);
    
    if (result.rows.length === 0) {
      console.log('⚠️ No courses found, returning mock data');
      return res.json([{
        id: 1,
        title: 'Sample Course (Local Development)',
        description: 'This is mock data. Import production data using: npm run sync:production',
        price: 99,
        locale: locale
      }]);
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({ 
      error: 'Failed to fetch courses',
      details: error.message,
      hint: 'Make sure the database is running and data is imported'
    });
  }
});

app.get('/api/teachers', async (req, res) => {
  try {
    const locale = req.query.locale || 'en';
    console.log(`👨‍🏫 Fetching teachers (locale: ${locale})`);
    
    const result = await pool.query(
      'SELECT * FROM teachers WHERE locale = $1 OR locale = $2 ORDER BY locale = $1 DESC, id ASC',
      [locale, 'en']
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching teachers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blog-posts', async (req, res) => {
  try {
    const locale = req.query.locale || 'en';
    console.log(`📝 Fetching blog posts (locale: ${locale})`);
    
    const result = await pool.query(
      'SELECT * FROM blogs WHERE locale = $1 OR locale = $2 ORDER BY created_at DESC',
      [locale, 'en']
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dynamic page content endpoints
app.get('/api/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const locale = req.query.locale || 'en';
    const preview = req.query.preview === 'true';
    
    console.log(`📄 Fetching ${page} (locale: ${locale}, preview: ${preview})`);
    
    // Map page names to database tables
    const pageMap = {
      'home-page': 'pages',
      'career-center-page': 'pages',
      'career-orientation-page': 'pages',
      'about-page': 'pages'
    };
    
    const tableName = pageMap[page];
    if (!tableName) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    const result = await pool.query(
      `SELECT * FROM ${tableName} WHERE page_type = $1 AND (locale = $2 OR locale = 'en') ORDER BY locale = $2 DESC LIMIT 1`,
      [page.replace('-page', ''), locale]
    );
    
    if (result.rows.length === 0) {
      return res.json({ 
        message: 'No content found',
        hint: 'Import production data using: npm run sync:production'
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(`❌ Error fetching page ${req.params.page}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Admin panel with hot reload notification
app.get('/content-admin-comprehensive.html', (req, res) => {
  const adminPath = path.join(__dirname, 'content-admin-comprehensive.html');
  
  if (!fs.existsSync(adminPath)) {
    return res.status(404).send(`
      <h1>Admin Panel Not Found</h1>
      <p>The admin panel file is missing. Create it or import from production.</p>
      <p><a href="/">Go to Homepage</a></p>
    `);
  }
  
  let adminContent = fs.readFileSync(adminPath, 'utf8');
  
  // Inject local environment indicator
  const localIndicator = `
    <div id="local-env-indicator" style="
      position: fixed;
      top: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    ">
      🚀 LOCAL ENVIRONMENT
    </div>
  `;
  
  // Replace API URL with local
  adminContent = adminContent.replace(
    /https:\/\/aistudio555jamstack-production\.up\.railway\.app/g,
    'http://localhost:3000'
  );
  
  // Add local indicator after body tag
  adminContent = adminContent.replace('<body>', `<body>${localIndicator}`);
  
  res.send(adminContent);
});

// Content save endpoint for admin panel
app.post('/api/admin/save-content', async (req, res) => {
  try {
    const { table, data, locale = 'en' } = req.body;
    
    console.log(`💾 Saving content to ${table} (locale: ${locale})`);
    
    // Implementation depends on your table structure
    // This is a simplified example
    const query = `
      INSERT INTO ${table} (content, locale, updated_at) 
      VALUES ($1, $2, NOW())
      ON CONFLICT (locale) 
      DO UPDATE SET content = $1, updated_at = NOW()
      RETURNING *
    `;
    
    const result = await pool.query(query, [JSON.stringify(data), locale]);
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Content saved successfully'
    });
  } catch (error) {
    console.error('❌ Error saving content:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve HTML files with local API URL injection
app.get('*.html', (req, res, next) => {
  const filePath = path.join(__dirname, req.path);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace production API URLs with local
    content = content.replace(
      /https:\/\/aistudio555jamstack-production\.up\.railway\.app/g,
      'http://localhost:3000'
    );
    
    res.send(content);
  } else {
    next();
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    hint: 'Check the URL or API documentation'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 AI Studio Local Development Server');
  console.log('='.repeat(60));
  console.log(`\n📡 API Server:     http://localhost:${PORT}`);
  console.log(`📊 Admin Panel:    http://localhost:${PORT}/content-admin-comprehensive.html`);
  console.log(`🔍 Health Check:   http://localhost:${PORT}/health`);
  console.log(`📋 Dev Info:       http://localhost:${PORT}/api/dev-info`);
  console.log(`🗄️  pgAdmin:        http://localhost:5050`);
  console.log('\n' + '='.repeat(60));
  console.log('💡 Tips:');
  console.log('  • Import production data: npm run sync:production');
  console.log('  • Start frontend dev server: npm run frontend:dev');
  console.log('  • View Docker logs: docker compose logs -f');
  console.log('  • Stop all services: docker compose down');
  console.log('='.repeat(60) + '\n');
});