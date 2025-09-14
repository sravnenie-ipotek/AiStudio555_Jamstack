-- Complete Migration and Update for Hebrew FAQ Content
-- This script adds missing columns and updates FAQ content

-- First, add missing FAQ columns if they don't exist
DO $$
BEGIN
    -- Add FAQ main title and heading if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_title') THEN
        ALTER TABLE home_pages ADD COLUMN faq_title TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_heading') THEN
        ALTER TABLE home_pages ADD COLUMN faq_heading TEXT;
    END IF;

    -- Add FAQ answer columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_1_answer') THEN
        ALTER TABLE home_pages ADD COLUMN faq_1_answer TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_2_answer') THEN
        ALTER TABLE home_pages ADD COLUMN faq_2_answer TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_3_answer') THEN
        ALTER TABLE home_pages ADD COLUMN faq_3_answer TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_4_answer') THEN
        ALTER TABLE home_pages ADD COLUMN faq_4_answer TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_5_answer') THEN
        ALTER TABLE home_pages ADD COLUMN faq_5_answer TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_6_answer') THEN
        ALTER TABLE home_pages ADD COLUMN faq_6_answer TEXT;
    END IF;

    -- Add FAQ CTA columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_cta_title') THEN
        ALTER TABLE home_pages ADD COLUMN faq_cta_title TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_cta_description') THEN
        ALTER TABLE home_pages ADD COLUMN faq_cta_description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_cta_button') THEN
        ALTER TABLE home_pages ADD COLUMN faq_cta_button TEXT;
    END IF;

    -- Add FAQ visibility columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_section_visible') THEN
        ALTER TABLE home_pages ADD COLUMN faq_section_visible BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'home_pages' AND column_name = 'faq_section_order') THEN
        ALTER TABLE home_pages ADD COLUMN faq_section_order INTEGER DEFAULT 7;
    END IF;
END $$;

-- Ensure Hebrew record exists
INSERT INTO home_pages (locale, created_at, updated_at, published_at, created_by_id, updated_by_id)
SELECT 'he', NOW(), NOW(), NOW(), 1, 1
WHERE NOT EXISTS (SELECT 1 FROM home_pages WHERE locale = 'he');

-- Update Hebrew FAQ content with proper translations
UPDATE home_pages
SET
    -- FAQ Section Title
    faq_title = 'שאלות נפוצות',
    faq_heading = 'תשובות לשאלות הנפוצות ביותר',

    -- FAQ 1: Offered Courses
    faq_1_title = 'אילו סוגי קורסי AI ו-IT זמינים?',
    faq_1_answer = 'אנו מציעים קורסים מקיפים בפיתוח AI, למידת מכונה, מדעי הנתונים, פיתוח אתרים, פיתוח אפליקציות מובייל, מחשוב ענן, אבטחת סייבר ועוד. כל הקורסים מתוכננים עם 85% עבודה מעשית ופרויקטים מהעולם האמיתי.',

    -- FAQ 2: Course Duration
    faq_2_title = 'כמה זמן לוקח להשלים קורס?',
    faq_2_answer = 'משך הקורס משתנה בין 3 ל-6 חודשים בהתאם לתוכנית. אתה יכול ללמוד בקצב שלך עם גישה לכל החיים לחומרי הקורס. רוב הסטודנטים משלימים קורסים תוך כדי עבודה במשרה מלאה.',

    -- FAQ 3: Support During Learning
    faq_3_title = 'איזה סוג תמיכה ניתנת במהלך הלמידה?',
    faq_3_answer = 'אנו מספקים תמיכה 24/7 דרך צאט, הדרכה אישית ממנטורים מומחים בתעשייה, סקירות קוד שבועיות, סשנים של שאלות ותשובות בשידור חי, וקהילת תלמידים פעילה לשיתוף פעולה ונטוורקינג.',

    -- FAQ 4: Prerequisites
    faq_4_title = 'האם אני צריך ניסיון קודם בתכנות?',
    faq_4_answer = 'רמת הידע הנדרשת משתנה בהתאם לקורס. קורסים למתחילים לא דורשים ניסיון קודם, בעוד שקורסים מתקדמים דורשים ידע בסיסי בתכנות. כל קורס כולל תיאור מפורט של דרישות הקדם.',

    -- FAQ 5: Certification
    faq_5_title = 'האם אקבל תעודה לאחר סיום הקורס?',
    faq_5_answer = 'כן! בסיום מוצלח של הקורס ופרויקט הגמר, תקבל תעודה מאומתת המוכרת בתעשייה. התעודה כוללת קוד QR לאימות ויכולה להתווסף לפרופיל הלינקדאין שלך.',

    -- FAQ 6: Self-paced Learning
    faq_6_title = 'האם אוכל ללמוד בקצב שלי?',
    faq_6_answer = 'בהחלט! כל הקורסים שלנו מאפשרים למידה בקצב עצמי. תקבל גישה לכל החיים לחומרי הקורס, הקלטות וידאו, ומשאבים. אתה יכול ללמוד מתי שנוח לך ולחזור על השיעורים כמה פעמים שתרצה.',

    -- FAQ CTA
    faq_cta_title = 'עדיין יש לך שאלות?',
    faq_cta_description = 'צוות התמיכה שלנו כאן כדי לעזור לך',
    faq_cta_button = 'צור קשר',

    -- Meta information
    faq_section_visible = true,
    faq_section_order = 7,

    -- Update timestamp
    updated_at = NOW()
WHERE locale = 'he';

-- Update English FAQ content (for consistency)
UPDATE home_pages
SET
    faq_title = 'Frequently Asked Questions',
    faq_heading = 'Get answers to the most common questions',

    faq_1_title = 'What types of AI and IT courses are available?',
    faq_1_answer = 'We offer comprehensive courses in AI Development, Machine Learning, Data Science, Web Development, Mobile App Development, Cloud Computing, Cybersecurity, and more. All courses are designed with 85% practical work and real-world projects.',

    faq_2_title = 'How long does it take to complete a course?',
    faq_2_answer = 'Course duration varies from 3 to 6 months depending on the program. You can learn at your own pace with lifetime access to course materials. Most students complete courses while working full-time.',

    faq_3_title = 'What kind of support is provided during learning?',
    faq_3_answer = 'We provide 24/7 support through chat, personal mentorship from industry experts, weekly code reviews, live Q&A sessions, and an active student community for collaboration and networking.',

    faq_4_title = 'Do I need prior programming experience?',
    faq_4_answer = 'Requirements vary by course. Beginner courses require no prior experience, while advanced courses need basic programming knowledge. Each course includes detailed prerequisite information.',

    faq_5_title = 'Will I receive a certificate after completion?',
    faq_5_answer = 'Yes! Upon successful completion of the course and final project, you receive an industry-recognized verified certificate with a QR code for authentication that can be added to your LinkedIn profile.',

    faq_6_title = 'Can I learn at my own pace?',
    faq_6_answer = 'Absolutely! All our courses are self-paced. You get lifetime access to course materials, video recordings, and resources. Learn when it suits you and revisit lessons as many times as needed.',

    faq_cta_title = 'Still have questions?',
    faq_cta_description = 'Our support team is here to help',
    faq_cta_button = 'Contact Us',

    faq_section_visible = true,
    faq_section_order = 7,

    updated_at = NOW()
WHERE locale = 'en';

-- Verify the updates
SELECT
    locale,
    faq_title,
    faq_1_title,
    faq_1_answer,
    faq_2_title,
    faq_2_answer
FROM home_pages
WHERE locale IN ('he', 'en')
ORDER BY locale;