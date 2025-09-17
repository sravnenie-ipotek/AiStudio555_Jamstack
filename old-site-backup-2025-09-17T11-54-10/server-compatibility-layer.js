
/**
 * BACKWARDS COMPATIBILITY LAYER
 * Maps old endpoints to new multilingual structure
 */

// Map old /api/home-page to new structure
app.get('/api/home-page-multilingual', async (req, res) => {
  try {
    const locale = getLocale(req);
    const contentField = getContentField(locale);

    // Get all sections from new table
    const sections = await queryDatabase(`
      SELECT
        section_name,
        COALESCE(
          CASE
            WHEN ${contentField} = '{}' OR ${contentField} IS NULL
            THEN content_en
            ELSE ${contentField}
          END,
          content_en
        ) as content
      FROM nd_home_page
      WHERE visible = true
      ORDER BY display_order
    `);

    // Transform to old format for compatibility
    const homeData = {};

    sections.forEach(section => {
      const content = section.content || {};

      switch(section.section_name) {
        case 'hero':
          homeData.hero_title = content.title || '';
          homeData.hero_subtitle = content.subtitle || '';
          homeData.hero_description = content.description || '';
          break;

        case 'awards':
          homeData.awards_title = content.title || 'Awards That Define Our Excellence.';
          homeData.awards_subtitle = content.subtitle || '';
          if (content.items && content.items.length > 0) {
            content.items.forEach((item, idx) => {
              homeData[`award_${idx + 1}_year`] = item.year || '';
              homeData[`award_${idx + 1}_title`] = item.title || '';
              homeData[`award_${idx + 1}_description`] = item.description || '';
            });
          }
          break;

        case 'testimonials':
          homeData.testimonials_title = content.title || '';
          homeData.testimonials_subtitle = content.subtitle || '';
          if (content.items && content.items.length > 0) {
            content.items.forEach((item, idx) => {
              homeData[`testimonial_${idx + 1}_name`] = item.name || '';
              homeData[`testimonial_${idx + 1}_role`] = item.role || '';
              homeData[`testimonial_${idx + 1}_comment`] = item.comment || '';
              homeData[`testimonial_${idx + 1}_rating`] = item.rating || 5;
            });
          }
          break;

        case 'faq':
          homeData.faq_title = content.title || '';
          if (content.questions && content.questions.length > 0) {
            content.questions.forEach((item, idx) => {
              homeData[`faq_${idx + 1}_title`] = item.question || '';
              homeData[`faq_${idx + 1}_content`] = item.answer || '';
            });
          }
          break;

        // Add more section mappings as needed
      }
    });

    // Add static fields for compatibility
    homeData.id = 1;
    homeData.locale = locale;
    homeData.published_at = new Date().toISOString();

    // Return in old format
    res.json({
      data: [{
        ...homeData
      }]
    });
  } catch (error) {
    console.error('❌ Error in compatibility layer:', error);
    res.status(500).json({ error: 'Failed to fetch home page' });
  }
});
