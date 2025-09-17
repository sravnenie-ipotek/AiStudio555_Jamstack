const { Client } = require('pg');

// Database configuration
const dbConfig = process.env.DATABASE_URL ?
  (process.env.DATABASE_URL.includes('localhost') ? {
    connectionString: process.env.DATABASE_URL,
    ssl: false
  } : {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }) : {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'aistudio_db',
    ssl: false
  };

async function createNdCoursesTable() {
  const client = new Client(dbConfig);

  try {
    console.log('🔄 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Step 1: Create nd_courses table
    console.log('\n📊 Creating nd_courses table...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS nd_courses (
        id SERIAL PRIMARY KEY,
        course_key VARCHAR(100) UNIQUE,

        -- Basic Information
        title VARCHAR(255) NOT NULL,
        description TEXT,
        short_description VARCHAR(500),

        -- Pricing
        price DECIMAL(10, 2),
        old_price DECIMAL(10, 2),
        currency VARCHAR(10) DEFAULT 'USD',

        -- Course Details
        duration VARCHAR(100),
        level VARCHAR(50),
        category VARCHAR(100),
        instructor VARCHAR(255),
        language VARCHAR(50) DEFAULT 'English',

        -- Media
        image TEXT,
        video_url TEXT,
        thumbnail TEXT,

        -- Links
        url TEXT,
        enrollment_url TEXT,
        syllabus_url TEXT,

        -- Statistics
        rating DECIMAL(2, 1),
        reviews_count INTEGER DEFAULT 0,
        students_count INTEGER DEFAULT 0,
        lessons_count INTEGER DEFAULT 0,
        hours_count DECIMAL(5, 2),

        -- Features (JSON array)
        features JSONB DEFAULT '[]',
        syllabus JSONB DEFAULT '[]',
        requirements JSONB DEFAULT '[]',
        what_you_learn JSONB DEFAULT '[]',

        -- Localized Content
        title_ru VARCHAR(255),
        description_ru TEXT,
        short_description_ru VARCHAR(500),
        title_he VARCHAR(255),
        description_he TEXT,
        short_description_he VARCHAR(500),

        -- Status & Visibility
        featured BOOLEAN DEFAULT false,
        visible BOOLEAN DEFAULT true,
        published BOOLEAN DEFAULT true,
        enrollment_open BOOLEAN DEFAULT true,

        -- SEO
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords TEXT,
        slug VARCHAR(255),

        -- Order & Organization
        order_index INTEGER DEFAULT 0,
        tags JSONB DEFAULT '[]',

        -- Timestamps
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ nd_courses table created successfully');

    // Step 2: Create indexes for better performance
    console.log('\n🔍 Creating indexes...');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_nd_courses_visible ON nd_courses(visible);
      CREATE INDEX IF NOT EXISTS idx_nd_courses_featured ON nd_courses(featured);
      CREATE INDEX IF NOT EXISTS idx_nd_courses_category ON nd_courses(category);
      CREATE INDEX IF NOT EXISTS idx_nd_courses_order ON nd_courses(order_index);
      CREATE INDEX IF NOT EXISTS idx_nd_courses_published ON nd_courses(published_at);
      CREATE INDEX IF NOT EXISTS idx_nd_courses_slug ON nd_courses(slug);
    `);

    console.log('✅ Indexes created successfully');

    // Step 3: Get existing courses from nd_home table
    console.log('\n📦 Fetching existing courses from nd_home...');

    const result = await client.query(`
      SELECT content_en, content_ru, content_he
      FROM nd_home
      WHERE section_key = 'courses'
    `);

    if (result.rows.length > 0) {
      const coursesData = result.rows[0];
      const coursesEn = coursesData.content_en?.items || [];
      const coursesRu = coursesData.content_ru?.items || [];
      const coursesHe = coursesData.content_he?.items || [];

      console.log(`Found ${coursesEn.length} courses in English content`);

      // Step 4: Migrate courses to nd_courses table
      console.log('\n🚀 Migrating courses to nd_courses table...');

      for (let i = 0; i < coursesEn.length; i++) {
        const courseEn = coursesEn[i];
        const courseRu = coursesRu[i] || {};
        const courseHe = coursesHe[i] || {};

        // Generate course_key from title or use index
        const courseKey = courseEn.title ?
          courseEn.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') :
          `course-${i + 1}`;

        // Check if course already exists
        const existingCourse = await client.query(
          'SELECT id FROM nd_courses WHERE course_key = $1',
          [courseKey]
        );

        if (existingCourse.rows.length === 0) {
          await client.query(`
            INSERT INTO nd_courses (
              course_key,
              title, description, short_description,
              price, old_price,
              duration, level, category, instructor,
              image, video_url, url,
              rating, reviews_count, students_count, lessons_count,
              features, syllabus,
              title_ru, description_ru, short_description_ru,
              title_he, description_he, short_description_he,
              featured, visible,
              order_index
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
          `, [
            courseKey,
            courseEn.title || `Course ${i + 1}`,
            courseEn.description || '',
            courseEn.short_description || '',
            courseEn.price || null,
            courseEn.old_price || null,
            courseEn.duration || '',
            courseEn.level || 'All Levels',
            courseEn.category || 'General',
            courseEn.instructor || '',
            courseEn.image || '',
            courseEn.video_url || '',
            courseEn.url || courseEn.link || '',
            parseFloat(courseEn.rating) || null,
            parseInt(courseEn.reviews?.replace(/[^0-9]/g, '')) || 0,
            parseInt(courseEn.students) || 0,
            parseInt(courseEn.lessons?.replace(/[^0-9]/g, '')) || 0,
            JSON.stringify(courseEn.features || []),
            JSON.stringify(courseEn.syllabus || []),
            courseRu.title || '',
            courseRu.description || '',
            courseRu.short_description || '',
            courseHe.title || '',
            courseHe.description || '',
            courseHe.short_description || '',
            courseEn.featured || false,
            courseEn.visible !== false,
            courseEn.order_index || i
          ]);

          console.log(`✅ Migrated course: ${courseEn.title || `Course ${i + 1}`}`);
        } else {
          console.log(`⏭️  Skipping existing course: ${courseKey}`);
        }
      }

      // Step 5: Update nd_home to reference the new table
      console.log('\n📝 Updating nd_home courses section to reference nd_courses table...');

      const updatedContent = {
        title: coursesData.content_en?.title || "Expand Your Knowledge With Our Courses",
        subtitle: coursesData.content_en?.subtitle || "Popular Courses",
        viewAllText: coursesData.content_en?.viewAllText || "View All Courses",
        viewAllUrl: coursesData.content_en?.viewAllUrl || "/courses.html",
        useTable: true,
        tableName: "nd_courses"
      };

      await client.query(`
        UPDATE nd_home
        SET content_en = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE section_key = 'courses'
      `, [JSON.stringify(updatedContent)]);

      console.log('✅ Updated nd_home to reference nd_courses table');
    } else {
      console.log('ℹ️  No existing courses found in nd_home');
    }

    // Step 6: Show summary
    const coursesCount = await client.query('SELECT COUNT(*) FROM nd_courses');
    console.log('\n📊 Migration Summary:');
    console.log(`   - Total courses in nd_courses: ${coursesCount.rows[0].count}`);
    console.log('   - Table structure: Optimized with proper columns');
    console.log('   - Indexes: Created for performance');
    console.log('   - Ready for: CRUD operations via API');

    console.log('\n🎉 nd_courses table created and data migrated successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
    console.log('👋 Database connection closed');
  }
}

// Run the migration
createNdCoursesTable();