-- Migration: Add Career Orientation and Career Center Pages
-- This migration creates tables for career-related pages with multi-language support

-- Create career_orientation_pages table
CREATE TABLE IF NOT EXISTS career_orientation_pages (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(5) DEFAULT 'en',
  title VARCHAR(255),
  subtitle VARCHAR(255),
  description TEXT,
  hero_title VARCHAR(255),
  hero_subtitle VARCHAR(255),
  hero_description TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create career_center_pages table
CREATE TABLE IF NOT EXISTS career_center_pages (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(5) DEFAULT 'en',
  title VARCHAR(255),
  subtitle VARCHAR(255),
  description TEXT,
  hero_title VARCHAR(255),
  hero_subtitle VARCHAR(255),
  hero_description TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_career_orientation_pages_locale ON career_orientation_pages(locale);
CREATE INDEX IF NOT EXISTS idx_career_center_pages_locale ON career_center_pages(locale);

-- Insert default English content for Career Orientation
INSERT INTO career_orientation_pages (
  locale, title, subtitle, description,
  hero_title, hero_subtitle, hero_description,
  published_at
) VALUES (
  'en',
  'Career Orientation - Find Your Path',
  'Discover Your Professional Journey',
  'Our career orientation program helps you identify your strengths, explore career options, and make informed decisions about your professional future.',
  'Navigate Your Career Path',
  'Expert Guidance for Your Professional Development',
  'Join our comprehensive career orientation program designed to help you discover your potential and chart a successful career path in technology.',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Insert Russian content for Career Orientation
INSERT INTO career_orientation_pages (
  locale, title, subtitle, description,
  hero_title, hero_subtitle, hero_description,
  published_at
) VALUES (
  'ru',
  'Профориентация - Найдите свой путь',
  'Откройте свой профессиональный путь',
  'Наша программа профориентации поможет вам определить свои сильные стороны, изучить варианты карьеры и принять обоснованные решения о вашем профессиональном будущем.',
  'Навигация по карьерному пути',
  'Экспертное руководство для вашего профессионального развития',
  'Присоединяйтесь к нашей комплексной программе профориентации, разработанной чтобы помочь вам раскрыть свой потенциал и построить успешную карьеру в технологиях.',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Insert Hebrew content for Career Orientation
INSERT INTO career_orientation_pages (
  locale, title, subtitle, description,
  hero_title, hero_subtitle, hero_description,
  published_at
) VALUES (
  'he',
  'הכוונה תעסוקתית - מצאו את הדרך שלכם',
  'גלו את המסע המקצועי שלכם',
  'תוכנית ההכוונה התעסוקתית שלנו עוזרת לכם לזהות את החוזקות שלכם, לחקור אפשרויות קריירה ולקבל החלטות מושכלות לגבי העתיד המקצועי שלכם.',
  'נווטו את המסלול המקצועי שלכם',
  'הדרכה מומחית לפיתוח המקצועי שלכם',
  'הצטרפו לתוכנית ההכוונה התעסוקתית המקיפה שלנו, שנועדה לעזור לכם לגלות את הפוטנציאל שלכם ולבנות קריירה מצליחה בטכנולוגיה.',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Insert default English content for Career Center
INSERT INTO career_center_pages (
  locale, title, subtitle, description,
  hero_title, hero_subtitle, hero_description,
  published_at
) VALUES (
  'en',
  'Career Center - Your Success Hub',
  'Resources for Career Excellence',
  'Access comprehensive career resources, job opportunities, and professional development tools to accelerate your career growth.',
  'Welcome to AI Studio Career Center',
  'Your Gateway to Career Success',
  'Connect with top employers, access exclusive job opportunities, and get the support you need to advance your career in technology.',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Insert Russian content for Career Center
INSERT INTO career_center_pages (
  locale, title, subtitle, description,
  hero_title, hero_subtitle, hero_description,
  published_at
) VALUES (
  'ru',
  'Карьерный центр - Ваш центр успеха',
  'Ресурсы для карьерного совершенства',
  'Получите доступ к комплексным карьерным ресурсам, возможностям трудоустройства и инструментам профессионального развития для ускорения вашего карьерного роста.',
  'Добро пожаловать в Карьерный центр AI Studio',
  'Ваш путь к карьерному успеху',
  'Свяжитесь с ведущими работодателями, получите доступ к эксклюзивным вакансиям и получите поддержку, необходимую для продвижения вашей карьеры в технологиях.',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Insert Hebrew content for Career Center
INSERT INTO career_center_pages (
  locale, title, subtitle, description,
  hero_title, hero_subtitle, hero_description,
  published_at
) VALUES (
  'he',
  'מרכז קריירה - מרכז ההצלחה שלכם',
  'משאבים למצוינות בקריירה',
  'קבלו גישה למשאבי קריירה מקיפים, הזדמנויות תעסוקה וכלי פיתוח מקצועי להאצת הצמיחה המקצועית שלכם.',
  'ברוכים הבאים למרכז הקריירה של AI Studio',
  'השער שלכם להצלחה מקצועית',
  'התחברו למעסיקים מובילים, קבלו גישה להזדמנויות עבודה בלעדיות וקבלו את התמיכה שאתם צריכים כדי לקדם את הקריירה שלכם בטכנולוגיה.',
  CURRENT_TIMESTAMP
) ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT locale, COUNT(*) as count FROM career_orientation_pages GROUP BY locale;
SELECT locale, COUNT(*) as count FROM career_center_pages GROUP BY locale;