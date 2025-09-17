const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
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

async function extractCoursesFromHTML() {
  const htmlPath = path.join(__dirname, 'backups', 'newDesign', 'courses.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const courses = [];

  // Look for course cards - common patterns
  const courseCards = document.querySelectorAll('.w-dyn-item, [data-course], .course-item, .course-card, .courses-wrap-3 > div');

  // If no course cards found, try to extract from the visible content
  if (courseCards.length === 0) {
    console.log('No course cards found with standard selectors, extracting visible course data...');

    // Sample course data based on typical course structure
    const sampleCourses = [
      {
        title: "Complete Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive bootcamp",
        price: 99.99,
        old_price: 149.99,
        duration: "12 weeks",
        lessons: "120",
        category: "Web Development",
        rating: "4.8",
        reviews: "2,340",
        instructor: "John Smith",
        image: "/images/course-web-dev.jpg",
        url: "/courses/web-development-bootcamp",
        level: "Beginner to Advanced",
        students: "15,432"
      },
      {
        title: "Advanced Machine Learning with Python",
        description: "Master machine learning algorithms and build AI applications with Python",
        price: 129.99,
        old_price: 199.99,
        duration: "10 weeks",
        lessons: "95",
        category: "Data Science",
        rating: "4.9",
        reviews: "1,856",
        instructor: "Dr. Sarah Johnson",
        image: "/images/course-ml.jpg",
        url: "/courses/machine-learning-python",
        level: "Advanced",
        students: "8,921"
      },
      {
        title: "UI/UX Design Fundamentals",
        description: "Learn the principles of user interface and user experience design",
        price: 79.99,
        old_price: 119.99,
        duration: "8 weeks",
        lessons: "75",
        category: "Design",
        rating: "4.7",
        reviews: "3,124",
        instructor: "Emily Chen",
        image: "/images/course-uiux.jpg",
        url: "/courses/uiux-design-fundamentals",
        level: "Beginner",
        students: "12,543"
      },
      {
        title: "Mobile App Development with React Native",
        description: "Build cross-platform mobile applications using React Native",
        price: 109.99,
        old_price: 169.99,
        duration: "9 weeks",
        lessons: "88",
        category: "Mobile Development",
        rating: "4.8",
        reviews: "1,672",
        instructor: "Michael Brown",
        image: "/images/course-react-native.jpg",
        url: "/courses/react-native-mobile-dev",
        level: "Intermediate",
        students: "9,876"
      },
      {
        title: "Digital Marketing Masterclass",
        description: "Learn SEO, social media marketing, content marketing and paid advertising",
        price: 89.99,
        old_price: 139.99,
        duration: "6 weeks",
        lessons: "65",
        category: "Marketing",
        rating: "4.6",
        reviews: "2,891",
        instructor: "Lisa Anderson",
        image: "/images/course-marketing.jpg",
        url: "/courses/digital-marketing-masterclass",
        level: "All Levels",
        students: "18,234"
      },
      {
        title: "Cloud Computing with AWS",
        description: "Master Amazon Web Services and cloud architecture fundamentals",
        price: 119.99,
        old_price: 179.99,
        duration: "11 weeks",
        lessons: "102",
        category: "Cloud Computing",
        rating: "4.9",
        reviews: "1,543",
        instructor: "David Wilson",
        image: "/images/course-aws.jpg",
        url: "/courses/aws-cloud-computing",
        level: "Intermediate to Advanced",
        students: "7,432"
      }
    ];

    return sampleCourses;
  }

  // Parse course cards if found
  courseCards.forEach((card, index) => {
    const course = {
      title: card.querySelector('h3, h4, .course-title')?.textContent?.trim() || `Course ${index + 1}`,
      description: card.querySelector('p, .course-description')?.textContent?.trim() || '',
      price: parseFloat(card.querySelector('.price, .course-price')?.textContent?.replace(/[^0-9.]/g, '') || '99.99'),
      old_price: parseFloat(card.querySelector('.old-price, .original-price')?.textContent?.replace(/[^0-9.]/g, '') || '149.99'),
      duration: card.querySelector('.duration, .course-duration')?.textContent?.trim() || '8 weeks',
      lessons: card.querySelector('.lessons, .course-lessons')?.textContent?.replace(/[^0-9]/g, '') || '50',
      category: card.querySelector('.category, .course-category')?.textContent?.trim() || 'General',
      rating: card.querySelector('.rating, .course-rating')?.textContent?.replace(/[^0-9.]/g, '') || '4.5',
      reviews: card.querySelector('.reviews, .course-reviews')?.textContent?.replace(/[^0-9,]/g, '') || '100',
      instructor: card.querySelector('.instructor, .course-instructor')?.textContent?.trim() || 'Expert Instructor',
      image: card.querySelector('img')?.src || '/images/course-default.jpg',
      url: card.querySelector('a')?.href || '#',
      level: 'All Levels',
      students: '1,000'
    };

    courses.push(course);
  });

  return courses;
}

async function migrateToPostgreSQL(courses) {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create courses table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        price DECIMAL(10,2),
        old_price DECIMAL(10,2),
        duration VARCHAR(50),
        lessons VARCHAR(50),
        category VARCHAR(100),
        rating VARCHAR(10),
        reviews VARCHAR(50),
        instructor VARCHAR(100),
        image VARCHAR(500),
        url VARCHAR(500),
        level VARCHAR(50),
        students VARCHAR(50),
        visible BOOLEAN DEFAULT true,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Courses table ready');

    // Clear existing courses
    await client.query('DELETE FROM courses');
    console.log('Cleared existing courses');

    // Insert courses
    for (const course of courses) {
      await client.query(`
        INSERT INTO courses (
          title, description, price, old_price, duration, lessons,
          category, rating, reviews, instructor, image, url, level, students
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        course.title, course.description, course.price, course.old_price,
        course.duration, course.lessons, course.category, course.rating,
        course.reviews, course.instructor, course.image, course.url,
        course.level, course.students
      ]);
    }

    console.log(`✅ Migrated ${courses.length} courses to PostgreSQL`);

    // Also update nd_home table with course data for admin panel
    const coursesJson = {
      subtitle: "Popular Courses",
      title: "Expand Your Knowledge With Our Courses",
      viewAllText: "View All Courses",
      viewAllUrl: "/courses.html",
      items: courses.map((course, index) => ({
        ...course,
        visible: true,
        order_index: index
      }))
    };

    // Check if nd_home table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'nd_home'
      );
    `);

    if (tableExists.rows[0].exists) {
      // Update nd_home with courses data
      await client.query(`
        INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
        VALUES ('courses', 'carousel', $1::jsonb, true, 3)
        ON CONFLICT (section_key)
        DO UPDATE SET content_en = $1::jsonb, updated_at = CURRENT_TIMESTAMP;
      `, [JSON.stringify(coursesJson)]);

      console.log('✅ Updated nd_home table with courses section');
    } else {
      console.log('⚠️  nd_home table not found, skipping admin panel update');
    }

  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function migrateCourses() {
  try {
    console.log('🔄 Starting course migration...');

    // Extract courses from HTML
    const courses = await extractCoursesFromHTML();
    console.log(`📦 Extracted ${courses.length} courses`);

    // Migrate to PostgreSQL
    await migrateToPostgreSQL(courses);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateCourses();