// ND Courses API Endpoints
// Add this code to your server.js file

// ============================================
// ND COURSES API ENDPOINTS
// ============================================

// GET all courses
app.get('/api/nd/courses', async (req, res) => {
  try {
    const { locale = 'en', featured = null, category = null, limit = null } = req.query;

    let query = `
      SELECT
        id, course_key,
        COALESCE(
          CASE
            WHEN $1 = 'ru' THEN NULLIF(title_ru, '')
            WHEN $1 = 'he' THEN NULLIF(title_he, '')
          END,
          title
        ) as title,
        COALESCE(
          CASE
            WHEN $1 = 'ru' THEN NULLIF(description_ru, '')
            WHEN $1 = 'he' THEN NULLIF(description_he, '')
          END,
          description
        ) as description,
        COALESCE(
          CASE
            WHEN $1 = 'ru' THEN NULLIF(short_description_ru, '')
            WHEN $1 = 'he' THEN NULLIF(short_description_he, '')
          END,
          short_description
        ) as short_description,
        price, old_price, currency,
        duration, level, category, instructor, language,
        image, video_url, thumbnail, url,
        rating, reviews_count, students_count, lessons_count,
        features, syllabus, requirements, what_you_learn,
        featured, visible, published, enrollment_open,
        order_index, tags,
        created_at, updated_at
      FROM nd_courses
      WHERE visible = true AND published = true
    `;

    const params = [locale];
    let paramIndex = 2;

    if (featured !== null) {
      query += ` AND featured = $${paramIndex}`;
      params.push(featured === 'true');
      paramIndex++;
    }

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    query += ' ORDER BY featured DESC, order_index ASC, created_at DESC';

    if (limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
    }

    const courses = await queryDatabase(query, params);

    res.json({
      success: true,
      data: courses,
      meta: {
        total: courses.length,
        locale: locale
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single course by ID or slug
app.get('/api/nd/courses/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const { locale = 'en' } = req.query;

    const isNumeric = /^\d+$/.test(identifier);

    const query = `
      SELECT
        id, course_key,
        COALESCE(
          CASE
            WHEN $1 = 'ru' THEN NULLIF(title_ru, '')
            WHEN $1 = 'he' THEN NULLIF(title_he, '')
          END,
          title
        ) as title,
        COALESCE(
          CASE
            WHEN $1 = 'ru' THEN NULLIF(description_ru, '')
            WHEN $1 = 'he' THEN NULLIF(description_he, '')
          END,
          description
        ) as description,
        COALESCE(
          CASE
            WHEN $1 = 'ru' THEN NULLIF(short_description_ru, '')
            WHEN $1 = 'he' THEN NULLIF(short_description_he, '')
          END,
          short_description
        ) as short_description,
        price, old_price, currency,
        duration, level, category, instructor, language,
        image, video_url, thumbnail, url,
        rating, reviews_count, students_count, lessons_count,
        features, syllabus, requirements, what_you_learn,
        featured, visible, published, enrollment_open,
        meta_title, meta_description, meta_keywords, slug,
        order_index, tags,
        start_date, end_date,
        created_at, updated_at
      FROM nd_courses
      WHERE ${isNumeric ? 'id = $2' : '(course_key = $2 OR slug = $2)'}
    `;

    const params = [locale, identifier];
    const courses = await queryDatabase(query, params);

    if (courses.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({
      success: true,
      data: courses[0]
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE new course
app.post('/api/nd/courses', async (req, res) => {
  try {
    const {
      title, description, short_description,
      price, old_price, currency = 'USD',
      duration, level, category, instructor,
      image, video_url, url,
      rating, reviews_count, students_count, lessons_count,
      features = [], syllabus = [],
      featured = false, visible = true,
      locale = 'en'
    } = req.body;

    // Generate course_key
    const courseKey = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');

    const query = `
      INSERT INTO nd_courses (
        course_key, title, description, short_description,
        price, old_price, currency,
        duration, level, category, instructor,
        image, video_url, url,
        rating, reviews_count, students_count, lessons_count,
        features, syllabus,
        featured, visible,
        order_index
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,
        (SELECT COALESCE(MAX(order_index), 0) + 1 FROM nd_courses)
      )
      RETURNING *
    `;

    const params = [
      courseKey, title, description, short_description,
      price, old_price, currency,
      duration, level, category, instructor,
      image, video_url, url,
      rating, reviews_count, students_count, lessons_count,
      JSON.stringify(features), JSON.stringify(syllabus),
      featured, visible
    ];

    const result = await queryDatabase(query, params);

    res.json({
      success: true,
      data: result[0],
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE course
app.put('/api/nd/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { locale = 'en' } = req.query;
    const updates = req.body;

    // Build dynamic UPDATE query
    const updateFields = [];
    const values = [];
    let valueIndex = 1;

    // Define which fields can be updated
    const allowedFields = [
      'title', 'description', 'short_description',
      'price', 'old_price', 'currency',
      'duration', 'level', 'category', 'instructor',
      'image', 'video_url', 'url',
      'rating', 'reviews_count', 'students_count', 'lessons_count',
      'features', 'syllabus', 'requirements', 'what_you_learn',
      'featured', 'visible', 'published', 'enrollment_open',
      'meta_title', 'meta_description', 'meta_keywords', 'slug',
      'order_index', 'tags'
    ];

    // Handle localized fields
    if (locale === 'ru') {
      allowedFields.push('title_ru', 'description_ru', 'short_description_ru');
    } else if (locale === 'he') {
      allowedFields.push('title_he', 'description_he', 'short_description_he');
    }

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${valueIndex}`);
        // Handle JSON fields
        if (['features', 'syllabus', 'requirements', 'what_you_learn', 'tags'].includes(key)) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        valueIndex++;
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE nd_courses
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    const result = await queryDatabase(query, values);

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({
      success: true,
      data: result[0],
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE course
app.delete('/api/nd/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await queryDatabase(
      'DELETE FROM nd_courses WHERE id = $1 RETURNING id, title',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({
      success: true,
      message: `Course "${result[0].title}" deleted successfully`,
      data: { id: result[0].id }
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE course visibility
app.patch('/api/nd/courses/:id/visibility', async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;

    const result = await queryDatabase(
      'UPDATE nd_courses SET visible = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, title, visible',
      [visible, id]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    res.json({
      success: true,
      message: `Course visibility updated`,
      data: result[0]
    });
  } catch (error) {
    console.error('Error updating visibility:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// REORDER courses
app.patch('/api/nd/courses/reorder', async (req, res) => {
  try {
    const { courses } = req.body; // Array of { id, order_index }

    for (const course of courses) {
      await queryDatabase(
        'UPDATE nd_courses SET order_index = $1 WHERE id = $2',
        [course.order_index, course.id]
      );
    }

    res.json({
      success: true,
      message: 'Courses reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering courses:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});