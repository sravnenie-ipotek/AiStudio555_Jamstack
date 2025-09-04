# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **AI Studio E-Learning Platform** using JAMstack architecture with Headless CMS (Strapi). The project consists of a static frontend (Webflow HTML/CSS/JS) that connects directly to a Strapi backend API for dynamic content management, user authentication, and course delivery.

## Architecture

### Three-Layer Architecture
```
Frontend (Static HTML) → Strapi API → PostgreSQL Docker Container
Port 3005/8000        → Port 1337   → Port 5432
```

### Key Components
- **Frontend**: Static Webflow templates served via Python HTTP server
- **Strapi CMS**: Headless CMS running locally or in Docker at localhost:1337
- **PostgreSQL**: Docker container `projectdes-postgres` for data persistence
- **Integration Layer**: `webflow-strapi-integration.js` handles API communication

## Development Commands

### Start Services

```bash
# 1. Start PostgreSQL Docker (if not running)
docker-compose up -d postgres

# 2. Start Strapi CMS (choose one)
cd strapi-fresh && npm run develop  # Development mode
cd strapi-cms && docker-compose up   # Docker mode

# 3. Start Frontend Server
python3 -m http.server 3005  # Serves static files
```

### Strapi Management

```bash
# In strapi-fresh/ directory
npm run develop    # Start development server with hot-reload
npm run build      # Build for production
npm run start      # Start production server
npm run strapi console  # Interactive Strapi console
```

### Docker Operations

```bash
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker logs strapi-cms -f   # View Strapi logs
docker logs projectdes-postgres -f  # View PostgreSQL logs
```

### Testing

```bash
# Cypress E2E tests
npx cypress open           # Open Cypress UI
npx cypress run            # Run tests headlessly

# API Testing
curl -H "Authorization: Bearer [TOKEN]" http://localhost:1337/api/users
```

## API Configuration

### Strapi API Token
Located in `webflow-strapi-integration.js:19`
```javascript
apiToken: '6ba76f584778637fd308f48aac27461c...'
```

To generate new token:
1. Go to http://localhost:1337/admin
2. Navigate to Settings → API Tokens
3. Create new token with Full Access

### Environment Variables
Key configurations in `.env`:
- `DATABASE_HOST=postgres` (Docker) or `localhost` (local)
- `DATABASE_PORT=5432`
- `DATABASE_NAME=strapi`
- `JWT_SECRET` and `ADMIN_JWT_SECRET` for authentication
- `FRONTEND_URL=http://localhost:3000` for CORS

## Content Structure

### Page Templates
- `index.html` - Landing page
- `courses.html` - Course catalog
- `detail_courses.html` - Individual course view
- `authentication-pages/` - Login/signup flows
- `checkout.html` & `paypal-checkout.html` - Payment processing

### Dynamic Content Integration Points
Pages that connect to Strapi API:
- Course listings: `courses.html` fetches from `/api/courses`
- User auth: `sign-in.html` posts to `/api/auth/local`
- Course details: `detail_courses.html?id=X` fetches from `/api/courses/X`
- User profile: Fetches from `/api/users/me`

## Database Schema

Key content types expected in Strapi:
- **Users**: Built-in with roles (Student, Instructor, Admin)
- **Courses**: Title, description, price, duration, instructor
- **Enrollments**: Links users to courses with progress tracking
- **Lessons**: Course content with video URLs and materials

## Frontend-Backend Communication

The frontend uses client-side JavaScript to communicate with Strapi:

```javascript
// Authentication
fetch('http://localhost:1337/api/auth/local', {
    method: 'POST',
    body: JSON.stringify({ identifier: email, password })
})

// Get courses with populate
fetch('http://localhost:1337/api/courses?populate=*')

// Protected endpoints require JWT
fetch('http://localhost:1337/api/users/me', {
    headers: { 'Authorization': `Bearer ${jwt}` }
})
```

## File Organization

```
/
├── strapi-fresh/       # Latest Strapi v5 instance
├── strapi-cms/         # Docker-based Strapi (alternative)
├── authentication-pages/  # Auth UI templates
├── css/                # Webflow styles
├── js/                 # Client-side scripts
├── images/             # Static assets
├── Docs/               # Project documentation
│   ├── backend.md      # Backend requirements
│   └── todo/           # Implementation strategies
├── cypress/e2e/        # E2E test files
├── docker-compose.yml  # Full stack Docker config
└── webflow-strapi-integration.js  # Main API integration
```

## Important Implementation Notes

### Multi-language Support
Project requires English, Russian, Hebrew (RTL) support. Strapi i18n plugin should be configured for these locales.

### Payment Integration
Planned gateways: Stripe, PayPal, Razorpay. Payment endpoints need to be implemented in Strapi custom controllers.

### Content Delivery
Video content planned to use CDN (Cloudflare/CloudFront). Large files should not be stored in Strapi media library.

### Security Considerations
- API tokens are currently exposed in frontend code (development only)
- Production requires environment-specific token management
- CORS configuration needed for production domains
- Rate limiting should be implemented via koa-ratelimit

## Git Repository

Remote: `git@github.com:sravnenie-ipotek/AiStudio555_Jamstack.git`
- DO NOT push without explicit user permission
- Current branch should track feature development
- Production deployments planned for Railway ($5/month)