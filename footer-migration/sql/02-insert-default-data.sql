-- ============================================================================
-- FOOTER MIGRATION: INSERT DEFAULT DATA
-- Version: 1.0.0
-- Date: 2024
-- Description: Populates footer tables with default content for all locales
-- ============================================================================

-- ============================================================================
-- 1. INSERT DEFAULT FOOTER CONTENT
-- ============================================================================

-- English (Default)
INSERT INTO footer_content (
    locale,
    company_name,
    company_description,
    company_logo_url,
    company_tagline,
    contact_email,
    contact_phone,
    contact_address,
    support_email,
    sales_email,
    copyright_text,
    privacy_policy_url,
    terms_of_service_url,
    cookie_policy_url,
    newsletter_enabled,
    newsletter_title,
    newsletter_subtitle,
    newsletter_placeholder,
    newsletter_button_text,
    newsletter_success_message,
    newsletter_error_message,
    show_social_links,
    show_newsletter,
    show_contact_info,
    show_navigation,
    show_company_info,
    published,
    created_by,
    updated_by
) VALUES (
    'en',
    'AI Studio',
    'Elevate your tech career with expert-led courses. Whether you''re starting fresh or aiming to advance your skills, our practical training is designed for your success.',
    '/images/Logo.svg',
    'Transform Your Career with AI',
    'contact@aistudio555.com',
    '+1 (555) 123-4567',
    '123 Tech Street, Innovation City, IC 12345',
    'support@aistudio555.com',
    'sales@aistudio555.com',
    '© 2024 AI Studio. All rights reserved. | Designed by Zohacous | Powered by Innovation',
    '/privacy-policy.html',
    '/terms-of-service.html',
    '/cookie-policy.html',
    true,
    'Subscribe to Newsletter',
    'Get the latest AI courses and career tips delivered to your inbox',
    'Enter your email address',
    'Subscribe',
    'Thank you for subscribing! Check your email for confirmation.',
    'Oops! Something went wrong. Please try again.',
    true,
    true,
    true,
    true,
    true,
    true,
    'system',
    'system'
);

-- Russian
INSERT INTO footer_content (
    locale,
    company_name,
    company_description,
    company_logo_url,
    company_tagline,
    contact_email,
    contact_phone,
    contact_address,
    support_email,
    sales_email,
    copyright_text,
    privacy_policy_url,
    terms_of_service_url,
    cookie_policy_url,
    newsletter_enabled,
    newsletter_title,
    newsletter_subtitle,
    newsletter_placeholder,
    newsletter_button_text,
    newsletter_success_message,
    newsletter_error_message,
    show_social_links,
    show_newsletter,
    show_contact_info,
    show_navigation,
    show_company_info,
    published,
    created_by,
    updated_by
) VALUES (
    'ru',
    'AI Studio',
    'Повысьте свою карьеру в технологиях с помощью курсов от экспертов. Независимо от того, начинаете ли вы с нуля или стремитесь улучшить свои навыки, наше практическое обучение создано для вашего успеха.',
    '/images/Logo.svg',
    'Трансформируйте свою карьеру с ИИ',
    'contact@aistudio555.com',
    '+7 (495) 123-45-67',
    'ул. Технологическая, 123, Инновационный город, 12345',
    'support@aistudio555.com',
    'sales@aistudio555.com',
    '© 2024 AI Studio. Все права защищены. | Дизайн от Zohacous | Работает на инновациях',
    '/privacy-policy.html',
    '/terms-of-service.html',
    '/cookie-policy.html',
    true,
    'Подписаться на рассылку',
    'Получайте последние курсы по ИИ и карьерные советы на вашу почту',
    'Введите ваш email адрес',
    'Подписаться',
    'Спасибо за подписку! Проверьте вашу почту для подтверждения.',
    'Упс! Что-то пошло не так. Пожалуйста, попробуйте снова.',
    true,
    true,
    true,
    true,
    true,
    true,
    'system',
    'system'
);

-- Hebrew
INSERT INTO footer_content (
    locale,
    company_name,
    company_description,
    company_logo_url,
    company_tagline,
    contact_email,
    contact_phone,
    contact_address,
    support_email,
    sales_email,
    copyright_text,
    privacy_policy_url,
    terms_of_service_url,
    cookie_policy_url,
    newsletter_enabled,
    newsletter_title,
    newsletter_subtitle,
    newsletter_placeholder,
    newsletter_button_text,
    newsletter_success_message,
    newsletter_error_message,
    show_social_links,
    show_newsletter,
    show_contact_info,
    show_navigation,
    show_company_info,
    published,
    created_by,
    updated_by
) VALUES (
    'he',
    'AI Studio',
    'קדמו את הקריירה שלכם בטכנולוגיה עם קורסים מובילים. בין אם אתם מתחילים מחדש או שואפים לשפר את הכישורים שלכם, ההכשרה המעשית שלנו מיועדת להצלחתכם.',
    '/images/Logo.svg',
    'שנו את הקריירה שלכם עם AI',
    'contact@aistudio555.com',
    '+972-3-123-4567',
    'רחוב הטכנולוגיה 123, עיר החדשנות, 12345',
    'support@aistudio555.com',
    'sales@aistudio555.com',
    '© 2024 AI Studio. כל הזכויות שמורות. | עוצב על ידי Zohacous | מופעל על ידי חדשנות',
    '/privacy-policy.html',
    '/terms-of-service.html',
    '/cookie-policy.html',
    true,
    'הרשמה לניוזלטר',
    'קבלו את קורסי ה-AI החדשים וטיפים לקריירה ישירות למייל',
    'הכניסו את כתובת המייל שלכם',
    'הרשמה',
    'תודה על ההרשמה! בדקו את המייל שלכם לאישור.',
    'אופס! משהו השתבש. אנא נסו שוב.',
    true,
    true,
    true,
    true,
    true,
    true,
    'system',
    'system'
);

-- ============================================================================
-- 2. INSERT NAVIGATION MENUS
-- ============================================================================

-- English - Main Menu
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items) VALUES (
    'en',
    'main',
    'Menu',
    1,
    '[
        {"text": "Home", "url": "/home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "About Us", "url": "/about-us.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Courses", "url": "/courses.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Teachers", "url": "/teachers.html", "target": "_self", "order": 4, "visible": true},
        {"text": "Pricing", "url": "/pricing.html", "target": "_self", "order": 5, "visible": true},
        {"text": "Blog", "url": "/blog.html", "target": "_self", "order": 6, "visible": true},
        {"text": "Contact Us", "url": "/contact-us.html", "target": "_self", "order": 7, "visible": true}
    ]'::jsonb
);

-- English - Courses Menu
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items) VALUES (
    'en',
    'courses',
    'Popular Courses',
    2,
    '[
        {"text": "AI Fundamentals", "url": "/courses/ai-fundamentals.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Machine Learning", "url": "/courses/machine-learning.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Deep Learning", "url": "/courses/deep-learning.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Data Science", "url": "/courses/data-science.html", "target": "_self", "order": 4, "visible": true},
        {"text": "Python Programming", "url": "/courses/python.html", "target": "_self", "order": 5, "visible": true},
        {"text": "View All Courses", "url": "/courses.html", "target": "_self", "order": 6, "visible": true, "highlight": true}
    ]'::jsonb
);

-- English - Support Menu
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items) VALUES (
    'en',
    'support',
    'Support',
    3,
    '[
        {"text": "Help Center", "url": "/help.html", "target": "_self", "order": 1, "visible": true},
        {"text": "FAQs", "url": "/faq.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Career Orientation", "url": "/career-orientation.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Career Center", "url": "/career-center.html", "target": "_self", "order": 4, "visible": true},
        {"text": "Student Portal", "url": "/portal", "target": "_self", "order": 5, "visible": true},
        {"text": "Resources", "url": "/resources.html", "target": "_self", "order": 6, "visible": true}
    ]'::jsonb
);

-- English - Utility Menu
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items) VALUES (
    'en',
    'utility',
    'Utility Pages',
    4,
    '[
        {"text": "404 Not Found", "url": "/404.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Password Protected", "url": "/401.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Style Guide", "url": "/style-guide.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Licenses", "url": "/licenses.html", "target": "_self", "order": 4, "visible": true},
        {"text": "Changelog", "url": "/changelog.html", "target": "_self", "order": 5, "visible": true}
    ]'::jsonb
);

-- Russian - Main Menu
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items) VALUES (
    'ru',
    'main',
    'Меню',
    1,
    '[
        {"text": "Главная", "url": "/ru/home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "О нас", "url": "/ru/about-us.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Курсы", "url": "/ru/courses.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Преподаватели", "url": "/ru/teachers.html", "target": "_self", "order": 4, "visible": true},
        {"text": "Цены", "url": "/ru/pricing.html", "target": "_self", "order": 5, "visible": true},
        {"text": "Блог", "url": "/ru/blog.html", "target": "_self", "order": 6, "visible": true},
        {"text": "Контакты", "url": "/ru/contact-us.html", "target": "_self", "order": 7, "visible": true}
    ]'::jsonb
);

-- Hebrew - Main Menu
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items) VALUES (
    'he',
    'main',
    'תפריט',
    1,
    '[
        {"text": "בית", "url": "/he/home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "אודות", "url": "/he/about-us.html", "target": "_self", "order": 2, "visible": true},
        {"text": "קורסים", "url": "/he/courses.html", "target": "_self", "order": 3, "visible": true},
        {"text": "מורים", "url": "/he/teachers.html", "target": "_self", "order": 4, "visible": true},
        {"text": "מחירים", "url": "/he/pricing.html", "target": "_self", "order": 5, "visible": true},
        {"text": "בלוג", "url": "/he/blog.html", "target": "_self", "order": 6, "visible": true},
        {"text": "צור קשר", "url": "/he/contact-us.html", "target": "_self", "order": 7, "visible": true}
    ]'::jsonb
);

-- ============================================================================
-- 3. INSERT SOCIAL LINKS
-- ============================================================================

-- English Social Links
INSERT INTO footer_social_links (locale, platform, url, icon_class, display_text, tooltip, display_order, is_visible) VALUES
('en', 'facebook', 'https://www.facebook.com/aistudio555', 'fab fa-facebook-f', 'Facebook', 'Follow us on Facebook', 1, true),
('en', 'twitter', 'https://twitter.com/aistudio555', 'fab fa-twitter', 'Twitter', 'Follow us on Twitter', 2, true),
('en', 'linkedin', 'https://www.linkedin.com/company/aistudio555', 'fab fa-linkedin-in', 'LinkedIn', 'Connect on LinkedIn', 3, true),
('en', 'instagram', 'https://www.instagram.com/aistudio555', 'fab fa-instagram', 'Instagram', 'Follow us on Instagram', 4, true),
('en', 'youtube', 'https://www.youtube.com/aistudio555', 'fab fa-youtube', 'YouTube', 'Subscribe to our channel', 5, true),
('en', 'github', 'https://github.com/aistudio555', 'fab fa-github', 'GitHub', 'Check our code on GitHub', 6, true);

-- Russian Social Links
INSERT INTO footer_social_links (locale, platform, url, icon_class, display_text, tooltip, display_order, is_visible) VALUES
('ru', 'facebook', 'https://www.facebook.com/aistudio555', 'fab fa-facebook-f', 'Facebook', 'Следите за нами в Facebook', 1, true),
('ru', 'vk', 'https://vk.com/aistudio555', 'fab fa-vk', 'ВКонтакте', 'Мы ВКонтакте', 2, true),
('ru', 'telegram', 'https://t.me/aistudio555', 'fab fa-telegram', 'Telegram', 'Наш Telegram канал', 3, true),
('ru', 'youtube', 'https://www.youtube.com/aistudio555', 'fab fa-youtube', 'YouTube', 'Подпишитесь на наш канал', 4, true);

-- Hebrew Social Links
INSERT INTO footer_social_links (locale, platform, url, icon_class, display_text, tooltip, display_order, is_visible) VALUES
('he', 'facebook', 'https://www.facebook.com/aistudio555', 'fab fa-facebook-f', 'פייסבוק', 'עקבו אחרינו בפייסבוק', 1, true),
('he', 'twitter', 'https://twitter.com/aistudio555', 'fab fa-twitter', 'טוויטר', 'עקבו אחרינו בטוויטר', 2, true),
('he', 'linkedin', 'https://www.linkedin.com/company/aistudio555', 'fab fa-linkedin-in', 'לינקדאין', 'התחברו בלינקדאין', 3, true),
('he', 'whatsapp', 'https://wa.me/972501234567', 'fab fa-whatsapp', 'WhatsApp', 'צרו קשר בוואטסאפ', 4, true);

-- ============================================================================
-- 4. INSERT NEWSLETTER CONFIGURATION
-- ============================================================================

INSERT INTO footer_newsletter_config (
    locale,
    service_provider,
    api_endpoint,
    template_id,
    form_fields,
    gdpr_consent_required,
    gdpr_consent_text,
    double_opt_in,
    max_submissions_per_ip,
    rate_limit_window_minutes
) VALUES 
(
    'en',
    'emailjs',
    'https://api.emailjs.com/api/v1.0/email/send',
    'template_l1zowlh',
    '[
        {
            "name": "email",
            "type": "email",
            "required": true,
            "placeholder": "Enter your email address",
            "validation": "email",
            "error_message": "Please enter a valid email address"
        },
        {
            "name": "name",
            "type": "text",
            "required": false,
            "placeholder": "Your name (optional)",
            "validation": "text",
            "max_length": 100
        }
    ]'::jsonb,
    true,
    'I agree to receive marketing emails and accept the privacy policy',
    false,
    5,
    60
),
(
    'ru',
    'emailjs',
    'https://api.emailjs.com/api/v1.0/email/send',
    'template_l1zowlh',
    '[
        {
            "name": "email",
            "type": "email",
            "required": true,
            "placeholder": "Введите ваш email",
            "validation": "email",
            "error_message": "Пожалуйста, введите корректный email"
        }
    ]'::jsonb,
    true,
    'Я согласен получать маркетинговые письма и принимаю политику конфиденциальности',
    false,
    5,
    60
),
(
    'he',
    'emailjs',
    'https://api.emailjs.com/api/v1.0/email/send',
    'template_l1zowlh',
    '[
        {
            "name": "email",
            "type": "email",
            "required": true,
            "placeholder": "הכניסו את כתובת המייל",
            "validation": "email",
            "error_message": "אנא הכניסו כתובת מייל תקינה"
        }
    ]'::jsonb,
    true,
    'אני מסכים לקבל מיילים שיווקיים ומקבל את מדיניות הפרטיות',
    false,
    5,
    60
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
DO $$
DECLARE
    content_count INT;
    nav_count INT;
    social_count INT;
    newsletter_count INT;
BEGIN
    SELECT COUNT(*) INTO content_count FROM footer_content;
    SELECT COUNT(*) INTO nav_count FROM footer_navigation_menus;
    SELECT COUNT(*) INTO social_count FROM footer_social_links;
    SELECT COUNT(*) INTO newsletter_count FROM footer_newsletter_config;
    
    RAISE NOTICE 'Data insertion completed successfully!';
    RAISE NOTICE 'Footer content records: %', content_count;
    RAISE NOTICE 'Navigation menu records: %', nav_count;
    RAISE NOTICE 'Social links records: %', social_count;
    RAISE NOTICE 'Newsletter config records: %', newsletter_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Total records created: %', content_count + nav_count + social_count + newsletter_count;
END $$;