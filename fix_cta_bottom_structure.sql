
-- Fix cta_bottom structure
UPDATE nd_home
SET
  content_en = '{"visible":true,"type":"call_to_action","content":{"title":"Discover A World Of Learning Opportunities","description":"Don''t wait to transform your career and unlock your full potential. Join our community of learners today and elevate your tech career with expert-led courses."},"animations_enabled":true}',
  content_ru = '{"visible":true,"type":"call_to_action","content":{"title":"Откройте Мир Возможностей Для Обучения","description":"Не ждите, чтобы трансформировать свою карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу учащихся сегодня и повысьте свою техническую карьеру с курсами под руководством экспертов."},"animations_enabled":true}',
  content_he = '{"visible":true,"type":"call_to_action","content":{"title":"גלה עולם של הזדמנויות למידה","description":"אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך. הצטרף לקהילת הלומדים שלנו היום והעלה את הקריירה הטכנולוגית שלך עם קורסים בהנחיית מומחים."},"animations_enabled":true}',
  updated_at = CURRENT_TIMESTAMP
WHERE section_key = 'cta_bottom';