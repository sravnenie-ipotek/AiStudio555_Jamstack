// Multi-Language API Example for server.js
// Add these modifications to your existing server.js

// Helper function to get locale from request
function getLocale(req) {
  // Priority: 1. Query param, 2. Path param, 3. Header, 4. Default
  const locale = req.query.locale || 
                 req.params.locale || 
                 req.headers['accept-language']?.split('-')[0] || 
                 'en';
  
  const validLocales = ['en', 'ru', 'he'];
  return validLocales.includes(locale) ? locale : 'en';
}

// Helper function for locale fallback
async function queryWithFallback(query, params, fallbackQuery, fallbackParams) {
  let result = await queryDatabase(query, params);
  
  // If no result and not English, fallback to English
  if ((!result || result.length === 0) && params[0] !== 'en') {
    result = await queryDatabase(fallbackQuery || query.replace(params[0], 'en'), 
                                fallbackParams || ['en', ...params.slice(1)]);
  }
  
  return result;
}

// ==================== MULTI-LANGUAGE ENDPOINTS ====================

// GET HOME PAGE WITH LOCALE
app.get('/api/home-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    
    // Query with locale
    const result = await queryWithFallback(
      'SELECT * FROM home_pages WHERE locale = $1 LIMIT 1',
      [locale]
    );
    
    if (!result || result.length === 0) {
      return res.json({ 
        error: 'No home page data found',
        locale: locale,
        fallback: 'en'
      });
    }
    
    const page = result[0];
    
    // Format response with locale info
    res.json({
      data: {
        id: page.id,
        locale: page.locale,
        attributes: {
          title: page.title,
          heroTitle: page.hero_title,
          heroSubtitle: page.hero_subtitle,
          heroDescription: page.hero_description,
          heroSectionVisible: page.hero_section_visible,
          featuredCoursesTitle: page.featured_courses_title,
          featuredCoursesDescription: page.featured_courses_description,
          featuredCoursesVisible: page.featured_courses_visible,
          aboutTitle: page.about_title,
          aboutSubtitle: page.about_subtitle,
          aboutDescription: page.about_description,
          aboutVisible: page.about_visible,
          companiesTitle: page.companies_title,
          companiesDescription: page.companies_description,
          companiesVisible: page.companies_visible,
          testimonialsTitle: page.testimonials_title,
          testimonialsSubtitle: page.testimonials_subtitle,
          testimonialsVisible: page.testimonials_visible,
          // Courses array
          courses: [
            {
              title: page.course_1_title,
              rating: page.course_1_rating,
              lessons: page.course_1_lessons,
              duration: page.course_1_duration,
              category: page.course_1_category,
              visible: page.course_1_visible
            },
            {
              title: page.course_2_title,
              rating: page.course_2_rating,
              lessons: page.course_2_lessons,
              duration: page.course_2_duration,
              category: page.course_2_category,
              visible: page.course_2_visible
            },
            {
              title: page.course_3_title,
              rating: page.course_3_rating,
              lessons: page.course_3_lessons,
              duration: page.course_3_duration,
              category: page.course_3_category,
              visible: page.course_3_visible
            },
            {
              title: page.course_4_title,
              rating: page.course_4_rating,
              lessons: page.course_4_lessons,
              duration: page.course_4_duration,
              category: page.course_4_category,
              visible: page.course_4_visible
            },
            {
              title: page.course_5_title,
              rating: page.course_5_rating,
              lessons: page.course_5_lessons,
              duration: page.course_5_duration,
              category: page.course_5_category,
              visible: page.course_5_visible
            },
            {
              title: page.course_6_title,
              rating: page.course_6_rating,
              lessons: page.course_6_lessons,
              duration: page.course_6_duration,
              category: page.course_6_category,
              visible: page.course_6_visible
            }
          ],
          // Testimonials array
          testimonials: [
            {
              text: page.testimonial_1_text,
              author: page.testimonial_1_author,
              rating: page.testimonial_1_rating,
              visible: page.testimonial_1_visible
            },
            {
              text: page.testimonial_2_text,
              author: page.testimonial_2_author,
              rating: page.testimonial_2_rating,
              visible: page.testimonial_2_visible
            },
            {
              text: page.testimonial_3_text,
              author: page.testimonial_3_author,
              rating: page.testimonial_3_rating,
              visible: page.testimonial_3_visible
            },
            {
              text: page.testimonial_4_text,
              author: page.testimonial_4_author,
              rating: page.testimonial_4_rating,
              visible: page.testimonial_4_visible
            }
          ]
        }
      }
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// GET COURSES WITH LOCALE
app.get('/api/courses', async (req, res) => {
  try {
    const locale = getLocale(req);
    
    const result = await queryWithFallback(
      'SELECT * FROM courses WHERE locale = $1 AND visible = true ORDER BY id',
      [locale]
    );
    
    res.json({
      data: result.map(course => ({
        id: course.id,
        locale: course.locale,
        attributes: {
          title: course.title,
          description: course.description,
          price: course.price,
          duration: course.duration,
          lessons: course.lessons,
          category: course.category,
          rating: course.rating,
          visible: course.visible
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// GET CONTACT PAGE WITH LOCALE
app.get('/api/contact-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    
    const result = await queryWithFallback(
      'SELECT * FROM contact_pages WHERE locale = $1 LIMIT 1',
      [locale]
    );
    
    if (!result || result.length === 0) {
      return res.json({
        data: {
          id: 1,
          locale: locale,
          attributes: {
            phone: '',
            email: '',
            address: '',
            officeHours: '',
            mapUrl: ''
          }
        }
      });
    }
    
    const contact = result[0];
    res.json({
      data: {
        id: contact.id,
        locale: contact.locale,
        attributes: {
          phone: contact.phone || '',
          email: contact.email || '',
          address: contact.address || '',
          officeHours: contact.office_hours || '',
          mapUrl: contact.map_url || ''
        }
      }
    });
  } catch (error) {
    console.error('Contact page error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// GET BLOG POSTS WITH LOCALE
app.get('/api/blog-posts', async (req, res) => {
  try {
    const locale = getLocale(req);
    
    const result = await queryWithFallback(
      'SELECT * FROM blog_posts WHERE locale = $1 ORDER BY created_at DESC',
      [locale]
    );
    
    res.json({
      data: result.map(post => ({
        id: post.id,
        locale: post.locale,
        attributes: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          publishedAt: post.published_at
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// GET TEACHERS WITH LOCALE
app.get('/api/teachers', async (req, res) => {
  try {
    const locale = getLocale(req);
    
    const result = await queryWithFallback(
      'SELECT * FROM teachers WHERE locale = $1 ORDER BY "order"',
      [locale]
    );
    
    res.json({
      data: result.map(teacher => ({
        id: teacher.id,
        locale: teacher.locale,
        attributes: {
          name: teacher.name,
          role: teacher.role,
          bio: teacher.bio,
          linkedin: teacher.linkedin,
          twitter: teacher.twitter,
          order: teacher.order
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// ==================== LOCALE-SPECIFIC ROUTES ====================

// Alternative: Locale in path
app.get('/api/:locale/home-page', async (req, res) => {
  req.params.locale = req.params.locale; // Set locale from path
  return app._router.handle(req, res);
});

app.get('/api/:locale/courses', async (req, res) => {
  req.params.locale = req.params.locale;
  return app._router.handle(req, res);
});

app.get('/api/:locale/contact-page', async (req, res) => {
  req.params.locale = req.params.locale;
  return app._router.handle(req, res);
});

// ==================== LOCALE MANAGEMENT ENDPOINTS ====================

// Get available locales
app.get('/api/locales', async (req, res) => {
  try {
    const result = await queryDatabase(`
      SELECT DISTINCT locale FROM (
        SELECT locale FROM home_pages
        UNION
        SELECT locale FROM courses
        UNION
        SELECT locale FROM contact_pages
      ) as locales
      ORDER BY locale
    `);
    
    res.json({
      locales: result.map(r => r.locale),
      default: 'en',
      rtl: ['he', 'ar'] // RTL languages
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Get translation status
app.get('/api/translation-status', async (req, res) => {
  try {
    const queries = [
      queryDatabase('SELECT locale, COUNT(*) as count FROM home_pages GROUP BY locale'),
      queryDatabase('SELECT locale, COUNT(*) as count FROM courses GROUP BY locale'),
      queryDatabase('SELECT locale, COUNT(*) as count FROM blog_posts GROUP BY locale'),
      queryDatabase('SELECT locale, COUNT(*) as count FROM teachers GROUP BY locale'),
      queryDatabase('SELECT locale, COUNT(*) as count FROM contact_pages GROUP BY locale')
    ];
    
    const [homePage, courses, blogPosts, teachers, contactPages] = await Promise.all(queries);
    
    res.json({
      status: {
        home_pages: homePage,
        courses: courses,
        blog_posts: blogPosts,
        teachers: teachers,
        contact_pages: contactPages
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// ==================== UPDATE OPERATIONS WITH LOCALE ====================

// UPDATE HOME PAGE WITH LOCALE
app.put('/api/home-page/:id', async (req, res) => {
  const { locale, ...updates } = req.body;
  const updateFields = [];
  
  // Build UPDATE query dynamically
  Object.keys(updates).forEach(key => {
    const snakeCase = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    updateFields.push(`${snakeCase} = '${updates[key]}'`);
  });
  
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  try {
    const localeClause = locale ? ` AND locale = '${locale}'` : '';
    const query = `UPDATE home_pages SET ${updateFields.join(', ')}, updated_at = NOW() 
                   WHERE id = ${req.params.id}${localeClause}`;
    await queryDatabase(query);
    
    res.json({
      success: true,
      message: 'Home page updated successfully',
      locale: locale || 'en',
      updatedFields: Object.keys(updates)
    });
  } catch (error) {
    res.status(500).json({ error: 'Update failed', details: error.message });
  }
});

// CREATE COURSE WITH LOCALE
app.post('/api/courses', async (req, res) => {
  const { locale = 'en', ...courseData } = req.body;
  
  try {
    const result = await queryDatabase(`
      INSERT INTO courses (locale, title, description, price, duration, lessons, category, rating, visible, published_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
      RETURNING *
    `, [locale, courseData.title, courseData.description, courseData.price, 
        courseData.duration, courseData.lessons, courseData.category, 
        courseData.rating, courseData.visible]);
    
    res.json({
      success: true,
      data: result[0],
      locale: locale
    });
  } catch (error) {
    res.status(500).json({ error: 'Create failed', details: error.message });
  }
});