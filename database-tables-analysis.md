# Database Tables Analysis for AI Studio Platform
## Complete Schema Requirements for All Screens

### Executive Summary
**Total Tables Needed: 67 tables**
- Core Content Tables: 25
- Relationship/Junction Tables: 15
- System Tables: 10
- Multi-language Tables: 12
- Analytics/Tracking Tables: 5

---

## 🏠 HOME PAGE TABLES (12 tables)

### 1. `nd_home` ✅ (EXISTS - needs expansion)
```sql
- hero_content (JSON)
- features_content (JSON)
- courses_content (JSON)
- testimonials_content (JSON)
- awards_content (JSON)
- cta_content (JSON)
```

### Missing Home Page Tables:
### 2. `course_categories`
- id, name, description, icon, display_order, visible

### 3. `about_home_section`
- id, title, subtitle, description, image_url, stats_json

### 4. `why_choose_us`
- id, title, subtitle, features_json

### 5. `pricing_preview`
- id, plan_name, price, features_json, popular

### 6. `process_steps`
- id, step_number, title, description, icon

### 7. `faq_items`
- id, question, answer, category, display_order

### 8. `blog_preview`
- id, post_id (FK), featured_order

### 9. `track_ticker`
- id, text_content, scroll_speed, visible

### 10. `hero_media`
- id, image_url, video_url, alt_text, type

### 11. `statistics`
- id, label, value, icon, display_order

### 12. `partners_logos`
- id, name, logo_url, website_url, display_order

---

## 📚 COURSES PAGES TABLES (8 tables)

### 13. `courses` ✅ (EXISTS)
- id, title, description, price, instructor_id, category_id, etc.

### 14. `course_modules`
- id, course_id, module_name, description, order_index

### 15. `course_lessons`
- id, module_id, lesson_name, video_url, duration, resources

### 16. `course_reviews`
- id, course_id, user_id, rating, comment, created_at

### 17. `course_enrollments`
- id, course_id, user_id, enrolled_at, progress, completed

### 18. `course_certificates`
- id, enrollment_id, certificate_url, issued_date

### 19. `course_resources`
- id, course_id, resource_name, file_url, type

### 20. `course_announcements`
- id, course_id, title, message, created_at

---

## 📝 BLOG TABLES (6 tables)

### 21. `blog_posts` ✅ (EXISTS)
- id, title, content, author_id, published_at, slug

### 22. `blog_categories`
- id, name, slug, description

### 23. `blog_tags`
- id, name, slug

### 24. `blog_post_tags` (junction)
- post_id, tag_id

### 25. `blog_comments`
- id, post_id, user_id, comment, approved, created_at

### 26. `blog_authors`
- id, name, bio, avatar_url, social_links

---

## 👨‍🏫 TEACHERS/INSTRUCTORS TABLES (4 tables)

### 27. `teachers` ✅ (EXISTS)
- id, name, bio, expertise, photo_url, rating

### 28. `teacher_qualifications`
- id, teacher_id, qualification, institution, year

### 29. `teacher_courses` (junction)
- teacher_id, course_id

### 30. `teacher_reviews`
- id, teacher_id, student_id, rating, comment

---

## 💼 CAREER CENTER TABLES (5 tables)

### 31. `career_paths`
- id, title, description, requirements, outcomes

### 32. `career_resources`
- id, title, content, file_url, category

### 33. `job_listings`
- id, title, company, location, type, description

### 34. `career_assessments`
- id, title, questions_json, scoring_logic

### 35. `career_orientation_content`
- id, section_name, content_json

---

## 💰 PRICING/PLANS TABLES (4 tables)

### 36. `pricing_plans`
- id, name, price, billing_cycle, features_json

### 37. `plan_features`
- id, plan_id, feature_name, available, limit_value

### 38. `subscriptions`
- id, user_id, plan_id, start_date, end_date, status

### 39. `discount_codes`
- id, code, discount_percent, valid_from, valid_to

---

## 📧 CONTACT/SUPPORT TABLES (4 tables)

### 40. `contact_info`
- id, type, value, icon, display_order

### 41. `office_locations`
- id, city, address, phone, email, map_url

### 42. `contact_submissions`
- id, name, email, subject, message, created_at

### 43. `support_tickets`
- id, user_id, subject, status, priority, assigned_to

---

## 🛒 E-COMMERCE TABLES (7 tables)

### 44. `orders`
- id, user_id, total, status, payment_method, created_at

### 45. `order_items`
- id, order_id, product_id, quantity, price

### 46. `shopping_cart`
- id, user_id, product_id, quantity, added_at

### 47. `payment_transactions`
- id, order_id, amount, gateway, transaction_id, status

### 48. `products`
- id, name, description, price, sku, inventory

### 49. `product_categories`
- id, name, parent_id, slug

### 50. `coupons`
- id, code, discount_type, value, usage_limit

---

## 👤 USER/AUTH TABLES (5 tables)

### 51. `users`
- id, email, password_hash, name, role, created_at

### 52. `user_profiles`
- id, user_id, bio, avatar_url, preferences_json

### 53. `user_sessions`
- id, user_id, token, expires_at, ip_address

### 54. `password_resets`
- id, user_id, token, expires_at

### 55. `user_roles`
- id, role_name, permissions_json

---

## 🌍 MULTI-LANGUAGE TABLES (3 per language)

### 56-58. `content_en`, `content_ru`, `content_he` ✅ (EXISTS)
- page_id, section_id, content_json

### 59-61. `translations_en`, `translations_ru`, `translations_he`
- key, value, context

### 62-64. `menu_items_en`, `menu_items_ru`, `menu_items_he`
- id, label, url, parent_id, order_index

---

## 🎨 GLOBAL/SYSTEM TABLES (8 tables)

### 65. `site_settings`
- id, key, value, type, editable

### 66. `navigation_menu` ✅ (EXISTS as nd_menu)
- id, label, url, parent_id, order_index

### 67. `footer_content` ✅ (EXISTS as nd_footer)
- id, section, content_json

### 68. `media_library`
- id, file_url, type, alt_text, uploaded_at

### 69. `seo_metadata`
- id, page_url, title, description, keywords, og_image

### 70. `redirects`
- id, from_url, to_url, type (301/302)

### 71. `audit_logs`
- id, user_id, action, entity, entity_id, timestamp

### 72. `email_templates`
- id, name, subject, body_html, variables_json

---

## 📊 ANALYTICS TABLES (5 tables)

### 73. `page_views`
- id, page_url, user_id, session_id, timestamp

### 74. `conversion_events`
- id, event_name, user_id, value, metadata_json

### 75. `user_activity`
- id, user_id, action, resource_type, resource_id, timestamp

### 76. `performance_metrics`
- id, metric_name, value, timestamp

### 77. `error_logs`
- id, error_type, message, stack_trace, user_id, timestamp

---

## Current Database Status

### ✅ Tables That Already Exist (10):
1. nd_home (partial content)
2. courses (basic structure)
3. teachers
4. blog_posts
5. nd_menu
6. nd_footer
7. content_en/ru/he
8. users (basic)
9. site_settings (basic)
10. pages (generic)

### ❌ Critical Missing Tables (20 High Priority):
1. course_categories
2. course_modules & lessons
3. pricing_plans
4. subscriptions
5. orders & order_items
6. faq_items
7. process_steps
8. why_choose_us
9. about sections
10. hero_media
11. blog_categories & tags
12. career paths
13. contact_submissions
14. user_profiles
15. payment_transactions
16. seo_metadata
17. media_library
18. email_templates
19. audit_logs
20. course_reviews

### 📈 Complexity Analysis:
- **Simple content tables:** 25 (single entity storage)
- **Relational tables:** 30 (foreign key relationships)
- **Junction tables:** 12 (many-to-many relationships)
- **JSON storage tables:** 10 (flexible schema)

### 🔄 Migration Priority:
1. **Phase 1 (Immediate):** Content tables for all static pages
2. **Phase 2 (Week 1):** E-commerce and user management
3. **Phase 3 (Week 2):** Course management system
4. **Phase 4 (Week 3):** Blog and career center
5. **Phase 5 (Week 4):** Analytics and optimization

---

## Recommendations

### Database Architecture:
- Use PostgreSQL for relational data
- Consider MongoDB for flexible content (JSON heavy tables)
- Implement Redis for caching frequently accessed data
- Use Elasticsearch for search functionality

### Best Practices:
1. Implement proper indexes on foreign keys
2. Use UUID for primary keys
3. Add created_at/updated_at timestamps to all tables
4. Implement soft deletes (deleted_at column)
5. Use database migrations for schema changes
6. Implement database backup strategy
7. Add data validation constraints
8. Use transactions for multi-table operations

### Estimated Implementation Time:
- **Full implementation:** 4-6 weeks
- **MVP (critical tables):** 2 weeks
- **Current to comprehensive:** 3 weeks

---

*Analysis Date: September 16, 2025*
*Total Unique Tables Required: 77*
*Currently Implemented: ~10 (13%)*
*Gap to Close: 67 tables*