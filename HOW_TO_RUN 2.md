# How to Run This Project

This is a **static HTML website** project - no server-side setup required!

## 📁 Project Type
Static HTML/CSS/JavaScript website template (Zohacous - Webflow template)

## 🚀 Running the Project

### Method 1: Simple File Opening
1. Navigate to the project directory
2. Open `index.html` in your web browser
3. That's it! The website will load locally

### Method 2: Local HTTP Server (Recommended)
For better compatibility and to avoid CORS issues:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (if you have it)
npx http-server

# Using PHP (if you have it)
php -S localhost:8000
```

Then open your browser to `http://localhost:8000`

## 📋 Project Structure
- `index.html` - Main landing page
- `home.html` - Alternative home page
- Various page templates (about-us.html, courses.html, blog.html, etc.)
- `css/` - Stylesheets
- `js/` - JavaScript files
- `images/` - Image assets
- `fonts/` - Font files
- `authentication-pages/` - Auth templates
- `template-pages/` - Additional page templates

## 🎯 Key Features
- Responsive design
- Webflow-based template
- E-commerce ready pages
- Authentication templates
- Course/education focused

## 📖 Backend Documentation
For planned backend functionality, see `/Docs/backend.md` which outlines:
- User authentication & authorization
- Course management system
- Payment processing
- Content delivery
- Learning progress tracking
- And much more...

## 🔧 Development Notes
- No build process required
- No package.json (static files only)
- Ready to deploy to any static hosting service
- Compatible with all modern browsers

## 🚀 Deployment Options
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting provider