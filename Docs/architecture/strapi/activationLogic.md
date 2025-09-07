TEST strapi: 
node test-strapi-integration.js 



 1. Strapi Schema - Complete home page content structure with:
    - Hero Section with visibility toggle
    - Featured Courses with 6 course cards
    - Practice Focus with skills
    - Online Learning stats
    - Alumni Reviews with testimonials
    - FAQ Section with Q&A
  2. Content Loader (strapi-content-loader.js) - Automatically fetches and updates page content
  from Strapi API
  3. Seed Scripts - Multiple approaches to populate content:
    - /scripts/seed-home-page.js - API-based seeding
    - /scripts/seed-home-direct.js - Direct database seeding
    - /scripts/console-seed.js - Console-based seeding
  4. Testing Infrastructure:
    - test-strapi-integration.js - Verifies API and frontend status
    - tests/strapi-content-update.spec.js - Playwright test suite