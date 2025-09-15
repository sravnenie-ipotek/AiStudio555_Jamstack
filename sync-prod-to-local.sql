-- Make production same as local

-- 1. Fix consultations table (for contact forms)
DROP TABLE IF EXISTS consultations CASCADE;
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  interest VARCHAR(100) NOT NULL,
  experience VARCHAR(50) NOT NULL,
  locale VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_consultations_email ON consultations(email);
CREATE INDEX idx_consultations_interest ON consultations(interest);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);

-- 2. Create consultation_services table (for service offerings)
CREATE TABLE IF NOT EXISTS consultation_services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  duration VARCHAR(100),
  price DECIMAL(10,2),
  features JSONB,
  locale VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add missing multilingual FAQs
INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (
  'Как записаться на курс?',
  'Просто просмотрите каталог курсов, выберите желаемый курс и нажмите "Записаться сейчас". Вы можете безопасно оплатить картой или через PayPal.',
  'Общее',
  0,
  true,
  'ru'
) ON CONFLICT DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (
  'Что включено в стоимость курса?',
  'Стоимость курса включает пожизненный доступ ко всем материалам, видео урокам, заданиям и поддержке сообщества.',
  'Курсы',
  0,
  true,
  'ru'
) ON CONFLICT DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (
  'Выдаете ли вы сертификаты?',
  'Да! После успешного завершения любого курса вы получите признанный в индустрии сертификат.',
  'Курсы',
  0,
  true,
  'ru'
) ON CONFLICT DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (
  'Какие способы оплаты вы принимаете?',
  'Мы принимаем все основные кредитные карты, PayPal и предлагаем планы рассрочки для курсов свыше $200.',
  'Оплата',
  0,
  true,
  'ru'
) ON CONFLICT DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (
  'איך נרשמים לקורס?',
  'פשוט עיינו בקטלוג הקורסים, בחרו את הקורס הרצוי ולחצו על "הרשמה כעת". תוכלו לשלם בבטחה בכרטיס אשראי או PayPal.',
  'כללי',
  0,
  true,
  'he'
) ON CONFLICT DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (
  'מה כלול בעלות הקורס?',
  'עלות הקורס כוללת גישה לכל החיים לכל חומרי הקורס, שיעורי וידאו, מ과assignments ותמיכת קהילה.',
  'קורסים',
  0,
  true,
  'he'
) ON CONFLICT DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (
  'האם אתם נותנים תעודות?',
  'כן! לאחר השלמת כל קורס בהצלחה, תקבלו תעודה מוכרת בתעשייה שניתן להוסיף לפרופיל LinkedIn.',
  'קורסים',
  0,
  true,
  'he'
) ON CONFLICT DO NOTHING;
INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (
  'אילו אמצעי תשלום אתם מקבלים?',
  'אנו מקבלים את כל כרטיסי האשראי הגדולים, PayPal ומציעים תוכניות תשלומים לקורסים מעל $200.',
  'תשלום',
  0,
  true,
  'he'
) ON CONFLICT DO NOTHING;

-- 4. Add missing multilingual career resources
INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (
  'Шаблон резюме для ИИ',
  'Профессиональный шаблон резюме, специально разработанный для позиций в области ИИ и МО',
  'Шаблон',
  '',
  'document',
  0,
  'ru'
) ON CONFLICT DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (
  'Руководство по подготовке к интервью',
  'Подробное руководство с распространенными вопросами для интервью по ИИ/МО',
  'Руководство',
  '',
  'document',
  0,
  'ru'
) ON CONFLICT DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (
  'Справочник по переговорам о зарплате',
  'Научитесь договариваться о конкурентоспособной зарплате в технологической индустрии',
  'Справочник',
  '',
  'document',
  0,
  'ru'
) ON CONFLICT DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (
  'Идеи портфолио проектов',
  'Список из 50+ идей проектов для создания впечатляющего портфолио ИИ/МО',
  'Список',
  '',
  'document',
  0,
  'ru'
) ON CONFLICT DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (
  'תבנית קורות חיים לבינה מלאכותית',
  'תבנית קורות חיים מקצועית המיועדת במיוחד לתפקידים בתחום הבינה המלאכותית ולמידת מכונה',
  'תבנית',
  '',
  'document',
  0,
  'he'
) ON CONFLICT DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (
  'מדריך הכנה לראיון עבודה',
  'מדריך מקיף עם שאלות נפוצות בראיונות עבודה בתחום הבינה המלאכותית',
  'מדריך',
  '',
  'document',
  0,
  'he'
) ON CONFLICT DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (
  'מדריך משא ומתן על שכר',
  'למדו כיצד לנהל משא ומתן על שכר תחרותי בתעשיית הטכנולוגיה',
  'מדריך',
  '',
  'document',
  0,
  'he'
) ON CONFLICT DO NOTHING;
INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (
  'רעיונות לפרויקטים בפורטפוליו',
  'רשימה של 50+ רעיונות לפרויקטים לבניית פורטפוליו מרשים בתחום הבינה המלאכותית',
  'רשימה',
  '',
  'document',
  0,
  'he'
) ON CONFLICT DO NOTHING;

-- 5. Add consultation services
INSERT INTO consultation_services (title, description, duration, price, features) VALUES
  ('Career Strategy Session', 'One-on-one career planning and guidance', '60 minutes', 150, '{"personalPlan": true, "followUp": true, "resources": true}'),
  ('Technical Interview Prep', 'Mock interviews and coding practice', '90 minutes', 200, '{"mockInterview": true, "feedback": true, "tips": true}'),
  ('Portfolio Review', 'Professional review of your AI/ML projects', '45 minutes', 100, '{"detailed_feedback": true, "improvement_tips": true}')
ON CONFLICT DO NOTHING;

-- Done! Production should now match local structure.
