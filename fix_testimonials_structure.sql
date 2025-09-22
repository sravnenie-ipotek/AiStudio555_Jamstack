
-- Fix testimonials structure
UPDATE nd_home
SET
  content_en = '{"visible":true,"type":"testimonials","content":{"title":"Your Learning Journey With Our Experts","description":"At Zohacous, we believe in a structured yet flexible approach to mentorship designed to help you achieve your goals at every step."},"animations_enabled":true}',
  content_ru = '{"visible":true,"type":"testimonials","content":{"title":"Ваш путь обучения с нашими экспертами","description":"В Zohacous мы верим в структурированный, но гибкий подход к наставничеству, разработанный для достижения ваших целей на каждом этапе."},"animations_enabled":true}',
  content_he = '{"visible":true,"type":"testimonials","content":{"title":"מסע הלמידה שלך עם המומחים שלנו","description":"ב-Zohacous, אנו מאמינים בגישה מובנית אך גמישה לחניכה המיועדת לעזור לך להשיג את המטרות שלך בכל שלב."},"animations_enabled":true}',
  updated_at = CURRENT_TIMESTAMP
WHERE section_key = 'testimonials';