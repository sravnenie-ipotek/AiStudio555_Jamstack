/**
 * Create nd_blog_page table for blog translation system
 * Based on the same structure as nd_home table
 */

const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aistudio_dev',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function createBlogPageTable() {
  try {
    console.log('🚀 Creating nd_blog_page table...');

    // Create the table with the same structure as nd_home
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nd_blog_page (
        id SERIAL PRIMARY KEY,
        section_key VARCHAR(100) UNIQUE NOT NULL,
        section_type VARCHAR(50),
        content_en JSONB,
        content_ru JSONB,
        content_he JSONB,
        visible BOOLEAN DEFAULT true,
        animations_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ nd_blog_page table created successfully');

    // Insert initial sections based on blog.html structure
    console.log('📝 Inserting initial blog page sections...');

    const sections = [
      {
        key: 'hero',
        type: 'banner',
        content_en: {
          title: 'Blog',
          breadcrumb_home: 'Home',
          breadcrumb_current: 'Blog'
        },
        content_ru: {
          title: 'Блог',
          breadcrumb_home: 'Главная',
          breadcrumb_current: 'Блог'
        },
        content_he: {
          title: 'בלוג',
          breadcrumb_home: 'בית',
          breadcrumb_current: 'בלוג'
        }
      },
      {
        key: 'main_content',
        type: 'content',
        content_en: {
          section_title: 'News & Articles',
          section_subtitle: 'Your Learning Journey with our experts.',
          section_description: 'Zohacous, we believe in a structured yet flexible approach to mentorship designed to help you achieve your goals at every step.',
          loading_text: 'Loading blog posts...'
        },
        content_ru: {
          section_title: 'Новости и Статьи',
          section_subtitle: 'Ваш путь обучения с нашими экспертами.',
          section_description: 'В Zohacous мы верим в структурированный, но гибкий подход к наставничеству, разработанный для достижения ваших целей на каждом этапе.',
          loading_text: 'Загрузка статей блога...'
        },
        content_he: {
          section_title: 'חדשות ומאמרים',
          section_subtitle: 'מסע הלמידה שלך עם המומחים שלנו.',
          section_description: 'ב-Zohacous, אנו מאמינים בגישה מובנית אך גמישה להדרכה המיועדת לעזור לך להשיג את המטרות שלך בכל שלב.',
          loading_text: 'טוען פוסטים בבלוג...'
        }
      },
      {
        key: 'track_section',
        type: 'animation',
        content_en: {
          track_tags: ['Start Learning', 'Browse Courses']
        },
        content_ru: {
          track_tags: ['Начать Обучение', 'Просмотр Курсов']
        },
        content_he: {
          track_tags: ['התחל ללמוד', 'עיין בקורסים']
        }
      },
      {
        key: 'cta_section',
        type: 'cta',
        content_en: {
          subtitle: 'Start Learning Today',
          title: 'Discover A World Of Learning Opportunities.',
          description: "Don't wait to transform career and unlock your full potential. join our community of passionate learners and gain access to a wide range of courses.",
          button_contact: 'get in touch',
          button_courses: 'Check Out Courses'
        },
        content_ru: {
          subtitle: 'Начните Обучение Сегодня',
          title: 'Откройте Мир Возможностей Обучения.',
          description: 'Не ждите, чтобы изменить карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу увлеченных учеников и получите доступ к широкому спектру курсов.',
          button_contact: 'связаться с нами',
          button_courses: 'Посмотреть Курсы'
        },
        content_he: {
          subtitle: 'התחל ללמוד היום',
          title: 'גלה עולם של הזדמנויות למידה.',
          description: 'אל תחכה כדי לשנות קריירה ולפתוח את מלא הפוטנציאל שלך. הצטרף לקהילה שלנו של לומדים נלהבים וקבל גישה למגוון רחב של קורסים.',
          button_contact: 'צור קשר',
          button_courses: 'עיין בקורסים'
        }
      },
      {
        key: 'ui_elements',
        type: 'ui',
        content_en: {
          read_article_button: 'Read Full Article',
          read_this_article: 'Read this Article',
          category_labels: {
            ai: 'AI & Machine Learning',
            web: 'Web Development',
            career: 'Career Development',
            data: 'Data Science',
            security: 'Cybersecurity',
            design: 'UI/UX Design',
            cloud: 'Cloud Computing',
            mobile: 'Mobile Development',
            devops: 'DevOps'
          }
        },
        content_ru: {
          read_article_button: 'Читать Полную Статью',
          read_this_article: 'Читать Эту Статью',
          category_labels: {
            ai: 'ИИ и Машинное Обучение',
            web: 'Веб-Разработка',
            career: 'Развитие Карьеры',
            data: 'Наука о Данных',
            security: 'Кибербезопасность',
            design: 'UI/UX Дизайн',
            cloud: 'Облачные Вычисления',
            mobile: 'Мобильная Разработка',
            devops: 'DevOps'
          }
        },
        content_he: {
          read_article_button: 'קרא מאמר מלא',
          read_this_article: 'קרא מאמר זה',
          category_labels: {
            ai: 'בינה מלאכותית ולמידת מכונה',
            web: 'פיתוח אתרים',
            career: 'פיתוח קריירה',
            data: 'מדעי הנתונים',
            security: 'אבטחת סייבר',
            design: 'עיצוב UI/UX',
            cloud: 'מחשוב ענן',
            mobile: 'פיתוח מובייל',
            devops: 'DevOps'
          }
        }
      },
      {
        key: 'navigation',
        type: 'menu',
        content_en: {
          home: 'Home',
          courses: 'Courses',
          pricing: 'Pricing',
          blog: 'Blog',
          teachers: 'Teachers',
          about_us: 'About Us',
          career_orientation: 'Career Orientation',
          career_center: 'Career Center'
        },
        content_ru: {
          home: 'Главная',
          courses: 'Курсы',
          pricing: 'Цены',
          blog: 'Блог',
          teachers: 'Преподаватели',
          about_us: 'О Нас',
          career_orientation: 'Профориентация',
          career_center: 'Центр Карьеры'
        },
        content_he: {
          home: 'בית',
          courses: 'קורסים',
          pricing: 'תמחור',
          blog: 'בלוג',
          teachers: 'מרצים',
          about_us: 'אודותינו',
          career_orientation: 'התמחות בקריירה',
          career_center: 'מרכז קריירה'
        }
      },
      {
        key: 'misc',
        type: 'miscellaneous',
        content_en: {
          sign_up_today: 'Sign Up Today',
          cart_quantity: '0',
          your_cart: 'Your Cart',
          subtotal: 'Subtotal',
          continue_checkout: 'Continue to Checkout',
          no_items_found: 'No items found.',
          product_not_available: 'Product is not available in this quantity.'
        },
        content_ru: {
          sign_up_today: 'Зарегистрироваться Сегодня',
          cart_quantity: '0',
          your_cart: 'Ваша Корзина',
          subtotal: 'Промежуточный Итог',
          continue_checkout: 'Продолжить Оформление',
          no_items_found: 'Товары не найдены.',
          product_not_available: 'Товар недоступен в данном количестве.'
        },
        content_he: {
          sign_up_today: 'הירשם היום',
          cart_quantity: '0',
          your_cart: 'העגלה שלך',
          subtotal: 'סכום ביניים',
          continue_checkout: 'המשך לתשלום',
          no_items_found: 'לא נמצאו פריטים.',
          product_not_available: 'המוצר אינו זמין בכמות זו.'
        }
      }
    ];

    for (const section of sections) {
      await pool.query(`
        INSERT INTO nd_blog_page (section_key, section_type, content_en, content_ru, content_he)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (section_key)
        DO UPDATE SET
          content_en = EXCLUDED.content_en,
          content_ru = EXCLUDED.content_ru,
          content_he = EXCLUDED.content_he,
          updated_at = NOW()
      `, [section.key, section.type, JSON.stringify(section.content_en), JSON.stringify(section.content_ru), JSON.stringify(section.content_he)]);

      console.log(`✅ Section '${section.key}' added/updated`);
    }

    console.log('🎉 Blog page table and initial data created successfully!');

    // Test the table
    const result = await pool.query('SELECT section_key, section_type FROM nd_blog_page ORDER BY id');
    console.log('📊 Created sections:', result.rows.map(r => r.section_key).join(', '));

  } catch (error) {
    console.error('❌ Error creating blog page table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
if (require.main === module) {
  createBlogPageTable()
    .then(() => {
      console.log('✅ Blog page table migration completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createBlogPageTable };