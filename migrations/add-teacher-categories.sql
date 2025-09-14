-- Add category and additional fields to teachers table
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'all';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS experience VARCHAR(100);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specialties TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS company VARCHAR(200);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(500);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS github_url VARCHAR(500);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_teachers_category ON teachers(category);
CREATE INDEX IF NOT EXISTS idx_teachers_display_order ON teachers(display_order);

-- Insert sample teachers with categories (Hebrew locale)
INSERT INTO teachers (locale, name, title, bio, category, experience, specialties, company, linkedin_url, twitter_url, image_url, published_at)
VALUES
-- Machine Learning Track
('he', 'שרה חן', 'מהנדסת ML בכירה בגוגל', 'מהנדסת למידת מכונה מובילה בגוגל עם מומחיות במערכות המלצה, עיבוד שפה טבעית ו-AutoML. פיתחה מודלים המשרתים מיליארדי משתמשים.', 'machine-learning', '8+ שנות ניסיון', 'TensorFlow,PyTorch,AutoML,NLP', 'Google', 'https://linkedin.com/in/sarah-chen', 'https://twitter.com/sarahchen', 'https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=300&h=300&fit=crop&crop=face', NOW()),

('he', 'מיכאל רודריגז', 'חוקר AI ב-OpenAI', 'חוקר ב-OpenAI העובד על מודלי שפה גדולים ולמידת חיזוק. מחבר משותף של 25+ מאמרים בכנסי ML מובילים.', 'machine-learning', '10+ שנות ניסיון', 'Large Language Models,Reinforcement Learning,Research', 'OpenAI', 'https://linkedin.com/in/michael-rodriguez', 'https://twitter.com/mrodriguez', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', NOW()),

-- Deep Learning Track
('he', 'דוד קים', 'מהנדס ראיית מחשב בטסלה', 'מומחה ראיית מחשב בטסלה העובד על מערכות תפיסה לנהיגה אוטונומית. מתמחה בזיהוי אובייקטים, הערכת עומק והסקה בזמן אמת.', 'deep-learning', '6+ שנות ניסיון', 'Computer Vision,Object Detection,Autonomous Driving', 'Tesla', 'https://linkedin.com/in/david-kim', 'https://twitter.com/davidkim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face', NOW()),

('he', 'אנה קובלסקי', 'מהנדסת NLP במיקרוסופט', 'מהנדסת NLP מובילה במיקרוסופט העובדת על Azure Cognitive Services. מומחית בארכיטקטורות טרנספורמר, מודלים רב-לשוניים ו-AI שיחתי.', 'deep-learning', '7+ שנות ניסיון', 'Transformers,BERT,Conversational AI', 'Microsoft', 'https://linkedin.com/in/anna-kowalski', 'https://twitter.com/annakowalski', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face', NOW()),

-- Data Science Track
('he', 'ג׳יימס וילסון', 'מדען נתונים ראשי באמזון', 'מדען נתונים ראשי באמזון המוביל אנליטיקת לקוחות ומודלי חיזוי. מומחה במידול סטטיסטי, ניתוח סדרות זמן ובינה עסקית.', 'data-science', '9+ שנות ניסיון', 'Statistical Modeling,Time Series,Forecasting', 'Amazon', 'https://linkedin.com/in/james-wilson', 'https://twitter.com/jameswilson', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face', NOW()),

('he', 'מריה סנטוס', 'מנהלת אנליטיקת נתונים בסטרייפ', 'מנהלת אנליטיקת נתונים בסטרייפ המתמקדת באנליטיקת תשלומים וזיהוי הונאות. מומחית בהנדסת פיצ׳רים, פריסת מודלים ואנליטיקה בזמן אמת.', 'data-science', '5+ שנות ניסיון', 'Fraud Detection,Real-time Analytics,SQL', 'Stripe', 'https://linkedin.com/in/maria-santos', 'https://twitter.com/mariasantos', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face', NOW()),

-- Python Development Track
('he', 'אלכס תומפסון', 'מהנדס Backend בכיר בסלאק', 'מהנדס backend בכיר בסלאק הבונה תשתית הודעות ניתנת להרחבה. מומחה בפריימוורקים של Python, ארכיטקטורת מיקרו-שירותים ועיצוב API.', 'python', '11+ שנות ניסיון', 'Django,FastAPI,Microservices', 'Slack', 'https://linkedin.com/in/alex-thompson', 'https://twitter.com/alexthompson', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face', NOW()),

-- Web Development Track
('he', 'רוברט ג׳ונסון', 'ראש Full Stack באפל', 'ראש צוות full stack באפל העובד על כלי מפתחים ופלטפורמות web. מומחה ב-React, Node.js ופרקטיקות פיתוח web מודרניות.', 'web-development', '7+ שנות ניסיון', 'React,Node.js,TypeScript', 'Apple', 'https://linkedin.com/in/robert-johnson', 'https://twitter.com/robertjohnson', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&h=300&fit=crop&crop=face', NOW()),

-- Cloud Computing Track
('he', 'ראג׳ פטל', 'ארכיטקט פתרונות ענן ב-AWS', 'ארכיטקט פתרונות ענן ב-AWS המסייע לארגונים לעבור לענן. מומחה בארכיטקטורות serverless, תזמור containers ואסטרטגיות multi-cloud.', 'cloud-computing', '9+ שנות ניסיון', 'AWS,Serverless,Multi-Cloud', 'AWS', 'https://linkedin.com/in/raj-patel', 'https://twitter.com/rajpatel', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face', NOW()),

-- DevOps Engineering Track
('he', 'ג׳ניפר וו', 'ראש DevOps בגיטהאב', 'ראש DevOps בגיטהאב הבונה תשתית CI/CD למיליוני מפתחים. מומחית ב-Kubernetes, Docker ו-Infrastructure as Code.', 'devops', '8+ שנות ניסיון', 'Kubernetes,CI/CD,Infrastructure as Code', 'GitHub', 'https://linkedin.com/in/jennifer-wu', 'https://twitter.com/jenniferwu', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face', NOW()),

-- Business Intelligence Track
('he', 'מרקוס בראון', 'מנהל BI בסיילספורס', 'מנהל בינה עסקית בסיילספורס המוביל יוזמות ויזואליזציה ואנליטיקה. מומחה ב-Tableau, Power BI ודיווח להנהלה.', 'business-intelligence', '10+ שנות ניסיון', 'Tableau,Power BI,Executive Reporting', 'Salesforce', 'https://linkedin.com/in/marcus-brown', 'https://twitter.com/marcusbrown', 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop&crop=face', NOW()),

-- Product Management Track
('he', 'שרה קים', 'מנהלת מוצר בכירה ב-Airbnb', 'מנהלת מוצר בכירה ב-Airbnb המובילה מוצרי חוויית מארחים. מומחית באסטרטגיית מוצר, מחקר משתמשים ומתודולוגיות פיתוח אג׳ייל.', 'product-management', '7+ שנות ניסיון', 'Product Strategy,User Research,Agile', 'Airbnb', 'https://linkedin.com/in/sarah-kim', 'https://twitter.com/sarahkim', 'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=300&h=300&fit=crop&crop=face', NOW()),

-- UX/UI Design Track
('he', 'אמה דייויס', 'מעצבת ראשית באדובי', 'מעצבת ראשית באדובי המובילה את חוויית המשתמש של Creative Cloud. מומחית בעיצוב ממוקד משתמש, פרוטוטייפינג ומערכות עיצוב.', 'ux-ui-design', '9+ שנות ניסיון', 'User Experience,Design Systems,Prototyping', 'Adobe', 'https://linkedin.com/in/emma-davis', 'https://twitter.com/emmadavis', 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face', NOW())

ON CONFLICT (locale, name) DO UPDATE SET
  title = EXCLUDED.title,
  bio = EXCLUDED.bio,
  category = EXCLUDED.category,
  experience = EXCLUDED.experience,
  specialties = EXCLUDED.specialties,
  company = EXCLUDED.company,
  linkedin_url = EXCLUDED.linkedin_url,
  twitter_url = EXCLUDED.twitter_url,
  image_url = EXCLUDED.image_url,
  updated_at = NOW();