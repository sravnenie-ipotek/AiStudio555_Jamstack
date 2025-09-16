// Hebrew Career Orientation Content Insertion Script
// This script moves all hardcoded Hebrew content from he/career-orientation.html to the database

const isLocal = process.env.NODE_ENV !== 'production';
const API_BASE = isLocal ? 'http://localhost:1337' : 'https://aistudio555jamstack-production.up.railway.app';

console.log('🇮🇱 Starting Hebrew Career Orientation Content Migration...');
console.log(`📍 API Base: ${API_BASE}`);

async function insertHebrewCareerOrientationContent() {
  try {
    console.log('📊 Preparing comprehensive Hebrew career orientation data...');

    const hebrewCareerData = {
      locale: 'he',

      // Page Metadata
      meta_title: 'כיוון קריירה - פלטפורמת הלמידה AI Studio',
      meta_description: 'גלו את מסלול הקריירה המושלם שלכם ב-AI/ML עם הדרכה אישית מותאמת',

      // Inner Banner
      title: 'כיוון קריירה',

      // Hero Section
      hero_subtitle: 'ייעוץ קריירה מקצועי',
      hero_main_title: 'מצאו את הקריירה המושלמת שלכם בעולם הטכנולוגיה',
      hero_description: 'מרגישים אבודים בבחירת המקצוע? לא יודעים איך לעבור לתחום הטכנולוגיה? אנחנו כאן כדי לעזור לכם למצוא את הכיוון הנכון ולבנות קריירה מצליחה.',
      hero_cta_text: 'קבלו ייעוץ חינם עכשיו',

      // Problem Identification Section
      problems_subtitle: 'האתגרים הנפוצים',
      problems_main_title: 'מתלבטים בבחירת הקריירה שלכם?',
      problems_description: 'אתם לא לבד. רבים מתמודדים עם האתגרים הבאים בדרך למציאת הקריירה המתאימה.',

      // Challenge Cards
      challenge1_title: 'שחיקה ועייפות מהעבודה הנוכחית',
      challenge1_description: 'מרגישים תקועים בעבודה שלא מספקת אתכם ולא רואים אפשרויות להתקדמות או לשינוי משמעותי.',

      challenge2_title: 'חוסר ביטחון תעסוקתי',
      challenge2_description: 'חשש מפיטורים, אוטומציה או שינויים בשוק העבודה שעלולים לפגוע בביטחון הכלכלי שלכם.',

      challenge3_title: 'היעדר הזדמנויות צמיחה',
      challenge3_description: 'תחושה שהגעתם לתקרת זכוכית במקצוע הנוכחי וחסרות אפשרויות להתפתחות מקצועית.',

      challenge4_title: 'רצון לשינוי אך חוסר כיוון',
      challenge4_description: 'יודעים שרוצים לשנות כיוון מקצועי אבל לא בטוחים לאיזה תחום לעבור ואיך להתחיל.',

      // Solution Overview Section
      solutions_subtitle: 'אלגוריתם העבודה שלנו',
      solutions_main_title: '4 שלבים לקריירה מצליחה',
      solutions_description: 'התהליך המקצועי שלנו יוביל אתכם צעד אחר צעד למציאת הקריירה המתאימה.',

      // Expected Outcomes Section (New fields)
      outcomes_subtitle: 'מה תקבלו מהתהליך',
      outcomes_main_title: 'התוצאות הצפויות',
      outcomes_description: 'בסיום התהליך תהיו מצוידים בכל הכלים הדרושים להצלחה מקצועית.',

      outcome1_text: 'ניתוח נקודות החוזק שלכם',
      outcome2_text: 'הכנה לראיונות עבודה',
      outcome3_text: 'המלצות למקצועות IT מתאימים',
      outcome4_text: 'פרופיל פסיכולוגי והתאמה',

      // Process Steps Section (Detailed Cards)
      process_main_title: '4 שלבים לקריירה מצליחה',
      process_subtitle: 'התהליך המוכח שלנו לבניית קריירה מצליחה בטכנולוגיה',

      process_step1_title: 'השאירו בקשה באתר',
      process_step1_description: 'מלאו טופס קצר עם הפרטים שלכם ונחזור אליכם תוך 24 שעות',
      process_step1_duration: 'משך זמן: 3 דקות',

      process_step2_title: 'ייעוץ ראשוני חינם',
      process_step2_description: 'שיחת ייעוץ של עד 20 דקות להבנת הצרכים והמטרות שלכם',
      process_step2_duration: 'משך זמן: עד 20 דקות',

      process_step3_title: 'עבודה עם יועץ קריירה',
      process_step3_description: 'פגישות ייעוץ מעמיקות לבניית אסטרטגיה אישית',
      process_step3_duration: 'משך זמן: מותאם אישית',

      process_step4_title: 'בניית תכנית קריירה',
      process_step4_description: 'תכנית פעולה מפורטת עם יעדים ברורים ולוחות זמנים',
      process_step4_duration: 'משך זמן: תוך 48 שעות',

      // AI/Tech Career Paths Section
      career_paths_main_title: 'מסלולי קריירה בטכנולוגיה ו-AI',
      career_paths_subtitle: 'גלו את ההתמחויות המבוקשות ביותר במדעי המחשב והבינה המלאכותית ומצאו את הנתיב המתאים לכם',

      // Career Path Examples (using existing fields)
      career_path1_title: 'מהנדס למידת מכונה',
      career_path1_description: 'פיתוח ופריסת מודלי למידת מכונה למערכות ויישומים חכמים',
      career_path1_salary_range: 'שכר ממוצע: $130,000 לשנה',

      career_path2_title: 'מדען נתונים',
      career_path2_description: 'הפקת תובנות מנתונים מורכבים לקבלת החלטות עסקיות',
      career_path2_salary_range: 'שכר ממוצע: $120,000 לשנה',

      career_path3_title: 'חוקר בינה מלאכותית',
      career_path3_description: 'פיתוח טכנולוגיות AI חדשניות וקידום התחום באמצעות מחקר מתקדם',

      // Expert Profile Section
      expert_name: 'יוליה רז\'בובה',
      expert_title: 'HR Business Partner ויועצת קריירה',
      expert_description: 'יוליה בעלת ניסיון עשיר בתחום משאבי האנוש וייעוץ קריירה. היא עוזרת לאנשים למצוא את הכיוון המקצועי הנכון ולהשיג את המטרות הקריירה שלהם. יוליה מתמחה בליווי אנשים המעוניינים לעבור לתחום הטכנולוגיה והיי-טק.',

      // Expert Stats (New fields)
      expert_stat1_number: '500+',
      expert_stat1_label: 'ייעוצים אישיים',
      expert_stat2_number: '2000+',
      expert_stat2_label: 'בוגרים',

      // Application Form Section (CTA)
      cta_subtitle: 'התחל עכשיו',
      cta_main_title: 'קבלו ייעוץ חינם',
      cta_description: 'השאירו פרטים ונחזור אליכם תוך 24 שעות לתיאום פגישת ייעוץ ללא עלות.',
      cta_button_text: 'קבלו ייעוץ חינם עכשיו',
      cta_privacy_text: 'לחיצה על הכפתור תפתח טופס יצירת קשר מהיר. אנחנו מכבדים את הפרטיות שלכם.',

      // Visibility flags
      hero_visible: true,
      problems_visible: true,
      solutions_visible: true,
      process_visible: true,
      career_paths_visible: true,
      expert_visible: true,
      cta_visible: true
    };

    console.log('🚀 Sending Hebrew content to API...');

    const response = await fetch(`${API_BASE}/api/career-orientation-page`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: hebrewCareerData
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Hebrew career orientation content inserted successfully!');
    console.log('📊 Result:', result);

    // Verify the data was inserted
    console.log('🔍 Verifying Hebrew content...');
    const verifyResponse = await fetch(`${API_BASE}/api/career-orientation-page?locale=he`);

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Verification successful!');
      console.log('📝 Hero title:', verifyData.data.attributes.heroMainTitle);
      console.log('📝 Main title:', verifyData.data.attributes.heroMainTitle);
      console.log('📝 Process title:', verifyData.data.attributes.processMainTitle);
      console.log('📝 Expert name:', verifyData.data.attributes.expertName);

      return {
        success: true,
        insertedFields: Object.keys(hebrewCareerData).length,
        verificationStatus: 'success'
      };
    } else {
      console.log('⚠️ Verification failed but insertion completed');
      return {
        success: true,
        insertedFields: Object.keys(hebrewCareerData).length,
        verificationStatus: 'failed'
      };
    }

  } catch (error) {
    console.error('❌ Error inserting Hebrew career orientation content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute the insertion
(async () => {
  console.log('🎯 Starting Hebrew Career Orientation Migration...');
  const result = await insertHebrewCareerOrientationContent();

  if (result.success) {
    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Inserted ${result.insertedFields} fields for Hebrew career orientation`);
    console.log('✅ The text "מצאו את הקריירה המושלמת שלכם" is now in the database and searchable!');
  } else {
    console.log('💥 Migration failed:', result.error);
    process.exit(1);
  }
})();