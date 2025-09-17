
/**
 * MULTILINGUAL PAGE-BASED API ENDPOINTS
 * These endpoints support the new schema where each page has its own table
 * with content_en, content_ru, content_he columns
 */

// Helper function to get the correct content field based on locale
function getContentField(locale = 'en') {
  const validLocales = ['en', 'ru', 'he'];
  const selectedLocale = validLocales.includes(locale) ? locale : 'en';
  return `content_${selectedLocale}`;
}

// HOME PAGE - NEW MULTILINGUAL STRUCTURE
app.get('/api/nd/home-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    const contentField = getContentField(locale);

    console.log(`🌍 Fetching home page content for locale: ${locale}`);

    // Get all sections for the home page
    const query = `
      SELECT
        section_name,
        ${contentField} as content,
        COALESCE(
          CASE
            WHEN ${contentField} = '{}' OR ${contentField} IS NULL
            THEN content_en
            ELSE ${contentField}
          END,
          content_en
        ) as content_with_fallback,
        visible,
        display_order
      FROM nd_home_page
      WHERE visible = true
      ORDER BY display_order
    `;

    const sections = await queryDatabase(query);

    // Transform sections into structured response
    const pageData = {
      locale: locale,
      sections: {}
    };

    sections.forEach(section => {
      pageData.sections[section.section_name] = section.content_with_fallback || section.content || {};
    });

    res.json({
      data: {
        id: 1,
        attributes: pageData
      }
    });
  } catch (error) {
    console.error('❌ Error fetching home page:', error);
    res.status(500).json({ error: 'Failed to fetch home page content' });
  }
});

// ABOUT PAGE - NEW MULTILINGUAL STRUCTURE
app.get('/api/nd/about-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    const contentField = getContentField(locale);

    const query = `
      SELECT
        section_name,
        COALESCE(
          CASE
            WHEN ${contentField} = '{}' OR ${contentField} IS NULL
            THEN content_en
            ELSE ${contentField}
          END,
          content_en
        ) as content,
        visible,
        display_order
      FROM nd_about_page
      WHERE visible = true
      ORDER BY display_order
    `;

    const sections = await queryDatabase(query);

    const pageData = {
      locale: locale,
      sections: {}
    };

    sections.forEach(section => {
      pageData.sections[section.section_name] = section.content || {};
    });

    res.json({
      data: {
        id: 1,
        attributes: pageData
      }
    });
  } catch (error) {
    console.error('❌ Error fetching about page:', error);
    res.status(500).json({ error: 'Failed to fetch about page content' });
  }
});

// COURSES PAGE - NEW MULTILINGUAL STRUCTURE
app.get('/api/nd/courses-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    const contentField = getContentField(locale);

    // Get page sections
    const pageSections = await queryDatabase(`
      SELECT
        section_name,
        COALESCE(
          CASE
            WHEN ${contentField} = '{}' OR ${contentField} IS NULL
            THEN content_en
            ELSE ${contentField}
          END,
          content_en
        ) as content,
        visible,
        display_order
      FROM nd_courses_page
      WHERE visible = true
      ORDER BY display_order
    `);

    // Get actual courses data (multilingual)
    const titleField = locale === 'en' ? 'title' : `title_${locale}`;
    const descField = locale === 'en' ? 'description' : `description_${locale}`;

    const courses = await queryDatabase(`
      SELECT
        id,
        COALESCE(${titleField}, title) as title,
        COALESCE(${descField}, description) as description,
        price,
        instructor,
        image,
        category,
        rating,
        visible
      FROM nd_courses
      WHERE visible = true
      ORDER BY id DESC
    `);

    const pageData = {
      locale: locale,
      sections: {},
      courses: courses
    };

    pageSections.forEach(section => {
      pageData.sections[section.section_name] = section.content || {};
    });

    res.json({
      data: {
        id: 1,
        attributes: pageData
      }
    });
  } catch (error) {
    console.error('❌ Error fetching courses page:', error);
    res.status(500).json({ error: 'Failed to fetch courses page content' });
  }
});

// BLOG PAGE - NEW MULTILINGUAL STRUCTURE
app.get('/api/nd/blog-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    const contentField = getContentField(locale);

    // Get page sections
    const pageSections = await queryDatabase(`
      SELECT
        section_name,
        COALESCE(
          CASE
            WHEN ${contentField} = '{}' OR ${contentField} IS NULL
            THEN content_en
            ELSE ${contentField}
          END,
          content_en
        ) as content,
        visible,
        display_order
      FROM nd_blog_page
      WHERE visible = true
      ORDER BY display_order
    `);

    // Get blog posts (multilingual)
    const titleField = locale === 'en' ? 'title' : `title_${locale}`;
    const contentPostField = locale === 'en' ? 'content' : `content_${locale}`;

    const posts = await queryDatabase(`
      SELECT
        id,
        COALESCE(${titleField}, title) as title,
        COALESCE(${contentPostField}, content) as content,
        author,
        featured_image,
        published_at,
        slug
      FROM nd_blog_posts
      WHERE published_at IS NOT NULL
      ORDER BY published_at DESC
      LIMIT 10
    `);

    const pageData = {
      locale: locale,
      sections: {},
      posts: posts
    };

    pageSections.forEach(section => {
      pageData.sections[section.section_name] = section.content || {};
    });

    res.json({
      data: {
        id: 1,
        attributes: pageData
      }
    });
  } catch (error) {
    console.error('❌ Error fetching blog page:', error);
    res.status(500).json({ error: 'Failed to fetch blog page content' });
  }
});

// CONTACT PAGE - NEW MULTILINGUAL STRUCTURE
app.get('/api/nd/contact-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    const contentField = getContentField(locale);

    const query = `
      SELECT
        section_name,
        COALESCE(
          CASE
            WHEN ${contentField} = '{}' OR ${contentField} IS NULL
            THEN content_en
            ELSE ${contentField}
          END,
          content_en
        ) as content,
        visible,
        display_order
      FROM nd_contact_page
      WHERE visible = true
      ORDER BY display_order
    `;

    const sections = await queryDatabase(query);

    const pageData = {
      locale: locale,
      sections: {}
    };

    sections.forEach(section => {
      pageData.sections[section.section_name] = section.content || {};
    });

    res.json({
      data: {
        id: 1,
        attributes: pageData
      }
    });
  } catch (error) {
    console.error('❌ Error fetching contact page:', error);
    res.status(500).json({ error: 'Failed to fetch contact page content' });
  }
});

// PRICING PAGE - NEW MULTILINGUAL STRUCTURE
app.get('/api/nd/pricing-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    const contentField = getContentField(locale);

    const query = `
      SELECT
        section_name,
        COALESCE(
          CASE
            WHEN ${contentField} = '{}' OR ${contentField} IS NULL
            THEN content_en
            ELSE ${contentField}
          END,
          content_en
        ) as content,
        visible,
        display_order
      FROM nd_pricing_page
      WHERE visible = true
      ORDER BY display_order
    `;

    const sections = await queryDatabase(query);

    const pageData = {
      locale: locale,
      sections: {}
    };

    sections.forEach(section => {
      pageData.sections[section.section_name] = section.content || {};
    });

    res.json({
      data: {
        id: 1,
        attributes: pageData
      }
    });
  } catch (error) {
    console.error('❌ Error fetching pricing page:', error);
    res.status(500).json({ error: 'Failed to fetch pricing page content' });
  }
});

// UPDATE HOME PAGE SECTION - NEW MULTILINGUAL STRUCTURE
app.put('/api/nd/home-page/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const locale = getLocale(req);
    const contentField = getContentField(locale);
    const { content } = req.body;

    console.log(`📝 Updating home page section: ${section} for locale: ${locale}`);

    // Check if section exists
    const existing = await queryDatabase(
      'SELECT id FROM nd_home_page WHERE section_name = $1',
      [section]
    );

    if (existing.length > 0) {
      // Update existing section
      await queryDatabase(
        `UPDATE nd_home_page
         SET ${contentField} = $1,
             updated_at = NOW()
         WHERE section_name = $2`,
        [JSON.stringify(content), section]
      );
    } else {
      // Insert new section
      await queryDatabase(
        `INSERT INTO nd_home_page (section_name, ${contentField}, visible, display_order)
         VALUES ($1, $2, true, 999)`,
        [section, JSON.stringify(content)]
      );
    }

    res.json({
      success: true,
      message: `Section ${section} updated for locale ${locale}`
    });
  } catch (error) {
    console.error('❌ Error updating home page section:', error);
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// ADMIN API - GET ALL SECTIONS FOR A PAGE
app.get('/api/nd/admin/:page/sections', async (req, res) => {
  try {
    const { page } = req.params;
    const tableName = `nd_${page.replace(/-/g, '_')}_page`;

    console.log(`📋 Fetching all sections for ${tableName}`);

    const sections = await queryDatabase(`
      SELECT
        section_name,
        content_en,
        content_ru,
        content_he,
        visible,
        display_order
      FROM ${tableName}
      ORDER BY display_order
    `);

    res.json({
      data: sections
    });
  } catch (error) {
    console.error('❌ Error fetching sections:', error);
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

// ADMIN API - UPDATE ALL LANGUAGES FOR A SECTION
app.put('/api/nd/admin/:page/:section', async (req, res) => {
  try {
    const { page, section } = req.params;
    const { content_en, content_ru, content_he } = req.body;
    const tableName = `nd_${page.replace(/-/g, '_')}_page`;

    console.log(`📝 Updating all languages for ${tableName}.${section}`);

    await queryDatabase(
      `UPDATE ${tableName}
       SET content_en = $1,
           content_ru = $2,
           content_he = $3,
           updated_at = NOW()
       WHERE section_name = $4`,
      [
        JSON.stringify(content_en || {}),
        JSON.stringify(content_ru || {}),
        JSON.stringify(content_he || {}),
        section
      ]
    );

    res.json({
      success: true,
      message: `Updated all languages for ${section}`
    });
  } catch (error) {
    console.error('❌ Error updating section:', error);
    res.status(500).json({ error: 'Failed to update section' });
  }
});
