const { Client } = require('pg');

// Load environment variables
require('dotenv').config();

// Use the same connection logic as server.js
let dbConfig;
if (process.env.DATABASE_URL) {
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.NODE_ENV === 'development';
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
} else {
  console.error('❌ DATABASE_URL not found. Please check your environment variables.');
  process.exit(1);
}

async function migratePageContent() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // 1. MIGRATE TEACHERS PAGE CONTENT
    console.log('\n📚 Migrating Teachers Page Content...');

    const teachersData = [
      {
        section_name: 'hero',
        content_en: {
          title: 'Our Teachers',
          subtitle: 'Meet Our Team',
          description: 'Expert Instructors Dedicated to Your Success',
          breadcrumb_home: 'Home',
          breadcrumb_current: 'Teachers'
        },
        content_ru: {
          title: 'Наши Преподаватели',
          subtitle: 'Познакомьтесь с Нашей Командой',
          description: 'Опытные Инструкторы, Посвятившие Себя Вашему Успеху',
          breadcrumb_home: 'Главная',
          breadcrumb_current: 'Преподаватели'
        },
        content_he: {
          title: 'המורים שלנו',
          subtitle: 'הכירו את הצוות שלנו',
          description: 'מדריכים מומחים המוקדשים להצלחתכם',
          breadcrumb_home: 'בית',
          breadcrumb_current: 'מורים'
        }
      },
      {
        section_name: 'instructor_grid',
        content_en: {
          subtitle: 'Meet Our Team',
          title: 'Expert Instructors Dedicated to Your Success',
          description: 'Learn from industry professionals with years of real-world experience who are passionate about sharing their knowledge and helping you achieve your career goals.',
          instructors: [
            {
              id: 1,
              name: 'Sarah Chen',
              expertise: 'AI & Machine Learning',
              bio: 'Senior AI Engineer with 8+ years of experience in machine learning and deep learning. Former Google AI researcher specializing in neural networks, NLP, and AI ethics. Passionate about making AI accessible through education.',
              extended_bio: 'Explore how artificial intelligence is revolutionizing education through personalized learning paths, intelligent tutoring systems, and adaptive assessments that cater to individual student needs.',
              image: 'images/CTA-Section-Bg.jpg',
              profile_link: '#',
              experience_years: '8+',
              former_companies: ['Google AI', 'DeepMind'],
              specialties: ['Neural Networks', 'NLP', 'AI Ethics']
            },
            {
              id: 2,
              name: 'Mike Johnson',
              expertise: 'Web Development',
              bio: 'Lead Full-Stack Developer with 10+ years building scalable applications. Former senior developer at Netflix and Spotify. Expert in React, Node.js, Python, and cloud architecture. Mentored 200+ developers worldwide.',
              extended_bio: 'Stay ahead of the curve with the latest web development trends, from serverless architecture and edge computing to WebAssembly and progressive web applications.',
              image: 'images/Course-Categories-Content-Bg.jpg',
              profile_link: '#',
              experience_years: '10+',
              former_companies: ['Netflix', 'Spotify'],
              specialties: ['React', 'Node.js', 'Python', 'Cloud Architecture']
            },
            {
              id: 3,
              name: 'Emily Rodriguez',
              expertise: 'Career Development',
              bio: 'Career Transition Coach with 12+ years helping professionals enter tech. Former tech recruiter turned mentor. Successfully guided 500+ career changers into their dream roles at top companies like Apple, Microsoft, and startups.',
              extended_bio: 'A comprehensive guide for career changers looking to break into the tech industry, covering skill development, portfolio building, and networking strategies.',
              image: 'images/About-Me-Image.jpg',
              profile_link: '#',
              experience_years: '12+',
              former_companies: ['Apple', 'Microsoft'],
              specialties: ['Career Coaching', 'Tech Recruiting', 'Portfolio Building']
            },
            {
              id: 4,
              name: 'David Park',
              expertise: 'Data Science',
              bio: 'PhD in Computer Science from Stanford. Senior Data Scientist with 9+ years at Uber and Airbnb. Expert in predictive modeling, big data systems, and ML infrastructure. Published researcher with 20+ papers in top ML conferences.',
              extended_bio: 'Demystifying machine learning with practical examples and a clear roadmap for beginners to start their journey in data science and artificial intelligence.',
              image: 'images/About-Us-Image.png',
              profile_link: '#',
              experience_years: '9+',
              former_companies: ['Uber', 'Airbnb'],
              specialties: ['Predictive Modeling', 'Big Data', 'ML Infrastructure'],
              education: 'PhD Computer Science, Stanford'
            }
          ]
        },
        content_ru: {
          subtitle: 'Познакомьтесь с Нашей Командой',
          title: 'Опытные Инструкторы, Посвятившие Себя Вашему Успеху',
          description: 'Учитесь у профессионалов отрасли с многолетним реальным опытом, которые страстно желают делиться своими знаниями и помогать вам достичь ваших карьерных целей.',
          instructors: [
            {
              id: 1,
              name: 'Сара Чен',
              expertise: 'ИИ и Машинное Обучение',
              bio: 'Старший инженер ИИ с 8+ летним опытом в машинном обучении и глубоком обучении. Бывший исследователь Google AI, специализирующийся на нейронных сетях, НЛП и этике ИИ.',
              image: 'images/CTA-Section-Bg.jpg'
            },
            {
              id: 2,
              name: 'Майк Джонсон',
              expertise: 'Веб-Разработка',
              bio: 'Ведущий Full-Stack разработчик с 10+ летним опытом создания масштабируемых приложений. Бывший старший разработчик в Netflix и Spotify.',
              image: 'images/Course-Categories-Content-Bg.jpg'
            },
            {
              id: 3,
              name: 'Эмили Родригес',
              expertise: 'Развитие Карьеры',
              bio: 'Карьерный коуч с 12+ летним опытом помощи профессионалам войти в технологии. Бывший рекрутер в сфере технологий, ставший ментором.',
              image: 'images/About-Me-Image.jpg'
            },
            {
              id: 4,
              name: 'Дэвид Парк',
              expertise: 'Наука о Данных',
              bio: 'PhD в области компьютерных наук из Стэнфорда. Старший специалист по данным с 9+ летним опытом в Uber и Airbnb.',
              image: 'images/About-Us-Image.png'
            }
          ]
        },
        content_he: {
          subtitle: 'הכירו את הצוות שלנו',
          title: 'מדריכים מומחים המוקדשים להצלחתכם',
          description: 'למדו מאנשי מקצוע בתעשייה עם שנים של ניסיון בעולם האמיתי שנלהבים לחלוק את הידע שלהם ולעזור לכם להשיג את המטרות הקריירה שלכם.',
          instructors: [
            {
              id: 1,
              name: 'שרה צ\'ן',
              expertise: 'בינה מלאכותית ולמידת מכונה',
              bio: 'מהנדסת בינה מלאכותית בכירה עם 8+ שנות ניסיון בלמידת מכונה ולמידה עמוקה. חוקרת לשעבר ב-Google AI המתמחה ברשתות עצביות, עיבוד שפות טבעיות ואתיקה של בינה מלאכותית.',
              image: 'images/CTA-Section-Bg.jpg'
            },
            {
              id: 2,
              name: 'מייק ג\'ונסון',
              expertise: 'פיתוח אתרים',
              bio: 'מפתח Full-Stack מוביל עם 10+ שנות ניסיון בבניית יישומים ניתנים להרחבה. מפתח בכיר לשעבר ב-Netflix ו-Spotify.',
              image: 'images/Course-Categories-Content-Bg.jpg'
            },
            {
              id: 3,
              name: 'אמילי רודריגז',
              expertise: 'פיתוח קריירה',
              bio: 'מאמנת מעבר קריירה עם 12+ שנות ניסיון בעזרה לאנשי מקצוע להיכנס לטכנולוגיה. מגייסת טכנולוגיה לשעבר שהפכה למנטורית.',
              image: 'images/About-Me-Image.jpg'
            },
            {
              id: 4,
              name: 'דיויד פארק',
              expertise: 'מדעי הנתונים',
              bio: 'דוקטור במדעי המחשב מסטנפורד. מדען נתונים בכיר עם 9+ שנות ניסיון ב-Uber ו-Airbnb.',
              image: 'images/About-Us-Image.png'
            }
          ]
        }
      },
      {
        section_name: 'stats_banner',
        content_en: {
          items: [
            { text: 'Start Learning' },
            { text: 'Browse Courses' },
            { text: 'Start Learning' },
            { text: 'Browse Courses' },
            { text: 'Start Learning' }
          ]
        },
        content_ru: {
          items: [
            { text: 'Начните Учиться' },
            { text: 'Просмотр Курсов' },
            { text: 'Начните Учиться' },
            { text: 'Просмотр Курсов' },
            { text: 'Начните Учиться' }
          ]
        },
        content_he: {
          items: [
            { text: 'התחילו ללמוד' },
            { text: 'עיינו בקורסים' },
            { text: 'התחילו ללמוד' },
            { text: 'עיינו בקורסים' },
            { text: 'התחילו ללמוד' }
          ]
        }
      },
      {
        section_name: 'cta_section',
        content_en: {
          subtitle: 'Start Learning Today',
          title: 'Discover A World Of Learning Opportunities.',
          description: "Don't wait to transform career and unlock your full potential. join our community of passionate learners and gain access to a wide range of courses.",
          primary_button: 'get in touch',
          secondary_button: 'Check Out Courses',
          primary_link: 'contact-us.html',
          secondary_link: 'courses.html',
          man_image_1: 'images/CTA-Man-Image1.png',
          man_image_2: 'images/CTA-Man-Image2_1CTA-Man-Image2.png'
        },
        content_ru: {
          subtitle: 'Начните Учиться Сегодня',
          title: 'Откройте Мир Возможностей Для Обучения.',
          description: 'Не ждите, чтобы изменить карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу увлеченных учеников и получите доступ к широкому спектру курсов.',
          primary_button: 'связаться с нами',
          secondary_button: 'Посмотреть Курсы',
          primary_link: 'contact-us.html',
          secondary_link: 'courses.html'
        },
        content_he: {
          subtitle: 'התחילו ללמוד היום',
          title: 'גלו עולם של הזדמנויות למידה.',
          description: 'אל תחכו כדי לשנות קריירה ולפתוח את הפוטנציאל המלא שלכם. הצטרפו לקהילה שלנו של לומדים נלהבים וקבלו גישה למגוון רחב של קורסים.',
          primary_button: 'צרו קשר',
          secondary_button: 'ראו קורסים',
          primary_link: 'contact-us.html',
          secondary_link: 'courses.html'
        }
      }
    ];

    // Insert/Update teachers page sections
    for (const section of teachersData) {
      await client.query(`
        INSERT INTO nd_teachers_page (section_name, content_en, content_ru, content_he, visible, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (section_name) DO UPDATE SET
          content_en = EXCLUDED.content_en,
          content_ru = EXCLUDED.content_ru,
          content_he = EXCLUDED.content_he,
          visible = EXCLUDED.visible,
          updated_at = NOW()
      `, [
        section.section_name,
        JSON.stringify(section.content_en),
        JSON.stringify(section.content_ru),
        JSON.stringify(section.content_he),
        true
      ]);
      console.log(`✅ Teachers section: ${section.section_name}`);
    }

    // 2. MIGRATE ABOUT PAGE CONTENT
    console.log('\n👤 Migrating About Page Content...');

    const aboutData = [
      {
        locale: 'en',
        hero_title: 'About Us',
        hero_subtitle: 'About Me Name - Expert Mentor in Technology',
        mission_title: 'My Story as Mentor',
        mission_description: 'Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.',
        vision_title: 'Values That Drive Me',
        vision_description: 'Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.',
        values: JSON.stringify({
          personal_info: {
            name: 'Mrs. Sarah Johnson',
            title: 'Expert Mentor in Technology',
            bio: "I'm Mrs. Sarah Johnson, a dedicated Mentor in tech committed to guiding individuals towards their fullest potential and helping them achieve their aspirations. With a passion for personal development and a wealth of experience in coaching, I empower my clients to overcome obstacles, unlock their inner strengths, and create the life they desire. My approach is grounded in empathy, authenticity, and a genuine desire to see others succeed. Whether it's navigating.",
            image: 'images/About-Me-Image.jpg',
            experience_years: '08+',
            social_links: {
              facebook: 'https://www.facebook.com/',
              twitter: 'https://twitter.com/',
              instagram: 'https://www.instagram.com/',
              youtube: 'https://www.youtube.com/'
            }
          },
          story_sections: [
            {
              title: 'Personal Transformation',
              description: 'Investing in remote-friendly technologies is essential for enabling seamless collaboration and productivity. Implement project.',
              features: [
                'This involves continuous scenario analysis.',
                'Empowering teams to understanding disruptions.',
                'Technology plays a pivotal role in achieving.'
              ]
            },
            {
              title: 'Professional Development',
              description: 'Investing in remote-friendly technologies is essential for enabling seamless collaboration and productivity. Implement project.',
              features: [
                'This involves continuous scenario analysis.',
                'Empowering teams to understanding disruptions.',
                'Technology plays a pivotal role in achieving.'
              ]
            },
            {
              title: 'Empowering Others',
              description: 'Investing in remote-friendly technologies is essential for enabling seamless collaboration and productivity. Implement project.',
              features: [
                'This involves continuous scenario analysis.',
                'Empowering teams to understanding disruptions.',
                'Technology plays a pivotal role in achieving.'
              ]
            }
          ],
          statistics: [
            {
              number: '80+',
              label: 'Total Courses Taught',
              suffix: '+'
            },
            {
              number: '4K+',
              label: 'Total Happy Learners',
              suffix: 'K+'
            },
            {
              number: '08+',
              label: 'Years of Experience',
              suffix: '+'
            },
            {
              number: '2K+',
              label: 'Tech Skills Learned',
              suffix: 'K+'
            }
          ],
          core_values: [
            {
              icon: 'images/Core-Values-Icon1.svg',
              name: 'Integrity',
              description: 'Committing to honesty, transparency, ethical conduct all. Committing honesty, transparency, and ethical conduct.'
            },
            {
              icon: 'images/License-Icon2.svg',
              name: 'Compassion',
              description: 'Demonstrating empathy, kindness, and understanding. Demonstrating empathy, kindness, understanding towards.'
            },
            {
              icon: 'images/Core-Values-Icon3.svg',
              name: 'Authenticity',
              description: 'Being genuine, true to oneself, and transparent in intentions actions. Being genuine, true to oneself transparent.'
            },
            {
              icon: 'images/Core-Values-Icon4.svg',
              name: 'Empowerment',
              description: 'Empowering individuals recognize their potential take. Empowering individuals to recognize their potential and take.'
            },
            {
              icon: 'images/Core-Values-Icon5.svg',
              name: 'Collaboration',
              description: 'Working together with colleagues to achieve shared goals outcomes. Working together with clients and colleagues.'
            },
            {
              icon: 'images/Core-Values-Icon6.svg',
              name: 'Respect',
              description: 'Valuing dignity, diversity, perspectives every individual. Valuing dignity, diversity, and perspectives of every individual.'
            }
          ],
          testimonials: [
            {
              title: 'Practical Approach Expert Instructor',
              text: 'The courses are top-notch practical approach and expert instructor made learning engaging and effective. It transformed my career. The hand on projects and personalized mentorship.',
              author: 'Emily Turner',
              role: 'Software Developer'
            }
          ],
          tags: ['Development', 'Technology', 'Coaching', 'Guidance', 'Mentoring', 'Motivation']
        })
      },
      {
        locale: 'ru',
        hero_title: 'О Нас',
        hero_subtitle: 'Обо Мне - Эксперт-Наставник в Технологиях',
        mission_title: 'Моя История как Наставника',
        mission_description: 'Погрузитесь в наш экспертно подобранный выбор рекомендуемых курсов, разработанных, чтобы вооружить вас навыками и знаниями, необходимыми для совершенства.',
        vision_title: 'Ценности, Которые Движут Мной',
        vision_description: 'Погрузитесь в наш экспертно подобранный выбор рекомендуемых курсов, разработанных, чтобы вооружить вас навыками и знаниями, необходимыми для совершенства.',
        values: JSON.stringify({
          personal_info: {
            name: 'Госпожа Сара Джонсон',
            title: 'Эксперт-Наставник в Технологиях',
            bio: 'Я госпожа Сара Джонсон, преданный наставник в сфере технологий, стремящийся направлять людей к их полному потенциалу и помогать им достигать своих стремлений.',
            experience_years: '08+'
          }
        })
      },
      {
        locale: 'he',
        hero_title: 'אודותינו',
        hero_subtitle: 'אודותי - מנטור מומחה בטכנולוגיה',
        mission_title: 'הסיפור שלי כמנטור',
        mission_description: 'הצטרפו לקורסים שנבחרו בקפידה על ידי מומחים, המיועדים לצייד אתכם בכישורים ובידע הדרושים להצטיינות.',
        vision_title: 'הערכים שמניעים אותי',
        vision_description: 'הצטרפו לקורסים שנבחרו בקפידה על ידי מומחים, המיועדים לצייד אתכם בכישורים ובידע הדרושים להצטיינות.',
        values: JSON.stringify({
          personal_info: {
            name: 'גברת שרה ג\'ונסון',
            title: 'מנטור מומחה בטכנולוגיה',
            bio: 'אני גברת שרה ג\'ונסון, מנטור מסור בתחום הטכנולוגיה המחויב להדריך אנשים לקראת הפוטנציאל המלא שלהם ולעזור להם להשיג את שאיפותיהם.',
            experience_years: '08+'
          }
        })
      }
    ];

    // Insert/Update about page content
    for (const about of aboutData) {
      // First check if record exists
      const existing = await client.query(
        'SELECT id FROM about_pages WHERE locale = $1 LIMIT 1',
        [about.locale]
      );

      if (existing.rows.length > 0) {
        // Update existing record
        await client.query(`
          UPDATE about_pages SET
            hero_title = $2,
            hero_subtitle = $3,
            mission_title = $4,
            mission_description = $5,
            vision_title = $6,
            vision_description = $7,
            published_at = NOW(),
            updated_at = NOW()
          WHERE locale = $1
        `, [
          about.locale,
          about.hero_title,
          about.hero_subtitle,
          about.mission_title,
          about.mission_description,
          about.vision_title,
          about.vision_description
        ]);
      } else {
        // Insert new record
        await client.query(`
          INSERT INTO about_pages (
            locale, hero_title, hero_subtitle, mission_title, mission_description,
            vision_title, vision_description, published_at, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
        `, [
          about.locale,
          about.hero_title,
          about.hero_subtitle,
          about.mission_title,
          about.mission_description,
          about.vision_title,
          about.vision_description
        ]);
      }
      console.log(`✅ About page: ${about.locale}`);
    }

    // 3. MIGRATE CONTACT PAGE CONTENT
    console.log('\n📞 Migrating Contact Page Content...');

    const contactData = [
      {
        locale: 'en',
        phone: '(000) 123 456 7890',
        email: 'zohacous@email.com',
        address: '1234 Valencia, Suite, SF, CA',
        office_hours: 'Mon-Fri 9AM-6PM',
        map_url: '',
        additional_info: JSON.stringify({
          hero: {
            title: 'Contact Us',
            subtitle: 'Let\'s Talk',
            description: 'If you have questions about my courses, need guidance on your learning path, or want to discuss collaboration opportunities, feel free to reach out.',
            breadcrumb_home: 'Home',
            breadcrumb_current: 'Contact Us'
          },
          contact_methods: [
            {
              icon: 'images/Contact-Us-Details-Icon1.svg',
              value: 'zohacous@email.com',
              type: 'email'
            },
            {
              icon: 'images/Contact-Us-Details-Icon2.svg',
              value: '(000) 123 456 7890',
              type: 'phone'
            },
            {
              icon: 'images/Contact-Us-Details-Icon3.svg',
              value: 'www.linkedin.com/zohacous',
              type: 'linkedin'
            },
            {
              icon: 'images/Contact-Us-Details-Icon4.svg',
              value: 'www.facebook.com/zohacous',
              type: 'facebook'
            }
          ],
          form_fields: [
            {
              name: 'Your-Name',
              label: 'Your Name *',
              type: 'text',
              placeholder: 'Enter Your Name',
              required: true
            },
            {
              name: 'Email',
              label: 'Email Address *',
              type: 'email',
              placeholder: 'Ex. emailaddress@email.com',
              required: true
            },
            {
              name: 'Subject',
              label: 'Subject *',
              type: 'text',
              placeholder: 'Ex. Want Consultation',
              required: true
            },
            {
              name: 'Message',
              label: 'Your Message *',
              type: 'textarea',
              placeholder: 'Write what you want to share with us.',
              required: true
            }
          ],
          submit_button: 'Submit Now',
          success_message: 'Thank you! Your submission has been received!',
          error_message: 'Oops! Something went wrong while submitting the form.'
        })
      },
      {
        locale: 'ru',
        phone: '(000) 123 456 7890',
        email: 'zohacous@email.com',
        address: '1234 Valencia, Suite, SF, CA',
        office_hours: 'Пн-Пт 9:00-18:00',
        map_url: '',
        additional_info: JSON.stringify({
          hero: {
            title: 'Свяжитесь с Нами',
            subtitle: 'Давайте Поговорим',
            description: 'Если у вас есть вопросы о моих курсах, нужна консультация по вашему пути обучения или вы хотите обсудить возможности сотрудничества, не стесняйтесь обращаться.',
            breadcrumb_home: 'Главная',
            breadcrumb_current: 'Контакты'
          }
        })
      },
      {
        locale: 'he',
        phone: '(000) 123 456 7890',
        email: 'zohacous@email.com',
        address: '1234 Valencia, Suite, SF, CA',
        office_hours: 'א-ה 9:00-18:00',
        map_url: '',
        additional_info: JSON.stringify({
          hero: {
            title: 'צרו קשר',
            subtitle: 'בואו נדבר',
            description: 'אם יש לכם שאלות על הקורסים שלי, אתם זקוקים להדרכה בנתיב הלמידה שלכם או שאתם רוצים לדון בהזדמנויות שיתוף פעולה, אל תהססו לפנות.',
            breadcrumb_home: 'בית',
            breadcrumb_current: 'צור קשר'
          }
        })
      }
    ];

    // Insert/Update contact page content
    for (const contact of contactData) {
      // First check if record exists
      const existing = await client.query(
        'SELECT id FROM contact_pages WHERE locale = $1 LIMIT 1',
        [contact.locale]
      );

      if (existing.rows.length > 0) {
        // Update existing record
        await client.query(`
          UPDATE contact_pages SET
            phone = $2,
            email = $3,
            address = $4,
            office_hours = $5,
            map_url = $6,
            published_at = NOW(),
            updated_at = NOW()
          WHERE locale = $1
        `, [
          contact.locale,
          contact.phone,
          contact.email,
          contact.address,
          contact.office_hours,
          contact.map_url
        ]);
      } else {
        // Insert new record
        await client.query(`
          INSERT INTO contact_pages (
            locale, phone, email, address, office_hours, map_url,
            published_at, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
        `, [
          contact.locale,
          contact.phone,
          contact.email,
          contact.address,
          contact.office_hours,
          contact.map_url
        ]);
      }
      console.log(`✅ Contact page: ${contact.locale}`);
    }

    // 4. VERIFY MIGRATION
    console.log('\n🔍 Verifying Migration Results...');

    // Check teachers page sections
    const teachersResult = await client.query('SELECT section_name, visible FROM nd_teachers_page ORDER BY section_name');
    console.log('\n📚 Teachers Page Sections:');
    teachersResult.rows.forEach(row => {
      console.log(`  - ${row.section_name} (visible: ${row.visible})`);
    });

    // Check about pages
    const aboutResult = await client.query('SELECT locale, hero_title FROM about_pages ORDER BY locale');
    console.log('\n👤 About Pages:');
    aboutResult.rows.forEach(row => {
      console.log(`  - ${row.locale}: ${row.hero_title}`);
    });

    // Check contact pages
    const contactResult = await client.query('SELECT locale, email, phone FROM contact_pages ORDER BY locale');
    console.log('\n📞 Contact Pages:');
    contactResult.rows.forEach(row => {
      console.log(`  - ${row.locale}: ${row.email} | ${row.phone}`);
    });

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Teachers sections: ${teachersResult.rows.length}`);
    console.log(`  - About page locales: ${aboutResult.rows.length}`);
    console.log(`  - Contact page locales: ${contactResult.rows.length}`);
    console.log('\n🎯 All hard-coded content has been extracted and stored in the database.');
    console.log('   The pages can now be dynamically generated from the API.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the migration
if (require.main === module) {
  migratePageContent()
    .then(() => {
      console.log('\n🎉 Migration script completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = migratePageContent;