-- Create nd_contact_page table for multi-language contact page content
CREATE TABLE IF NOT EXISTS nd_contact_page (
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

-- Insert default sections with translations
INSERT INTO nd_contact_page (section_key, section_type, content_en, content_ru, content_he, visible) VALUES
('contact', 'contact_section',
  '{
    "title": "Contact Us",
    "subtitle": "Let''s Talk",
    "heading": "Contact Me For Inquiries",
    "description": "If you have questions about my courses, need guidance on your learning path, or want to discuss collaboration opportunities, feel free to reach out.",
    "page_title": "Contact Us - AI Studio E-Learning Platform",
    "details": {
      "email": "info@aistudio555.com",
      "phone": "+972 50 123 4567",
      "linkedin": "www.linkedin.com/aistudio555",
      "facebook": "www.facebook.com/aistudio555"
    },
    "form": {
      "name_label": "Your Name *",
      "name_placeholder": "Enter Your Name",
      "email_label": "Email Address *",
      "email_placeholder": "Ex. emailaddress@email.com",
      "subject_label": "Subject *",
      "subject_placeholder": "Ex. Want Consultation",
      "message_label": "Your Message *",
      "message_placeholder": "Write what you want to share with us.",
      "submit_button": "Submit Now",
      "success_message": "Thank you! Your submission has been received!",
      "error_message": "Oops! Something went wrong while submitting the form."
    }
  }'::jsonb,
  '{
    "title": "Свяжитесь с нами",
    "subtitle": "Давайте поговорим",
    "heading": "Свяжитесь со мной по вопросам",
    "description": "Если у вас есть вопросы о моих курсах, нужна помощь в выборе пути обучения или вы хотите обсудить возможности сотрудничества, не стесняйтесь обращаться.",
    "page_title": "Свяжитесь с нами - Платформа онлайн-обучения AI Studio",
    "details": {
      "email": "info@aistudio555.com",
      "phone": "+972 50 123 4567",
      "linkedin": "www.linkedin.com/aistudio555",
      "facebook": "www.facebook.com/aistudio555"
    },
    "form": {
      "name_label": "Ваше имя *",
      "name_placeholder": "Введите ваше имя",
      "email_label": "Адрес электронной почты *",
      "email_placeholder": "Например: email@example.com",
      "subject_label": "Тема *",
      "subject_placeholder": "Например: Нужна консультация",
      "message_label": "Ваше сообщение *",
      "message_placeholder": "Напишите, что вы хотите нам сообщить.",
      "submit_button": "Отправить",
      "success_message": "Спасибо! Ваша заявка получена!",
      "error_message": "Упс! Что-то пошло не так при отправке формы."
    }
  }'::jsonb,
  '{
    "title": "צור קשר",
    "subtitle": "בואו נדבר",
    "heading": "צור איתי קשר לבירורים",
    "description": "אם יש לך שאלות על הקורסים שלי, צריך הכוונה במסלול הלמידה שלך או רוצה לדון בהזדמנויות לשיתוף פעולה, אל תהסס לפנות.",
    "page_title": "צור קשר - פלטפורמת למידה מקוונת AI Studio",
    "details": {
      "email": "info@aistudio555.com",
      "phone": "+972 50 123 4567",
      "linkedin": "www.linkedin.com/aistudio555",
      "facebook": "www.facebook.com/aistudio555"
    },
    "form": {
      "name_label": "השם שלך *",
      "name_placeholder": "הכנס את שמך",
      "email_label": "כתובת דוא״ל *",
      "email_placeholder": "לדוגמה: email@example.com",
      "subject_label": "נושא *",
      "subject_placeholder": "לדוגמה: רוצה ייעוץ",
      "message_label": "ההודעה שלך *",
      "message_placeholder": "כתוב מה אתה רוצה לשתף איתנו.",
      "submit_button": "שלח כעת",
      "success_message": "תודה! הטופס נשלח בהצלחה!",
      "error_message": "אופס! משהו השתבש בשליחת הטופס."
    }
  }'::jsonb,
  true
),
('navigation', 'navigation_section',
  '{
    "content": {
      "items": [
        {"text": "Home"}
      ]
    }
  }'::jsonb,
  '{
    "content": {
      "items": [
        {"text": "Главная"}
      ]
    }
  }'::jsonb,
  '{
    "content": {
      "items": [
        {"text": "בית"}
      ]
    }
  }'::jsonb,
  true
),
('track', 'track_section',
  '{
    "content": {
      "start_learning": "Start Learning",
      "browse_courses": "Browse Courses"
    }
  }'::jsonb,
  '{
    "content": {
      "start_learning": "Начать обучение",
      "browse_courses": "Просмотреть курсы"
    }
  }'::jsonb,
  '{
    "content": {
      "start_learning": "התחל ללמוד",
      "browse_courses": "עיין בקורסים"
    }
  }'::jsonb,
  true
),
('cta', 'cta_section',
  '{
    "content": {
      "subtitle": "Start Learning Today",
      "title": "Discover A World Of Learning Opportunities",
      "description": "Don''t wait to transform your career and unlock your full potential. Join our community of passionate learners and gain access to a wide range of courses.",
      "button_contact": "Get In Touch",
      "button_courses": "Check Out Courses"
    }
  }'::jsonb,
  '{
    "content": {
      "subtitle": "Начните учиться сегодня",
      "title": "Откройте мир возможностей обучения",
      "description": "Не ждите, чтобы трансформировать свою карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу увлеченных учеников и получите доступ к широкому спектру курсов.",
      "button_contact": "Связаться",
      "button_courses": "Посмотреть курсы"
    }
  }'::jsonb,
  '{
    "content": {
      "subtitle": "התחל ללמוד היום",
      "title": "גלה עולם של הזדמנויות למידה",
      "description": "אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך. הצטרף לקהילת הלומדים הנלהבת שלנו וקבל גישה למגוון רחב של קורסים.",
      "button_contact": "צור קשר",
      "button_courses": "בדוק קורסים"
    }
  }'::jsonb,
  true
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_nd_contact_page_section_key ON nd_contact_page(section_key);
CREATE INDEX IF NOT EXISTS idx_nd_contact_page_visible ON nd_contact_page(visible);