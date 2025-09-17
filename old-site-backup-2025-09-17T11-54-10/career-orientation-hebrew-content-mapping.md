# Career Orientation Hebrew Content Mapping

## Database Schema Analysis
The `career_orientation_pages` table has 120+ comprehensive fields covering all sections of the career orientation page.

## Content Mapping: Hebrew Hardcoded Text → Database Fields

### 1. Page Metadata (Head Section)
```
SOURCE: lines 5-6 in he/career-orientation.html
HARDCODED: "Career Orientation - AI Studio E-Learning Platform"
DATABASE FIELD: meta_title
HEBREW VALUE: "כיוון קריירה - פלטפורמת הלמידה AI Studio"

HARDCODED: "Discover your perfect AI/ML career path with personalized guidance"
DATABASE FIELD: meta_description
HEBREW VALUE: "גלו את מסלול הקריירה המושלם שלכם ב-AI/ML עם הדרכה אישית מותאמת"
```

### 2. Navigation Menu
```
SOURCE: lines 227-252
HARDCODED: "בית" (Home)
DATABASE FIELD: Should use existing navigation translation system

HARDCODED: "קורסים" (Courses)
DATABASE FIELD: Should use existing navigation translation system

HARDCODED: "מורים" (Teachers)
DATABASE FIELD: Should use existing navigation translation system

HARDCODED: "שירותי קריירה" (Career Services)
DATABASE FIELD: Should use existing navigation translation system

HARDCODED: "כיוון קריירה" (Career Orientation)
DATABASE FIELD: Should use existing navigation translation system

HARDCODED: "מרכז קריירה" (Career Center)
DATABASE FIELD: Should use existing navigation translation system

HARDCODED: "תוכניות תמחור" (Pricing Plans)
DATABASE FIELD: Should use existing navigation translation system

HARDCODED: "הרשמו היום" (Sign Up Today)
DATABASE FIELD: Should use existing navigation translation system
```

### 3. Inner Banner Section
```
SOURCE: lines 276, 279, 281
HARDCODED: "כיוון קריירה" (Career Orientation)
DATABASE FIELD: title
HEBREW VALUE: "כיוון קריירה"

HARDCODED: "בית" (Home)
DATABASE FIELD: Part of breadcrumb navigation, should use navigation system
```

### 4. Hero Section
```
SOURCE: line 293
HARDCODED: "ייעוץ קריירה מקצועי"
DATABASE FIELD: hero_subtitle
HEBREW VALUE: "ייעוץ קריירה מקצועי"

SOURCE: line 296
HARDCODED: "מצאו את הקריירה המושלמת שלכם בעולם הטכנולוגיה"
DATABASE FIELD: hero_main_title
HEBREW VALUE: "מצאו את הקריירה המושלמת שלכם בעולם הטכנולוגיה"

SOURCE: line 297
HARDCODED: "מרגישים אבודים בבחירת המקצוע? לא יודעים איך לעבור לתחום הטכנולוגיה? אנחנו כאן כדי לעזור לכם למצוא את הכיוון הנכון ולבנות קריירה מצליחה."
DATABASE FIELD: hero_description
HEBREW VALUE: "מרגישים אבודים בבחירת המקצוע? לא יודעים איך לעבור לתחום הטכנולוגיה? אנחנו כאן כדי לעזור לכם למצוא את הכיוון הנכון ולבנות קריירה מצליחה."

SOURCE: line 303
HARDCODED: "קבלו ייעוץ חינם עכשיו"
DATABASE FIELD: hero_cta_text
HEBREW VALUE: "קבלו ייעוץ חינם עכשיו"
```

### 5. Problem Identification Section
```
SOURCE: line 318
HARDCODED: "האתגרים הנפוצים"
DATABASE FIELD: problems_subtitle
HEBREW VALUE: "האתגרים הנפוצים"

SOURCE: line 321
HARDCODED: "מתלבטים בבחירת הקריירה שלכם?"
DATABASE FIELD: problems_main_title
HEBREW VALUE: "מתלבטים בבחירת הקריירה שלכם?"

SOURCE: line 322
HARDCODED: "אתם לא לבד. רבים מתמודדים עם האתגרים הבאים בדרך למציאת הקריירה המתאימה."
DATABASE FIELD: problems_description
HEBREW VALUE: "אתם לא לבד. רבים מתמודדים עם האתגרים הבאים בדרך למציאת הקריירה המתאימה."

SOURCE: line 328
HARDCODED: "שחיקה ועייפות מהעבודה הנוכחית"
DATABASE FIELD: challenge1_title
HEBREW VALUE: "שחיקה ועייפות מהעבודה הנוכחית"

SOURCE: line 329
HARDCODED: "מרגישים תקועים בעבודה שלא מספקת אתכם ולא רואים אפשרויות להתקדמות או לשינוי משמעותי."
DATABASE FIELD: challenge1_description
HEBREW VALUE: "מרגישים תקועים בעבודה שלא מספקת אתכם ולא רואים אפשרויות להתקדמות או לשינוי משמעותי."

SOURCE: line 333
HARDCODED: "חוסר ביטחון תעסוקתי"
DATABASE FIELD: challenge2_title
HEBREW VALUE: "חוסר ביטחון תעסוקתי"

SOURCE: line 334
HARDCODED: "חשש מפיטורים, אוטומציה או שינויים בשוק העבודה שעלולים לפגוע בביטחון הכלכלי שלכם."
DATABASE FIELD: challenge2_description
HEBREW VALUE: "חשש מפיטורים, אוטומציה או שינויים בשוק העבודה שעלולים לפגוע בביטחון הכלכלי שלכם."

SOURCE: line 338
HARDCODED: "היעדר הזדמנויות צמיחה"
DATABASE FIELD: challenge3_title
HEBREW VALUE: "היעדר הזדמנויות צמיחה"

SOURCE: line 339
HARDCODED: "תחושה שהגעתם לתקרת זכוכית במקצוע הנוכחי וחסרות אפשרויות להתפתחות מקצועית."
DATABASE FIELD: challenge3_description
HEBREW VALUE: "תחושה שהגעתם לתקרת זכוכית במקצוע הנוכחי וחסרות אפשרויות להתפתחות מקצועית."

SOURCE: line 343
HARDCODED: "רצון לשינוי אך חוסר כיוון"
DATABASE FIELD: challenge4_title
HEBREW VALUE: "רצון לשינוי אך חוסר כיוון"

SOURCE: line 344
HARDCODED: "יודעים שרוצים לשנות כיוון מקצועי אבל לא בטוחים לאיזה תחום לעבור ואיך להתחיל."
DATABASE FIELD: challenge4_description
HEBREW VALUE: "יודעים שרוצים לשנות כיוון מקצועי אבל לא בטוחים לאיזה תחום לעבור ואיך להתחיל."
```

### 6. Solution Overview Section
```
SOURCE: line 356
HARDCODED: "אלגוריתם העבודה שלנו"
DATABASE FIELD: solutions_subtitle
HEBREW VALUE: "אלגוריתם העבודה שלנו"

SOURCE: line 359
HARDCODED: "4 שלבים לקריירה מצליחה"
DATABASE FIELD: solutions_main_title
HEBREW VALUE: "4 שלבים לקריירה מצליחה"

SOURCE: line 360
HARDCODED: "התהליך המקצועי שלנו יוביל אתכם צעד אחר צעד למציאת הקריירה המתאימה."
DATABASE FIELD: solutions_description (needs to be added)
HEBREW VALUE: "התהליך המקצועי שלנו יוביל אתכם צעד אחר צעד למציאת הקריירה המתאימה."

SOURCE: line 365
HARDCODED: "השאירו בקשה באתר"
DATABASE FIELD: solution1_title (needs mapping to algorithm steps)
HEBREW VALUE: "השאירו בקשה באתר"

SOURCE: line 366
HARDCODED: "מילוי פרטים בסיסיים ותיאום פגישת ייעוץ ראשונית. התהליך לא לוקח יותר מ-3 דקות."
DATABASE FIELD: solution1_description
HEBREW VALUE: "מילוי פרטים בסיסיים ותיאום פגישת ייעוץ ראשונית. התהליך לא לוקח יותר מ-3 דקות."

SOURCE: line 369
HARDCODED: "ייעוץ ראשוני חינם (עד 20 דקות)"
DATABASE FIELD: solution2_title (needs mapping to algorithm steps)
HEBREW VALUE: "ייעוץ ראשוני חינם (עד 20 דקות)"

SOURCE: line 370
HARDCODED: "שיחת ייעוץ אישית עם יועץ קריירה מקצועי להכרת המצב הנוכחי והמטרות שלכם."
DATABASE FIELD: solution2_description
HEBREW VALUE: "שיחת ייעוץ אישית עם יועץ קריירה מקצועי להכרת המצב הנוכחי והמטרות שלכם."

SOURCE: line 373
HARDCODED: "עבודה עם יועץ קריירה"
DATABASE FIELD: Needs new field for step 3
HEBREW VALUE: "עבודה עם יועץ קריירה"

SOURCE: line 374
HARDCODED: "ליווי מקצועי מותאם אישית, בדיקת כישורים קיימים וזיהוי נקודות חוזק ותחומי התמחות."
DATABASE FIELD: Needs new field for step 3 description
HEBREW VALUE: "ליווי מקצועי מותאם אישית, בדיקת כישורים קיימים וזיהוי נקודות חוזק ותחומי התמחות."

SOURCE: line 377
HARDCODED: "בניית תכנית קריירה ישימה"
DATABASE FIELD: Needs new field for step 4
HEBREW VALUE: "בניית תכנית קריירה ישימה"

SOURCE: line 378
HARDCODED: "קבלת תוכנית עבודה מפורטת עם לוחות זמנים, המלצות ללימודים ואסטרטגיית חיפוש עבודה."
DATABASE FIELD: Needs new field for step 4 description
HEBREW VALUE: "קבלת תוכנית עבודה מפורטת עם לוחות זמנים, המלצות ללימודים ואסטרטגיית חיפוש עבודה."
```

### 7. Expected Outcomes Section
```
SOURCE: line 390
HARDCODED: "מה תקבלו מהתהליך"
DATABASE FIELD: Needs new field: outcomes_subtitle
HEBREW VALUE: "מה תקבלו מהתהליך"

SOURCE: line 393
HARDCODED: "התוצאות הצפויות"
DATABASE FIELD: Needs new field: outcomes_main_title
HEBREW VALUE: "התוצאות הצפויות"

SOURCE: line 394
HARDCODED: "בסיום התהליך תהיו מצוידים בכל הכלים הדרושים להצלחה מקצועית."
DATABASE FIELD: Needs new field: outcomes_description
HEBREW VALUE: "בסיום התהליך תהיו מצוידים בכל הכלים הדרושים להצלחה מקצועית."

SOURCE: lines 400, 404, 408, 412
HARDCODED: "ניתוח נקודות החוזק שלכם", "הכנה לראיונות עבודה", "המלצות למקצועות IT מתאימים", "פרופיל פסיכולוגי והתאמה"
DATABASE FIELD: Needs new fields: outcome1_text, outcome2_text, outcome3_text, outcome4_text
```

### 8. Process Steps Section (Detailed Cards)
```
SOURCE: line 422
HARDCODED: "4 שלבים לקריירה מצליחה"
DATABASE FIELD: process_main_title
HEBREW VALUE: "4 שלבים לקריירה מצליחה"

SOURCE: line 423
HARDCODED: "התהליך המוכח שלנו לבניית קריירה מצליחה בטכנולוגיה"
DATABASE FIELD: process_subtitle
HEBREW VALUE: "התהליך המוכח שלנו לבניית קריירה מצליחה בטכנולוגיה"

SOURCE: line 429
HARDCODED: "השאירו בקשה באתר"
DATABASE FIELD: process_step1_title
HEBREW VALUE: "השאירו בקשה באתר"

SOURCE: line 430
HARDCODED: "מלאו טופס קצר עם הפרטים שלכם ונחזור אליכם תוך 24 שעות"
DATABASE FIELD: process_step1_description
HEBREW VALUE: "מלאו טופס קצר עם הפרטים שלכם ונחזור אליכם תוך 24 שעות"

SOURCE: line 431
HARDCODED: "משך זמן: 3 דקות"
DATABASE FIELD: process_step1_duration
HEBREW VALUE: "משך זמן: 3 דקות"

SOURCE: line 436
HARDCODED: "ייעוץ ראשוני חינם"
DATABASE FIELD: process_step2_title
HEBREW VALUE: "ייעוץ ראשוני חינם"

SOURCE: line 437
HARDCODED: "שיחת ייעוץ של עד 20 דקות להבנת הצרכים והמטרות שלכם"
DATABASE FIELD: process_step2_description
HEBREW VALUE: "שיחת ייעוץ של עד 20 דקות להבנת הצרכים והמטרות שלכם"

SOURCE: line 438
HARDCODED: "משך זמן: עד 20 דקות"
DATABASE FIELD: process_step2_duration
HEBREW VALUE: "משך זמן: עד 20 דקות"

SOURCE: line 443
HARDCODED: "עבודה עם יועץ קריירה"
DATABASE FIELD: process_step3_title
HEBREW VALUE: "עבודה עם יועץ קריירה"

SOURCE: line 444
HARDCODED: "פגישות ייעוץ מעמיקות לבניית אסטרטגיה אישית"
DATABASE FIELD: process_step3_description
HEBREW VALUE: "פגישות ייעוץ מעמיקות לבניית אסטרטגיה אישית"

SOURCE: line 445
HARDCODED: "משך זמן: מותאם אישית"
DATABASE FIELD: process_step3_duration
HEBREW VALUE: "משך זמן: מותאם אישית"

SOURCE: line 450
HARDCODED: "בניית תכנית קריירה"
DATABASE FIELD: process_step4_title
HEBREW VALUE: "בניית תכנית קריירה"

SOURCE: line 451
HARDCODED: "תכנית פעולה מפורטת עם יעדים ברורים ולוחות זמנים"
DATABASE FIELD: process_step4_description
HEBREW VALUE: "תכנית פעולה מפורטת עם יעדים ברורים ולוחות זמנים"

SOURCE: line 452
HARDCODED: "משך זמן: תוך 48 שעות"
DATABASE FIELD: process_step4_duration
HEBREW VALUE: "משך זמן: תוך 48 שעות"
```

### 9. AI/Tech Career Paths Section
```
SOURCE: line 462
HARDCODED: "מסלולי קריירה בטכנולוגיה ו-AI"
DATABASE FIELD: career_paths_main_title
HEBREW VALUE: "מסלולי קריירה בטכנולוגיה ו-AI"

SOURCE: line 463
HARDCODED: "גלו את ההתמחויות המבוקשות ביותר במדעי המחשב והבינה המלאכותית ומצאו את הנתיב המתאים לכם"
DATABASE FIELD: career_paths_subtitle
HEBREW VALUE: "גלו את ההתמחויות המבוקשות ביותר במדעי המחשב והבינה המלאכותית ומצאו את הנתיב המתאים לכם"

CAREER PATHS (lines 469-521):
SOURCE: line 469
HARDCODED: "מהנדס למידת מכונה"
DATABASE FIELD: career_path1_title
HEBREW VALUE: "מהנדס למידת מכונה"

SOURCE: line 470
HARDCODED: "פיתוח ופריסת מודלי למידת מכונה למערכות ויישומים חכמים"
DATABASE FIELD: career_path1_description
HEBREW VALUE: "פיתוח ופריסת מודלי למידת מכונה למערכות ויישומים חכמים"

SOURCE: line 471
HARDCODED: "שכר ממוצע: $130,000 לשנה"
DATABASE FIELD: career_path1_salary_range
HEBREW VALUE: "שכר ממוצע: $130,000 לשנה"

[Additional career paths continue with similar pattern...]
```

### 10. Expert Profile Section
```
SOURCE: line 544
HARDCODED: "יוליה רז'בובה"
DATABASE FIELD: expert_name
HEBREW VALUE: "יוליה רז'בובה"

SOURCE: line 545
HARDCODED: "HR Business Partner ויועצת קריירה"
DATABASE FIELD: expert_title
HEBREW VALUE: "HR Business Partner ויועצת קריירה"

SOURCE: line 549
HARDCODED: "500+"
DATABASE FIELD: Needs new field: expert_stat1_number
HEBREW VALUE: "500+"

SOURCE: line 549
HARDCODED: "ייעוצים אישיים"
DATABASE FIELD: Needs new field: expert_stat1_label
HEBREW VALUE: "ייעוצים אישיים"

SOURCE: line 552
HARDCODED: "2000+"
DATABASE FIELD: Needs new field: expert_stat2_number
HEBREW VALUE: "2000+"

SOURCE: line 553
HARDCODED: "בוגרים"
DATABASE FIELD: Needs new field: expert_stat2_label
HEBREW VALUE: "בוגרים"

SOURCE: line 558
HARDCODED: "יוליה בעלת ניסיון עשיר בתחום משאבי האנוש וייעוץ קריירה..."
DATABASE FIELD: expert_description
HEBREW VALUE: "יוליה בעלת ניסיון עשיר בתחום משאבי האנוש וייעוץ קריירה. היא עוזרת לאנשים למצוא את הכיוון המקצועי הנכון ולהשיג את המטרות הקריירה שלהם. יוליה מתמחה בליווי אנשים המעוניינים לעבור לתחום הטכנולוגיה והיי-טק."
```

### 11. Application Form Section
```
SOURCE: line 666
HARDCODED: "התחל עכשיו"
DATABASE FIELD: cta_subtitle
HEBREW VALUE: "התחל עכשיו"

SOURCE: line 669
HARDCODED: "קבלו ייעוץ חינם"
DATABASE FIELD: cta_main_title
HEBREW VALUE: "קבלו ייעוץ חינם"

SOURCE: line 670
HARDCODED: "השאירו פרטים ונחזור אליכם תוך 24 שעות לתיאום פגישת ייעוץ ללא עלות."
DATABASE FIELD: cta_description
HEBREW VALUE: "השאירו פרטים ונחזור אליכם תוך 24 שעות לתיאום פגישת ייעוץ ללא עלות."

SOURCE: line 678
HARDCODED: "קבלו ייעוץ חינם עכשיו"
DATABASE FIELD: cta_button_text
HEBREW VALUE: "קבלו ייעוץ חינם עכשיו"

SOURCE: line 684
HARDCODED: "לחיצה על הכפתור תפתח טופס יצירת קשר מהיר. אנחנו מכבדים את הפרטיות שלכם."
DATABASE FIELD: Needs new field: cta_privacy_text
HEBREW VALUE: "לחיצה על הכפתור תפתח טופס יצירת קשר מהיר. אנחנו מכבדים את הפרטיות שלכם."
```

## Required Database Schema Updates

### New Fields Needed:
```sql
-- Solution Overview Section
solutions_description TEXT,

-- Expected Outcomes Section
outcomes_main_title TEXT,
outcomes_subtitle TEXT,
outcomes_description TEXT,
outcome1_text TEXT,
outcome2_text TEXT,
outcome3_text TEXT,
outcome4_text TEXT,

-- Expert Profile Stats
expert_stat1_number TEXT,
expert_stat1_label TEXT,
expert_stat2_number TEXT,
expert_stat2_label TEXT,

-- CTA Privacy Text
cta_privacy_text TEXT
```

## Implementation Priority:
1. **HIGH**: Hero section (critical search content)
2. **HIGH**: Problem identification section
3. **HIGH**: Process steps section
4. **MEDIUM**: Career paths section
5. **MEDIUM**: Expert profile section
6. **LOW**: Navigation (uses existing system)
7. **LOW**: Metadata updates