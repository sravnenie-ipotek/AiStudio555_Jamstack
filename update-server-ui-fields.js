// ULTRATHINK: Script to update server.js with UI fields support
// This adds the migration endpoint and updates the home-page response

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, 'server.js');
const serverContent = fs.readFileSync(serverPath, 'utf8');

// 1. Find the location to add migration endpoint (before app.listen)
const listenIndex = serverContent.indexOf('app.listen(PORT');

// 2. Create the migration endpoint code
const migrationEndpoint = `
// ==================== UI MIGRATION ENDPOINT ====================
// ULTRATHINK: Migration endpoint for UI fields
app.post('/api/migrate-ui', async (req, res) => {
  try {
    // Simple auth check
    const token = req.headers['x-migration-token'];
    if (token !== 'ultrathink-2024') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { action, fields } = req.body;
    
    if (action !== 'migrate_ui_fields') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    console.log('🚀 Starting UI fields migration...');
    
    // Add columns for each field
    const alterPromises = [];
    for (const [fieldName, translations] of Object.entries(fields)) {
      // Add column if it doesn't exist
      alterPromises.push(
        queryDatabase(\`
          ALTER TABLE home_pages 
          ADD COLUMN IF NOT EXISTS \${fieldName} VARCHAR(500)
        \`).catch(err => console.log(\`Column \${fieldName} might already exist\`))
      );
    }
    
    await Promise.all(alterPromises);
    console.log('✅ Columns added/verified');
    
    // Update English values
    const englishUpdates = [];
    for (const [fieldName, translations] of Object.entries(fields)) {
      englishUpdates.push(\`\${fieldName} = '\${translations.en.replace(/'/g, "''")}'\`);
    }
    
    await queryDatabase(\`
      UPDATE home_pages 
      SET \${englishUpdates.join(', ')}
      WHERE locale = 'en'
    \`);
    console.log('✅ English values updated');
    
    // Update Russian values
    const russianUpdates = [];
    for (const [fieldName, translations] of Object.entries(fields)) {
      russianUpdates.push(\`\${fieldName} = '\${translations.ru.replace(/'/g, "''")}'\`);
    }
    
    // Check if Russian record exists
    const ruExists = await queryDatabase("SELECT id FROM home_pages WHERE locale = 'ru'");
    if (ruExists.length === 0) {
      // Copy from English first
      await queryDatabase(\`
        INSERT INTO home_pages (locale, title, hero_title, hero_subtitle, hero_description,
          hero_section_visible, featured_courses_title, featured_courses_description,
          featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
          companies_title, companies_description, companies_visible, testimonials_title,
          testimonials_subtitle, testimonials_visible, courses, testimonials, published_at)
        SELECT 'ru', title, hero_title, hero_subtitle, hero_description,
          hero_section_visible, featured_courses_title, featured_courses_description,
          featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
          companies_title, companies_description, companies_visible, testimonials_title,
          testimonials_subtitle, testimonials_visible, courses, testimonials, NOW()
        FROM home_pages WHERE locale = 'en' LIMIT 1
      \`);
    }
    
    await queryDatabase(\`
      UPDATE home_pages 
      SET \${russianUpdates.join(', ')}
      WHERE locale = 'ru'
    \`);
    console.log('✅ Russian values updated');
    
    // Update Hebrew values
    const hebrewUpdates = [];
    for (const [fieldName, translations] of Object.entries(fields)) {
      if (translations.he) {
        hebrewUpdates.push(\`\${fieldName} = '\${translations.he.replace(/'/g, "''")}'\`);
      }
    }
    
    // Check if Hebrew record exists
    const heExists = await queryDatabase("SELECT id FROM home_pages WHERE locale = 'he'");
    if (heExists.length === 0) {
      // Copy from English first
      await queryDatabase(\`
        INSERT INTO home_pages (locale, title, hero_title, hero_subtitle, hero_description,
          hero_section_visible, featured_courses_title, featured_courses_description,
          featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
          companies_title, companies_description, companies_visible, testimonials_title,
          testimonials_subtitle, testimonials_visible, courses, testimonials, published_at)
        SELECT 'he', title, hero_title, hero_subtitle, hero_description,
          hero_section_visible, featured_courses_title, featured_courses_description,
          featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
          companies_title, companies_description, companies_visible, testimonials_title,
          testimonials_subtitle, testimonials_visible, courses, testimonials, NOW()
        FROM home_pages WHERE locale = 'en' LIMIT 1
      \`);
    }
    
    if (hebrewUpdates.length > 0) {
      await queryDatabase(\`
        UPDATE home_pages 
        SET \${hebrewUpdates.join(', ')}
        WHERE locale = 'he'
      \`);
      console.log('✅ Hebrew values updated');
    }
    
    res.json({
      success: true,
      message: 'UI fields migration completed',
      fieldsAdded: Object.keys(fields).length
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: 'Migration failed', details: error.message });
  }
});

`;

// 3. Find where the home-page attributes are returned and update it
const attributesStartIndex = serverContent.indexOf('attributes: {', serverContent.indexOf("app.get('/api/home-page'"));
const attributesEndIndex = serverContent.indexOf('courses: [', attributesStartIndex);

// 4. Create the new attributes section with all UI fields
const newAttributesSection = `attributes: {
          // Hero Section
          title: homeData.title,
          heroTitle: homeData.hero_title,
          heroSubtitle: homeData.hero_subtitle,
          heroDescription: homeData.hero_description,
          heroSectionVisible: Boolean(homeData.hero_section_visible),
          
          // Featured Courses Section
          featuredCoursesTitle: homeData.featured_courses_title,
          featuredCoursesDescription: homeData.featured_courses_description,
          featuredCoursesVisible: Boolean(homeData.featured_courses_visible),
          
          // About Section
          aboutTitle: homeData.about_title,
          aboutSubtitle: homeData.about_subtitle,
          aboutDescription: homeData.about_description,
          aboutVisible: Boolean(homeData.about_visible),
          
          // Companies Section
          companiesTitle: homeData.companies_title,
          companiesDescription: homeData.companies_description,
          companiesVisible: Boolean(homeData.companies_visible),
          
          // Testimonials Section
          testimonialsTitle: homeData.testimonials_title,
          testimonialsSubtitle: homeData.testimonials_subtitle,
          testimonialsVisible: Boolean(homeData.testimonials_visible),
          
          // Navigation Labels
          navHome: homeData.nav_home || 'Home',
          navCourses: homeData.nav_courses || 'Courses',
          navTeachers: homeData.nav_teachers || 'Teachers',
          navBlog: homeData.nav_blog || 'Blog',
          navCareerCenter: homeData.nav_career_center || 'Career Center',
          navAbout: homeData.nav_about || 'About Us',
          navContact: homeData.nav_contact || 'Contact',
          navPricing: homeData.nav_pricing || 'Pricing Plans',
          
          // Button Texts/CTAs
          btnSignUpToday: homeData.btn_sign_up_today || 'Sign Up Today',
          btnLearnMore: homeData.btn_learn_more || 'Learn More',
          btnViewAllCourses: homeData.btn_view_all_courses || 'View All Courses',
          btnGetStarted: homeData.btn_get_started || 'Get Started',
          btnContactUs: homeData.btn_contact_us || 'Contact Us',
          btnEnrollNow: homeData.btn_enroll_now || 'Enroll Now',
          btnStartLearning: homeData.btn_start_learning || 'Start Learning',
          btnExploreCourses: homeData.btn_explore_courses || 'Explore Courses',
          btnViewDetails: homeData.btn_view_details || 'View Details',
          btnBookConsultation: homeData.btn_book_consultation || 'Book Consultation',
          btnDownloadBrochure: homeData.btn_download_brochure || 'Download Brochure',
          btnWatchDemo: homeData.btn_watch_demo || 'Watch Demo',
          btnFreeTrial: homeData.btn_free_trial || 'Start Free Trial',
          
          // Form Labels
          formLabelEmail: homeData.form_label_email || 'Email',
          formLabelName: homeData.form_label_name || 'Name',
          formLabelPhone: homeData.form_label_phone || 'Phone',
          formLabelMessage: homeData.form_label_message || 'Message',
          formLabelSubject: homeData.form_label_subject || 'Subject',
          formPlaceholderEmail: homeData.form_placeholder_email || 'Enter your email',
          formPlaceholderName: homeData.form_placeholder_name || 'Enter your name',
          formPlaceholderPhone: homeData.form_placeholder_phone || 'Enter your phone',
          formPlaceholderMessage: homeData.form_placeholder_message || 'Enter your message',
          formBtnSubmit: homeData.form_btn_submit || 'Submit',
          formBtnSubscribe: homeData.form_btn_subscribe || 'Subscribe',
          formBtnSend: homeData.form_btn_send || 'Send Message',
          
          // Statistics Labels and Numbers
          statsCoursesLabel: homeData.stats_courses_label || 'Courses',
          statsLearnersLabel: homeData.stats_learners_label || 'Learners',
          statsYearsLabel: homeData.stats_years_label || 'Years',
          statsSuccessRateLabel: homeData.stats_success_rate_label || 'Success Rate',
          statsCountriesLabel: homeData.stats_countries_label || 'Countries',
          statsInstructorsLabel: homeData.stats_instructors_label || 'Expert Instructors',
          statsCoursesNumber: homeData.stats_courses_number || '125+',
          statsLearnersNumber: homeData.stats_learners_number || '14,000+',
          statsYearsNumber: homeData.stats_years_number || '10+',
          statsSuccessRateNumber: homeData.stats_success_rate_number || '95%',
          statsCountriesNumber: homeData.stats_countries_number || '45+',
          statsInstructorsNumber: homeData.stats_instructors_number || '200+',
          
          // System Messages
          msgLoading: homeData.msg_loading || 'Loading...',
          msgError: homeData.msg_error || 'An error occurred. Please try again.',
          msgSuccess: homeData.msg_success || 'Success!',
          msgFormSuccess: homeData.msg_form_success || 'Thank you! We will contact you soon.',
          msgSubscribeSuccess: homeData.msg_subscribe_success || 'Successfully subscribed to newsletter!',
          msgNoCourses: homeData.msg_no_courses || 'No courses available at the moment',
          msgComingSoon: homeData.msg_coming_soon || 'Coming Soon',
          msgEnrollmentClosed: homeData.msg_enrollment_closed || 'Enrollment Closed',
          msgLimitedSeats: homeData.msg_limited_seats || 'Limited Seats Available',
          
          // UI Elements
          uiSearchPlaceholder: homeData.ui_search_placeholder || 'Search courses...',
          uiFilterAll: homeData.ui_filter_all || 'All',
          uiSortBy: homeData.ui_sort_by || 'Sort By',
          uiViewMode: homeData.ui_view_mode || 'View',
          uiGridView: homeData.ui_grid_view || 'Grid',
          uiListView: homeData.ui_list_view || 'List',
          uiReadMore: homeData.ui_read_more || 'Read More',
          uiShowLess: homeData.ui_show_less || 'Show Less',
          uiBackToTop: homeData.ui_back_to_top || 'Back to Top',
          uiShare: homeData.ui_share || 'Share',
          uiPrint: homeData.ui_print || 'Print',
          
          // Individual Courses (6 courses)
          `;

// 5. Insert the migration endpoint before app.listen
const updatedContent = serverContent.slice(0, listenIndex) + 
                      migrationEndpoint + '\n' +
                      serverContent.slice(listenIndex);

// 6. Write the updated server.js
fs.writeFileSync(serverPath + '.backup', serverContent); // Backup first
console.log('✅ Created backup: server.js.backup');

// Now update the attributes section
const finalContent = updatedContent.replace(
  /attributes: \{[\s\S]*?\/\/ Individual Courses \(6 courses\)/,
  newAttributesSection
);

fs.writeFileSync(serverPath, finalContent);
console.log('✅ Updated server.js with UI fields support');
console.log('\n📋 Changes made:');
console.log('  1. Added /api/migrate-ui endpoint for migration');
console.log('  2. Updated /api/home-page to return all UI fields');
console.log('  3. Added 63 new UI fields to the response');
console.log('\n🚀 Next steps:');
console.log('  1. Deploy to Railway: git push');
console.log('  2. Run migration: node migrate-ui-production.js');
console.log('  3. Test API: curl https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=ru');