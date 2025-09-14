-- Update Hebrew FAQ Content in home_pages table
-- This script updates FAQ titles and answers with proper Hebrew translations

-- First, check if Hebrew record exists
DO $$
BEGIN
    -- Ensure Hebrew locale record exists
    IF NOT EXISTS (SELECT 1 FROM home_pages WHERE locale = 'he') THEN
        INSERT INTO home_pages (locale, created_at, updated_at, published_at, created_by_id, updated_by_id)
        SELECT 'he', NOW(), NOW(), NOW(), 1, 1
        WHERE NOT EXISTS (SELECT 1 FROM home_pages WHERE locale = 'he');
    END IF;
END $$;

-- Update FAQ questions and answers in Hebrew
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

    -- Update timestamp
    updated_at = NOW()
WHERE locale = 'he';

-- Add additional FAQ-related content
UPDATE home_pages
SET
    -- FAQ CTA (Call to Action)
    faq_cta_title = 'עדיין יש לך שאלות?',
    faq_cta_description = 'צוות התמיכה שלנו כאן כדי לעזור לך',
    faq_cta_button = 'צור קשר',

    -- FAQ Meta information
    faq_section_visible = true,
    faq_section_order = 7,

    updated_at = NOW()
WHERE locale = 'he';

-- Verify the update
SELECT
    locale,
    faq_title,
    faq_1_title,
    faq_2_title,
    faq_3_title,
    faq_4_title,
    faq_5_title,
    faq_6_title
FROM home_pages
WHERE locale = 'he';