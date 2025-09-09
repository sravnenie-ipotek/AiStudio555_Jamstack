#!/usr/bin/env node

/**
 * Setup Career Pages - Creates tables and seeds initial data
 * Run this to set up Career Orientation and Career Center pages
 */

const { Client } = require('pg');

async function setupCareerPages() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found. Please set it in your environment.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // 1. Create Career Orientation Pages table
    console.log('📊 Creating career_orientation_pages table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS career_orientation_pages (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(5) DEFAULT 'en',
        title VARCHAR(255),
        subtitle VARCHAR(500),
        description TEXT,
        hero_title VARCHAR(255),
        hero_subtitle VARCHAR(500),
        hero_description TEXT,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create Career Center Pages table
    console.log('📊 Creating career_center_pages table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS career_center_pages (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(5) DEFAULT 'en',
        title VARCHAR(255),
        subtitle VARCHAR(500),
        description TEXT,
        hero_title VARCHAR(255),
        hero_subtitle VARCHAR(500),
        hero_description TEXT,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Seed Career Orientation Pages
    console.log('📋 Seeding Career Orientation Pages...');
    const careerOrientationPages = [
      {
        locale: 'en',
        title: 'Career Orientation Program',
        subtitle: 'Find Your Perfect Tech Career Path',
        description: 'Our comprehensive career orientation program helps you discover the perfect technology career path aligned with your interests, skills, and goals.',
        heroTitle: 'Find Your Path in Tech',
        heroSubtitle: 'Discover Your Perfect Career Match',
        heroDescription: 'Our AI-powered career orientation helps you identify the right technology career path based on your skills, interests, and market demand.'
      },
      {
        locale: 'ru',
        title: 'Программа карьерной ориентации',
        subtitle: 'Найдите свой идеальный путь в технологиях',
        description: 'Наша комплексная программа карьерной ориентации поможет вам найти идеальный карьерный путь в технологиях, соответствующий вашим интересам, навыкам и целям.',
        heroTitle: 'Найдите свой путь в IT',
        heroSubtitle: 'Откройте идеальное карьерное соответствие',
        heroDescription: 'Наша карьерная ориентация на основе ИИ помогает определить правильный технологический карьерный путь на основе ваших навыков, интересов и рыночного спроса.'
      },
      {
        locale: 'he',
        title: 'תוכנית הכוונה מקצועית',
        subtitle: 'מצא את מסלול הקריירה המושלם שלך בטכנולוגיה',
        description: 'תוכנית ההכוונה המקצועית המקיפה שלנו עוזרת לך לגלות את מסלול הקריירה הטכנולוגי המושלם המתאים לתחומי העניין, הכישורים והמטרות שלך.',
        heroTitle: 'מצא את הדרך שלך בהייטק',
        heroSubtitle: 'גלה את ההתאמה הקריירה המושלמת שלך',
        heroDescription: 'ההכוונה המקצועית המבוססת על AI שלנו עוזרת לך לזהות את מסלול הקריירה הטכנולוגי הנכון על בסיס הכישורים, תחומי העניין והביקוש בשוק.'
      }
    ];

    for (const page of careerOrientationPages) {
      const existing = await client.query(
        'SELECT id FROM career_orientation_pages WHERE locale = $1 LIMIT 1',
        [page.locale]
      );
      
      if (existing.rows.length > 0) {
        await client.query(`
          UPDATE career_orientation_pages 
          SET title = $2, subtitle = $3, description = $4, 
              hero_title = $5, hero_subtitle = $6, hero_description = $7,
              updated_at = NOW()
          WHERE locale = $1
        `, [page.locale, page.title, page.subtitle, page.description, page.heroTitle, page.heroSubtitle, page.heroDescription]);
        console.log(`  ✅ Updated ${page.locale} career orientation page`);
      } else {
        await client.query(`
          INSERT INTO career_orientation_pages (locale, title, subtitle, description, hero_title, hero_subtitle, hero_description, published_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `, [page.locale, page.title, page.subtitle, page.description, page.heroTitle, page.heroSubtitle, page.heroDescription]);
        console.log(`  ✅ Created ${page.locale} career orientation page`);
      }
    }

    // 4. Seed Career Center Pages
    console.log('🏢 Seeding Career Center Pages...');
    const careerCenterPages = [
      {
        locale: 'en',
        title: 'Career Center',
        subtitle: 'Your Gateway to Tech Careers',
        description: 'Access exclusive job opportunities, career resources, and professional development tools to accelerate your tech career.',
        heroTitle: 'Your Tech Career Hub',
        heroSubtitle: 'Connect with Top Tech Opportunities',
        heroDescription: 'Browse curated job opportunities, access exclusive career resources, and connect with industry mentors to accelerate your tech career.'
      },
      {
        locale: 'ru',
        title: 'Центр карьеры',
        subtitle: 'Ваш путь к карьере в технологиях',
        description: 'Получите доступ к эксклюзивным вакансиям, карьерным ресурсам и инструментам профессионального развития для ускорения вашей карьеры в технологиях.',
        heroTitle: 'Ваш центр технологической карьеры',
        heroSubtitle: 'Связь с лучшими возможностями в IT',
        heroDescription: 'Просматривайте отобранные вакансии, получайте доступ к эксклюзивным карьерным ресурсам и общайтесь с наставниками из индустрии.'
      },
      {
        locale: 'he',
        title: 'מרכז קריירה',
        subtitle: 'השער שלך לקריירה בטכנולוגיה',
        description: 'קבל גישה להזדמנויות עבודה בלעדיות, משאבי קריירה וכלי פיתוח מקצועי כדי להאיץ את הקריירה שלך בטכנולוגיה.',
        heroTitle: 'מרכז הקריירה הטכנולוגי שלך',
        heroSubtitle: 'התחבר להזדמנויות המובילות בהייטק',
        heroDescription: 'עיין בהזדמנויות עבודה מובחרות, קבל גישה למשאבי קריירה בלעדיים והתחבר עם מנטורים מהתעשייה.'
      }
    ];

    for (const page of careerCenterPages) {
      const existing = await client.query(
        'SELECT id FROM career_center_pages WHERE locale = $1 LIMIT 1',
        [page.locale]
      );
      
      if (existing.rows.length > 0) {
        await client.query(`
          UPDATE career_center_pages 
          SET title = $2, subtitle = $3, description = $4, 
              hero_title = $5, hero_subtitle = $6, hero_description = $7,
              updated_at = NOW()
          WHERE locale = $1
        `, [page.locale, page.title, page.subtitle, page.description, page.heroTitle, page.heroSubtitle, page.heroDescription]);
        console.log(`  ✅ Updated ${page.locale} career center page`);
      } else {
        await client.query(`
          INSERT INTO career_center_pages (locale, title, subtitle, description, hero_title, hero_subtitle, hero_description, published_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `, [page.locale, page.title, page.subtitle, page.description, page.heroTitle, page.heroSubtitle, page.heroDescription]);
        console.log(`  ✅ Created ${page.locale} career center page`);
      }
    }

    // 5. Create indexes
    console.log('🔍 Creating indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_career_orientation_pages_locale ON career_orientation_pages(locale)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_career_center_pages_locale ON career_center_pages(locale)');

    // 6. Verify the data
    console.log('\n📊 Verifying data...');
    const orientationCount = await client.query('SELECT locale, COUNT(*) as count FROM career_orientation_pages GROUP BY locale');
    const centerCount = await client.query('SELECT locale, COUNT(*) as count FROM career_center_pages GROUP BY locale');
    
    console.log('Career Orientation Pages:', orientationCount.rows);
    console.log('Career Center Pages:', centerCount.rows);

    console.log('\n✅ Career pages setup complete!');
    console.log('📌 You can now use the admin panel to manage career pages');
    console.log('🌐 API endpoints available:');
    console.log('   - GET /api/career-orientation-page');
    console.log('   - PUT /api/career-orientation-page');
    console.log('   - GET /api/career-center-page');
    console.log('   - PUT /api/career-center-page');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupCareerPages();
}

module.exports = { setupCareerPages };