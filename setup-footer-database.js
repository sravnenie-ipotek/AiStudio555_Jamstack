#!/usr/bin/env node

/**
 * QUICK FOOTER DATABASE SETUP
 * Creates necessary footer tables and inserts default data for local development
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use the local SQLite database
const dbPath = path.join(__dirname, 'local.db');
console.log('📊 Setting up footer database at:', dbPath);

const db = new sqlite3.Database(dbPath);

// SQL to create footer tables
const createTablesSQL = `
-- Create footer_content table
CREATE TABLE IF NOT EXISTS footer_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale TEXT NOT NULL DEFAULT 'en',
    company_name TEXT,
    company_description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_address TEXT,
    copyright_text TEXT,
    newsletter_title TEXT,
    newsletter_placeholder TEXT,
    newsletter_button_text TEXT,
    social_title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create footer_navigation_menus table
CREATE TABLE IF NOT EXISTS footer_navigation_menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale TEXT NOT NULL DEFAULT 'en',
    menu_type TEXT NOT NULL,
    menu_title TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    menu_items TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create footer_social_links table
CREATE TABLE IF NOT EXISTS footer_social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale TEXT NOT NULL DEFAULT 'en',
    platform TEXT NOT NULL,
    url TEXT,
    icon_class TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Default data matching top navigation only
const insertDefaultDataSQL = `
-- Insert default footer content for English
INSERT OR REPLACE INTO footer_content (locale, company_name, company_description, contact_email, contact_phone, contact_address, copyright_text, newsletter_title, newsletter_placeholder, newsletter_button_text, social_title)
VALUES ('en', 'AI Studio', 'Elevate tech career with expert-led courses. if you''re just aiming to advance skills, practical training is designed.', 'zohacous@email.com', '(000) 012 3456 7890', '1234 Valencia, Suite, SF, CA', '© Copyright - AI Studio', 'Subscribe to Newsletter', 'Enter email to subscribe', 'Subscribe', 'Follow Us');

-- Insert default navigation menus (ONLY TOP NAV ITEMS)
INSERT OR REPLACE INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'en',
    'main',
    'Menu',
    1,
    '[
        {"text": "Home", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Courses", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Teachers", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Pricing", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'
);

INSERT OR REPLACE INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'en',
    'career_services',
    'Career Services',
    2,
    '[
        {"text": "Career Orientation", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Career Center", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'
);

-- Insert social links
INSERT OR REPLACE INTO footer_social_links (locale, platform, url, icon_class, display_order)
VALUES
    ('en', 'facebook', 'https://www.facebook.com/', 'fab fa-facebook', 1),
    ('en', 'twitter', 'https://twitter.com/', 'fab fa-twitter', 2),
    ('en', 'instagram', 'https://www.instagram.com/', 'fab fa-instagram', 3),
    ('en', 'youtube', 'https://youtube.com/', 'fab fa-youtube', 4);
`;

// Russian translations
const insertRussianDataSQL = `
INSERT OR REPLACE INTO footer_content (locale, company_name, company_description, contact_email, contact_phone, contact_address, copyright_text, newsletter_title, newsletter_placeholder, newsletter_button_text, social_title)
VALUES ('ru', 'AI Studio', 'Повысьте свою техническую карьеру с помощью курсов под руководством экспертов.', 'zohacous@email.com', '(000) 012 3456 7890', '1234 Valencia, Suite, SF, CA', '© Авторские права - AI Studio', 'Подпишитесь на рассылку', 'Введите email для подписки', 'Подписаться', 'Следите за нами');

INSERT OR REPLACE INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'ru',
    'main',
    'Меню',
    1,
    '[
        {"text": "Главная", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Курсы", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Преподаватели", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Цены", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'
);

INSERT OR REPLACE INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'ru',
    'career_services',
    'Карьерные Услуги',
    2,
    '[
        {"text": "Карьерная Ориентация", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Карьерный Центр", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'
);
`;

// Hebrew translations
const insertHebrewDataSQL = `
INSERT OR REPLACE INTO footer_content (locale, company_name, company_description, contact_email, contact_phone, contact_address, copyright_text, newsletter_title, newsletter_placeholder, newsletter_button_text, social_title)
VALUES ('he', 'AI Studio', 'שפר את הקריירה הטכנולוגית שלך עם קורסים בהובלת מומחים.', 'zohacous@email.com', '(000) 012 3456 7890', '1234 Valencia, Suite, SF, CA', '© זכויות יוצרים - AI Studio', 'הירשם לניוזלטר', 'הזן אימייל להרשמה', 'הירשם', 'עקבו אחרינו');

INSERT OR REPLACE INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'he',
    'main',
    'תפריט',
    1,
    '[
        {"text": "בית", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "קורסים", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "מורים", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "תמחור", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'
);

INSERT OR REPLACE INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'he',
    'career_services',
    'שירותי קריירה',
    2,
    '[
        {"text": "כיוון קריירה", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "מרכז קריירה", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'
);
`;

// Execute the setup
db.serialize(() => {
    console.log('📝 Creating footer tables...');
    db.exec(createTablesSQL, (err) => {
        if (err) {
            console.error('❌ Error creating tables:', err);
            return;
        }
        console.log('✅ Footer tables created successfully');

        console.log('📝 Inserting default English data...');
        db.exec(insertDefaultDataSQL, (err) => {
            if (err) {
                console.error('❌ Error inserting English data:', err);
                return;
            }
            console.log('✅ English footer data inserted');

            console.log('📝 Inserting Russian translations...');
            db.exec(insertRussianDataSQL, (err) => {
                if (err) {
                    console.error('❌ Error inserting Russian data:', err);
                    return;
                }
                console.log('✅ Russian footer data inserted');

                console.log('📝 Inserting Hebrew translations...');
                db.exec(insertHebrewDataSQL, (err) => {
                    if (err) {
                        console.error('❌ Error inserting Hebrew data:', err);
                        return;
                    }
                    console.log('✅ Hebrew footer data inserted');

                    // Verify the setup
                    db.get('SELECT COUNT(*) as count FROM footer_content', (err, row) => {
                        if (!err && row) {
                            console.log(`\n📊 Footer content records: ${row.count}`);
                        }
                    });

                    db.get('SELECT COUNT(*) as count FROM footer_navigation_menus', (err, row) => {
                        if (!err && row) {
                            console.log(`📊 Footer navigation records: ${row.count}`);
                        }
                    });

                    db.get('SELECT COUNT(*) as count FROM footer_social_links', (err, row) => {
                        if (!err && row) {
                            console.log(`📊 Footer social links records: ${row.count}`);
                        }
                    });

                    console.log('\n✅ FOOTER DATABASE SETUP COMPLETE!');
                    console.log('🚀 The footer should now load correctly from the database.');
                    console.log('\n📋 Next steps:');
                    console.log('1. Restart your server: npm start');
                    console.log('2. Refresh your browser');
                    console.log('3. The footer should now display only top navigation items');

                    db.close();
                });
            });
        });
    });
});