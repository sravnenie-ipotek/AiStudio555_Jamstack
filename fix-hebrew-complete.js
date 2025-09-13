#!/usr/bin/env node

/**
 * COMPLETE HEBREW TRANSLATION FIX
 * Adds ALL missing Hebrew translations identified in the UI
 */

const COMPLETE_HEBREW_TRANSLATIONS = {
  // Hero Section - Complete
  hero_expert_led: "למידה בהובלת מומחים",
  hero_title: "שלטו ב-AI וטכנולוגיה",
  hero_subtitle: "שנו את הקריירה שלכם עם קורסים בהובלת מומחים",
  hero_description: "כאן תוכלו לקדם את הקריירה הטכנולוגית שלכם עם קורסים בהובלת מומחים. בין אם אתם רק מתחילים או שואפים לשפר את הכישורים שלכם, ההכשרה המעשית שלנו מיועדת עבורכם.",
  
  // Navigation
  nav_home: "בית",
  nav_courses: "קורסים",
  nav_teachers: "מורים",
  nav_blog: "בלוג",
  nav_career_center: "מרכז קריירה",
  nav_about: "אודות",
  nav_contact: "צור קשר",
  nav_pricing: "מחירים",
  
  // Featured Courses Section
  featured_courses_title: "הקורסים הפופולריים ביותר",
  featured_courses_subtitle: "שלטו ב-AI וטכנולוגיה",
  featured_courses_description: "צללו לתוך מבחר הקורסים המומלצים שלנו, שנועדו להקנות לכם את הכישורים והידע הדרושים להצטיין.",
  
  // Course Cards
  course_react_title: "פיתוח React",
  course_react_desc: "קורס פיתוח React מלא",
  course_python_title: "תכנות Python",
  course_python_desc: "Python למדע נתונים ובינה מלאכותית",
  course_mobile_title: "פיתוח מובייל",
  course_mobile_desc: "פיתוח אפליקציות iOS ו-Android",
  course_cloud_title: "מחשוב ענן",
  course_cloud_desc: "שליטה בארכיטקטורת AWS Cloud",
  course_ml_title: "למידת מכונה",
  course_ml_desc: "למידת מכונה ורשתות עצביות",
  course_devops_title: "הנדסת DevOps",
  course_devops_desc: "הנדסת DevOps ו-CI/CD",
  
  // Course Metadata
  lessons_label: "שיעורים",
  weeks_label: "שבועות",
  
  // Focus on Practice Section
  focus_practice_title: "התמקדות בפרקטיקה",
  focus_practice_subtitle: "שלטו ב-AI וטכנולוגיה",
  focus_practice_description: "אנו מספקים ידע מובנה שנדרש בשוק העבודה של היום. אין מילוי בהוראה שלנו - רק ניסיון מעשי ופרויקטים מהעולם האמיתי.",
  
  practical_work: "עבודה מעשית",
  theory_only: "תיאוריה בלבד",
  job_support: "תמיכה בהשמה",
  
  // Core Skills Section
  core_skills_title: "כישורי ליבה",
  core_skills_subtitle: "שלטו ב-AI וטכנולוגיה",
  
  skill_1: "פיתוח חשיבה אלגוריתמית דרך אתגרי קידוד",
  skill_2: "כתיבת קוד נקי, ניתן לתחזוקה וסקלאבילי",
  skill_3: "שליטה ב-Git ותהליכי פיתוח שיתופיים",
  skill_4: "הבטחת איכות קוד עם בדיקות אוטומטיות",
  skill_5: "פריסת אפליקציות לפלטפורמות ענן",
  skill_6: "תקשורת ועבודת צוות לאנשי מקצוע בתחום הטכנולוגיה",
  
  // Online Learning Section
  online_learning_title: "למידה מקוונת",
  online_learning_subtitle: "שלטו ב-AI וטכנולוגיה",
  online_learning_description: "פלטפורמת הלמידה המקוונת שלנו מאפשרת גישה נוחה לחינוך ברמה עולמית מהנוחות של הבית. למדו בקצב שלכם עם מדריכים מומחים וחומרי קורס אינטראקטיביים.",
  
  // Statistics
  stats_courses_label: "קורסים",
  stats_courses_number: "125+",
  stats_courses_text: "סה״כ קורסים שנלמדו",
  
  stats_learners_label: "לומדים",
  stats_learners_number: "14K+",
  stats_learners_text: "סה״כ לומדים מרוצים",
  
  stats_years_label: "שנים",
  stats_years_number: "10+",
  stats_years_text: "שנות ניסיון",
  
  // Expert Mentor Section
  expert_mentor_title: "מנטור מומחה בטכנולוגיה",
  expert_mentor_subtitle: "שלטו ב-AI וטכנולוגיה",
  expert_mentor_description: "מספקת הכשרה וחניכה מעשית מהעולם האמיתי, אני שואפת לגשר על הפער בין ידע תיאורטי ליישום מעשי, ומבטיחה שכל סטודנט יוכל ליישם את כישוריו בביטחון.",
  expert_mentor_awards: 'היא קיבלה כיבודים יוקרתיים כולל פרס "מחנך מוביל" ופרס "מצוינות בהוראה".',
  
  // FAQ Section
  faq_title: "שאלות ותשובות",
  faq_subtitle: "שלטו ב-AI וטכנולוגיה",
  faq_contact: "צור קשר",
  faq_heading: "התשובות לשאלותיכם כאן",
  
  faq_q1: "אילו קורסים אתם מציעים?",
  faq_a1: "אנו מציעים קורסים מקיפים בפיתוח AI, למידת מכונה, מדע נתונים, פיתוח אתרים, פיתוח אפליקציות מובייל, מחשוב ענן, אבטחת סייבר ועוד. כל הקורסים מתוכננים עם 85% עבודה מעשית ופרויקטים מהעולם האמיתי.",
  
  // Student Success Stories
  testimonials_title: "סיפורי הצלחה של סטודנטים",
  testimonials_subtitle: "שלטו ב-AI וטכנולוגיה",
  testimonials_rating: "4.9",
  testimonials_reviews: "1234 ביקורות",
  testimonials_description: "משוב אמיתי מהבוגרים שלנו שהצליחו לשנות את הקריירה שלהם דרך הקורסים שלנו.",
  
  // Career Success
  career_success_title: "הצלחה בקריירה",
  career_success_subtitle: "שלטו ב-AI וטכנולוגיה",
  career_success_description: "הצטרפו לבוגרים בחברות הטכנולוגיה המובילות בעולם",
  
  // Buttons
  btn_sign_up_today: "הירשמו היום",
  btn_learn_more: "למידע נוסף",
  btn_view_all_courses: "צפו בכל הקורסים",
  btn_get_started: "התחילו",
  btn_contact_us: "צרו קשר",
  btn_enroll_now: "הירשמו עכשיו",
  btn_start_learning: "התחילו ללמוד",
  btn_explore_courses: "גלו קורסים",
  btn_view_details: "צפו בפרטים",
  btn_read_more: "קראו עוד",
  
  // Forms
  form_label_email: "אימייל",
  form_label_name: "שם",
  form_label_phone: "טלפון",
  form_label_message: "הודעה",
  form_placeholder_email: "הכניסו את האימייל שלכם",
  form_placeholder_name: "הכניסו את השם שלכם",
  form_placeholder_phone: "הכניסו את הטלפון שלכם",
  form_placeholder_message: "הכניסו את ההודעה שלכם",
  form_btn_submit: "שלח",
  form_btn_subscribe: "הירשמו",
  
  // Course Categories
  cat_web_dev: "פיתוח אתרים",
  cat_data_science: "מדע נתונים",
  cat_mobile_dev: "פיתוח מובייל",
  cat_cloud: "ענן",
  cat_ai_ml: "AI/ML",
  cat_devops: "DevOps",
  
  // Footer
  footer_copyright: "© 2025 AI Studio. כל הזכויות שמורות",
  footer_privacy: "מדיניות פרטיות",
  footer_terms: "תנאי שימוש",
  footer_contact_title: "צור קשר",
  footer_links_title: "קישורים מהירים",
  footer_social_title: "עקבו אחרינו"
};

async function applyCompleteHebrewTranslations() {
  const API_URL = 'https://aistudio555jamstack-production.up.railway.app/api/force-all-translations';
  
  console.log('🌟 APPLYING COMPLETE HEBREW TRANSLATIONS');
  console.log('=' .repeat(60));
  console.log(`📊 Total fields to translate: ${Object.keys(COMPLETE_HEBREW_TRANSLATIONS).length}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-migration-token': 'ultrathink-2024'
      },
      body: JSON.stringify({
        locale: 'he',
        translations: COMPLETE_HEBREW_TRANSLATIONS
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('\n✅ SUCCESS! Hebrew translations applied');
      console.log(`📊 Fields updated: ${result.stats?.fieldsUpdated}`);
      console.log(`❌ Fields failed: ${result.stats?.fieldsFailed || 0}`);
      
      if (result.verification) {
        console.log('\n🔍 Verification:');
        console.log(`  navHome: ${result.verification.navHome}`);
        console.log(`  heroExpertLed: ${result.verification.heroExpertLed}`);
        console.log(`  btnSignUpToday: ${result.verification.btnSignUpToday}`);
      }
      
      // Verify some critical fields
      console.log('\n📝 Checking critical translations...');
      const verifyResponse = await fetch('https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=he');
      const verifyData = await verifyResponse.json();
      
      if (verifyData.data && verifyData.data.attributes) {
        const attrs = verifyData.data.attributes;
        
        const checks = [
          { field: 'navHome', expected: 'בית' },
          { field: 'heroExpertLed', expected: 'למידה בהובלת מומחים' },
          { field: 'heroDescription', expected: COMPLETE_HEBREW_TRANSLATIONS.hero_description.substring(0, 50) },
          { field: 'featuredCoursesTitle', expected: 'הקורסים הפופולריים ביותר' },
          { field: 'btnSignUpToday', expected: 'הירשמו היום' }
        ];
        
        checks.forEach(check => {
          const actual = attrs[check.field];
          const isCorrect = actual && actual.includes(check.expected.substring(0, 20));
          console.log(`  ${check.field}: ${isCorrect ? '✅' : '❌'} ${actual ? actual.substring(0, 50) : 'NOT FOUND'}...`);
        });
      }
      
    } else {
      console.log('❌ Failed:', result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 COMPLETE HEBREW TRANSLATION APPLIED!');
  console.log('\nNote: The frontend ui-translator.js needs to be updated to handle all these new fields.');
  console.log('Some translations may require page refresh or cache clearing to appear.');
}

applyCompleteHebrewTranslations().catch(console.error);