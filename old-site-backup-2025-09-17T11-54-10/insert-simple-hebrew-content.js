// Simplified Hebrew Career Orientation Content Insertion
// Using only fields that definitely exist in the API

const API_BASE = 'http://localhost:3000';

console.log('🇮🇱 Starting SIMPLE Hebrew Career Orientation Content Migration...');

async function insertSimpleHebrewContent() {
  try {
    console.log('📊 Preparing SIMPLE Hebrew career orientation data...');

    // Using only fields that we know exist from the API response
    const hebrewCareerData = {
      // Hero Section - these fields definitely exist
      heroMainTitle: 'מצאו את הקריירה המושלמת שלכם בעולם הטכנולוגיה',
      heroSubtitle: 'ייעוץ קריירה מקצועי',
      heroDescription: 'מרגישים אבודים בבחירת המקצוע? לא יודעים איך לעבור לתחום הטכנולוגיה? אנחנו כאן כדי לעזור לכם למצוא את הכיוון הנכון ולבנות קריירה מצליחה.',
      heroCtaText: 'קבלו ייעוץ חינם עכשיו',

      // Problems Section - these fields definitely exist from API response
      problemsMainTitle: 'מתלבטים בבחירת הקריירה שלכם?',
      problemsSubtitle: 'האתגרים הנפוצים',
      problemsDescription: 'אתם לא לבד. רבים מתמודדים עם האתגרים הבאים בדרך למציאת הקריירה המתאימה.',

      // Challenge Cards - these fields definitely exist
      challenge1Title: 'שחיקה ועייפות מהעבודה הנוכחית',
      challenge1Description: 'מרגישים תקועים בעבודה שלא מספקת אתכם ולא רואים אפשרויות להתקדמות או לשינוי משמעותי.',
      challenge2Title: 'חוסר ביטחון תעסוקתי',
      challenge2Description: 'חשש מפיטורים, אוטומציה או שינויים בשוק העבודה שעלולים לפגוע בביטחון הכלכלי שלכם.',
      challenge3Title: 'היעדר הזדמנויות צמיחה',
      challenge3Description: 'תחושה שהגעתם לתקרת זכוכית במקצוע הנוכחי וחסרות אפשרויות להתפתחות מקצועית.',
      challenge4Title: 'רצון לשינוי אך חוסר כיוון',
      challenge4Description: 'יודעים שרוצים לשנות כיוון מקצועי אבל לא בטוחים לאיזה תחום לעבור ואיך להתחיל.',

      // Solutions Section - these fields definitely exist
      solutionsMainTitle: '4 שלבים לקריירה מצליחה',
      solutionsSubtitle: 'אלגוריתם העבודה שלנו',

      // Process Section - these fields definitely exist
      processMainTitle: '4 שלבים לקריירה מצליחה',
      processSubtitle: 'התהליך המוכח שלנו לבניית קריירה מצליחה בטכנולוגיה',

      processStep1Title: 'השאירו בקשה באתר',
      processStep1Description: 'מלאו טופס קצר עם הפרטים שלכם ונחזור אליכם תוך 24 שעות',
      processStep1Duration: 'משך זמן: 3 דקות',

      processStep2Title: 'ייעוץ ראשוני חינם',
      processStep2Description: 'שיחת ייעוץ של עד 20 דקות להבנת הצרכים והמטרות שלכם',
      processStep2Duration: 'משך זמן: עד 20 דקות',

      processStep3Title: 'עבודה עם יועץ קריירה',
      processStep3Description: 'פגישות ייעוץ מעמיקות לבניית אסטרטגיה אישית',
      processStep3Duration: 'משך זמן: מותאם אישית',

      processStep4Title: 'בניית תכנית קריירה',
      processStep4Description: 'תכנית פעולה מפורטת עם יעדים ברורים ולוחות זמנים',
      processStep4Duration: 'משך זמן: תוך 48 שעות',

      // Career Paths Section - these fields definitely exist
      careerPathsMainTitle: 'מסלולי קריירה בטכנולוגיה ו-AI',
      careerPathsSubtitle: 'גלו את ההתמחויות המבוקשות ביותר במדעי המחשב והבינה המלאכותית ומצאו את הנתיב המתאים לכם',

      careerPath1Title: 'מהנדס למידת מכונה',
      careerPath1Description: 'פיתוח ופריסת מודלי למידת מכונה למערכות ויישומים חכמים',
      careerPath1SalaryRange: 'שכר ממוצע: $130,000 לשנה',

      careerPath2Title: 'מדען נתונים',
      careerPath2Description: 'הפקת תובנות מנתונים מורכבים לקבלת החלטות עסקיות',
      careerPath2SalaryRange: 'שכר ממוצע: $120,000 לשנה',

      careerPath3Title: 'חוקר בינה מלאכותית',
      careerPath3Description: 'פיתוח טכנולוגיות AI חדשניות וקידום התחום באמצעות מחקר מתקדם',

      // Expert Section - these fields definitely exist
      expertName: 'יוליה רז\'בובה',
      expertTitle: 'HR Business Partner ויועצת קריירה',
      expertDescription: 'יוליה בעלת ניסיון עשיר בתחום משאבי האנוש וייעוץ קריירה. היא עוזרת לאנשים למצוא את הכיוון המקצועי הנכון ולהשיג את המטרות הקריירה שלהם. יוליה מתמחה בליווי אנשים המעוניינים לעבור לתחום הטכנולוגיה והיי-טק.',

      // CTA Section - these fields definitely exist
      ctaMainTitle: 'קבלו ייעוץ חינם',
      ctaSubtitle: 'התחל עכשיו',
      ctaDescription: 'השאירו פרטים ונחזור אליכם תוך 24 שעות לתיאום פגישת ייעוץ ללא עלות.',
      ctaButtonText: 'קבלו ייעוץ חינם עכשיו',

      // Page basics
      title: 'כיוון קריירה'
    };

    console.log('🚀 Sending SIMPLE Hebrew content to API...');

    const response = await fetch(`${API_BASE}/api/career-orientation-page?locale=he`, {
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
    console.log('✅ Simple Hebrew career orientation content inserted successfully!');
    console.log('📊 Result:', result);

    // Verify the data was inserted
    console.log('🔍 Verifying Hebrew content...');
    const verifyResponse = await fetch(`${API_BASE}/api/career-orientation-page?locale=he`);

    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log('✅ Verification successful!');
      console.log('📝 Hero title (Hebrew):', verifyData.data.attributes.heroMainTitle);
      console.log('📝 Process title (Hebrew):', verifyData.data.attributes.processMainTitle);
      console.log('📝 Expert name (Hebrew):', verifyData.data.attributes.expertName);

      return {
        success: true,
        insertedFields: Object.keys(hebrewCareerData).length,
        verificationStatus: 'success',
        heroTitle: verifyData.data.attributes.heroMainTitle
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
    console.error('❌ Error inserting simple Hebrew content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute the insertion
(async () => {
  console.log('🎯 Starting Simple Hebrew Career Orientation Migration...');
  const result = await insertSimpleHebrewContent();

  if (result.success) {
    console.log('🎉 Simple migration completed successfully!');
    console.log(`📊 Inserted ${result.insertedFields} fields for Hebrew career orientation`);
    console.log('✅ The text "מצאו את הקריירה המושלמת שלכם" is now in the database and searchable!');
    if (result.heroTitle) {
      console.log(`📝 Verified Hebrew title: "${result.heroTitle}"`);
    }
  } else {
    console.log('💥 Simple migration failed:', result.error);
    process.exit(1);
  }
})();