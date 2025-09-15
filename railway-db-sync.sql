
-- Migration script for production database
-- Generated: 2025-09-15T14:01:11.861Z
-- Run this on Railway PostgreSQL

-- Ensure tables exist
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question TEXT,
  answer TEXT,
  category VARCHAR(255),
  order_index INTEGER,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultations (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  duration VARCHAR(100),
  price DECIMAL(10,2),
  features JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  type VARCHAR(100),
  url VARCHAR(500),
  icon VARCHAR(100),
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_logos (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255),
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  order_index INTEGER,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Data inserts for production

-- FAQs
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'How do I enroll in a course?',
  'Simply browse our course catalog, select your desired course, and click "Enroll Now". You can pay securely with credit card or PayPal.',
  'General',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'What is included in the course fee?',
  'Your course fee includes lifetime access to all course materials, video lessons, assignments, and community support.',
  'Courses',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'Do you offer certificates?',
  'Yes! Upon successful completion of any course, you will receive an industry-recognized certificate that you can add to your LinkedIn profile.',
  'Courses',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'What payment methods do you accept?',
  'We accept all major credit cards, PayPal, and offer installment plans for courses over $200.',
  'Payment',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'Как записаться на курс?',
  'Просто просмотрите каталог курсов, выберите желаемый курс и нажмите "Записаться сейчас". Вы можете безопасно оплатить картой или через PayPal.',
  'Общее',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'Что включено в стоимость курса?',
  'Стоимость курса включает пожизненный доступ ко всем материалам, видео урокам, заданиям и поддержке сообщества.',
  'Курсы',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'Выдаете ли вы сертификаты?',
  'Да! После успешного завершения любого курса вы получите признанный в индустрии сертификат.',
  'Курсы',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'Какие способы оплаты вы принимаете?',
  'Мы принимаем все основные кредитные карты, PayPal и предлагаем планы рассрочки для курсов свыше $200.',
  'Оплата',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'איך נרשמים לקורס?',
  'פשוט עיינו בקטלוג הקורסים, בחרו את הקורס הרצוי ולחצו על "הרשמה כעת". תוכלו לשלם בבטחה בכרטיס אשראי או PayPal.',
  'כללי',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'מה כלול בעלות הקורס?',
  'עלות הקורס כוללת גישה לכל החיים לכל חומרי הקורס, שיעורי וידאו, מ과assignments ותמיכת קהילה.',
  'קורסים',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'האם אתם נותנים תעודות?',
  'כן! לאחר השלמת כל קורס בהצלחה, תקבלו תעודה מוכרת בתעשייה שניתן להוסיף לפרופיל LinkedIn.',
  'קורסים',
  0,
  true
) ON CONFLICT (id) DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible) VALUES (
  'אילו אמצעי תשלום אתם מקבלים?',
  'אנו מקבלים את כל כרטיסי האשראי הגדולים, PayPal ומציעים תוכניות תשלומים לקורסים מעל $200.',
  'תשלום',
  0,
  true
) ON CONFLICT (id) DO NOTHING;

-- Consultations
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;
INSERT INTO consultations (title, description, duration, price, features) VALUES (
  '',
  '',
  '',
  0,
  '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Career Resources
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'AI Resume Template',
  'Professional resume template specifically designed for AI and ML positions',
  'Template',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'Interview Preparation Guide',
  'Comprehensive guide with common AI/ML interview questions and detailed answers',
  'Guide',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'Salary Negotiation Handbook',
  'Learn how to negotiate competitive salaries in the tech industry',
  'Handbook',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'Portfolio Project Ideas',
  'List of 50+ project ideas to build an impressive AI/ML portfolio',
  'List',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'Шаблон резюме для ИИ',
  'Профессиональный шаблон резюме, специально разработанный для позиций в области ИИ и МО',
  'Шаблон',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'Руководство по подготовке к интервью',
  'Подробное руководство с распространенными вопросами для интервью по ИИ/МО',
  'Руководство',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'Справочник по переговорам о зарплате',
  'Научитесь договариваться о конкурентоспособной зарплате в технологической индустрии',
  'Справочник',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'Идеи портфолио проектов',
  'Список из 50+ идей проектов для создания впечатляющего портфолио ИИ/МО',
  'Список',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'תבנית קורות חיים לבינה מלאכותית',
  'תבנית קורות חיים מקצועית המיועדת במיוחד לתפקידים בתחום הבינה המלאכותית ולמידת מכונה',
  'תבנית',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'מדריך הכנה לראיון עבודה',
  'מדריך מקיף עם שאלות נפוצות בראיונות עבודה בתחום הבינה המלאכותית',
  'מדריך',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'מדריך משא ומתן על שכר',
  'למדו כיצד לנהל משא ומתן על שכר תחרותי בתעשיית הטכנולוגיה',
  'מדריך',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index) VALUES (
  'רעיונות לפרויקטים בפורטפוליו',
  'רשימה של 50+ רעיונות לפרויקטים לבניית פורטפוליו מרשים בתחום הבינה המלאכותית',
  'רשימה',
  '',
  '',
  0
) ON CONFLICT (id) DO NOTHING;
