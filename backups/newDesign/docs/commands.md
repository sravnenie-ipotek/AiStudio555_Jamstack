
http://localhost:8082/nd/home.html 

Running the NewDesign Project

  1. Start the API Server (Required)

  cd /Users/michaelmishayev/Desktop/newCode
  npm start
  This starts server.js on port 1337, providing the backend API for dynamic content.

  2. Start the Frontend Server (Required)

  In a new terminal:
  cd /Users/michaelmishayev/Desktop/newCode
  python3 -m http.server 3005
  This serves the static HTML files on port 3005.

  3. Access the Site

  Open your browser and go to:
  http://localhost:3005/backups/newDesign/home.html

  What Each Component Does

  - API Server (port 1337): Handles all dynamic content requests, connects to Railway PostgreSQL database, serves course
  data, blog posts, and page content
  - Frontend Server (port 3005): Serves the static HTML/CSS/JS files from the NewDesign directory
  - Database: Automatically connects to Railway PostgreSQL in production or local database in development

  Alternative Commands

  If you want to run both servers simultaneously:
  npm run dev
  This runs both the API and frontend servers concurrently.

  The system will automatically fetch dynamic content from the API and populate the static HTML templates with real data
  from the database.