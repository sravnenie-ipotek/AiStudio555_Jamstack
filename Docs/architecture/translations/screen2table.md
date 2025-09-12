# Screen to Database Table Mapping

## Main Pages → Tables

| Screen | Table | API Endpoint |
|--------|-------|--------------|
| Home | `home_pages` | `/api/home-page` |
| Courses List | `courses` | `/api/courses` |
| Course Detail | `courses` | `/api/courses/:id` |
| Teachers | `teachers` | `/api/teachers` |
| Blog | `blog_posts` | `/api/blog-posts` |
| Career Center | `career_center_pages` | `/api/career-center-page` |
| Career Orientation | `career_orientation_pages` | `/api/career-orientation-page` |
| About Us | `about_pages` | `/api/about-page` |
| Contact | `contact_pages` | `/api/contact-page` |
| Pricing | ❌ NO TABLE | - |
| Checkout | ❌ NO TABLE | - |

## Career System → Tables

| Screen | Table | Purpose |
|--------|-------|---------|
| Career Assessment Form | `career_orientation_assessment_responses` | Store user submissions |
| Career Resources | `career_resources` | Career content/articles |
| Job Postings | `job_postings` | Job listings |

## Admin Pages → Tables

| Screen | Table | Purpose |
|--------|-------|---------|
| Admin Panel | `admin_users`, `admin_roles`, `admin_permissions` | Admin auth |
| Content Admin | All content tables | Edit content |
| User Login/Signup | `up_users`, `up_roles`, `up_permissions` | User auth |

## Global Components → Tables

| Component | Table | Used On |
|-----------|-------|---------|
| Navigation | `navigation_menus` | All pages |
| Site Settings | `site_settings` | All pages |
| Statistics | `statistics` | Home |
| Button Texts | `button_texts` | All pages |
| Company Logos | `company_logos` | Home |
| Page Meta/SEO | `page_meta` | All pages |
| FAQs | `faqs` | Multiple pages |

## Multi-Language Support

All content tables have `locale` field supporting:
- `en` - English
- `ru` - Russian  
- `he` - Hebrew

## Static Pages (No Database)

- 404.html
- 401.html
- authentication-pages/* (uses `up_users` for auth logic)

---

## ⚠️ MISSING TABLES

1. **Pricing Page** - No `pricing_pages` table (static HTML only)
2. **Checkout Page** - No `checkout_pages` or `orders` table
3. **Payment System** - No payment/transaction tables
4. **Student Dashboard** - No student progress/enrollment tables
5. **Course Content** - No lessons/modules/videos tables
6. **Testimonials** - Embedded in pages, no separate `testimonials` table
7. **Newsletter** - No `newsletter_subscribers` table
8. **Analytics** - No user tracking/analytics tables
