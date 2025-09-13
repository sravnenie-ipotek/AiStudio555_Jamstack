#!/usr/bin/env node

/**
 * Apply Hebrew translations using the existing force-russian-ui endpoint
 * (which actually works for any locale with the right modifications)
 */

async function applyHebrewTranslations() {
  const API_URL = 'https://aistudio555jamstack-production.up.railway.app/api/force-russian-ui';
  
  console.log('🔧 Applying Hebrew Translations');
  console.log('=' .repeat(60));
  
  // First, let's just force the Russian endpoint to update Hebrew by modifying the request
  // We'll use a different approach - update the database directly via the force endpoint
  
  try {
    // Check deployment status first
    console.log('Checking API status...');
    const testResponse = await fetch('https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=he');
    const testData = await testResponse.json();
    
    if (testData.data) {
      console.log('✅ API is responding');
      
      // Check current Hebrew status
      const attrs = testData.data.attributes;
      console.log('\nCurrent Hebrew fields:');
      console.log(`  navHome: ${attrs.navHome}`);
      console.log(`  heroExpertLed: ${attrs.heroExpertLed || 'NOT FOUND'}`);
      console.log(`  btnSignUpToday: ${attrs.btnSignUpToday}`);
      
      // Wait for new endpoint to be deployed
      console.log('\nWaiting for new endpoint deployment...');
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      // Try the new endpoint
      const response = await fetch('https://aistudio555jamstack-production.up.railway.app/api/force-all-translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-migration-token': 'ultrathink-2024'
        },
        body: JSON.stringify({
          locale: 'he',
          translations: {
            nav_home: "בית",
            nav_courses: "קורסים",
            nav_teachers: "מורים",
            nav_blog: "בלוג",
            nav_career_center: "מרכז קריירה",
            nav_about: "אודות",
            nav_contact: "צור קשר",
            nav_pricing: "מחירים",
            hero_expert_led: "למידה בהובלת מומחים",
            hero_title: "שלטו ב-AI וטכנולוגיה",
            hero_subtitle: "שנו את הקריירה שלכם עם קורסים מומחים",
            btn_sign_up_today: "הירשמו היום",
            btn_learn_more: "למידע נוסף",
            btn_get_started: "התחילו",
            btn_view_all_courses: "צפו בכל הקורסים",
            btn_enroll_now: "הירשמו עכשיו"
          }
        })
      });
      
      const text = await response.text();
      
      try {
        const result = JSON.parse(text);
        if (result.success) {
          console.log('✅ Hebrew translations applied successfully!');
          console.log(`   Fields updated: ${result.stats?.fieldsUpdated}`);
        } else {
          console.log('❌ Failed:', result.error);
        }
      } catch (e) {
        console.log('⚠️  Endpoint not ready yet. Response:', text.substring(0, 100));
        console.log('The new endpoint will be available after deployment completes.');
      }
      
      // Verify the changes
      console.log('\nVerifying Hebrew translations...');
      const verifyResponse = await fetch('https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=he');
      const verifyData = await verifyResponse.json();
      
      if (verifyData.data) {
        const newAttrs = verifyData.data.attributes;
        console.log('\nUpdated Hebrew fields:');
        console.log(`  navHome: ${newAttrs.navHome} ${newAttrs.navHome === 'בית' ? '✅' : '❌'}`);
        console.log(`  heroExpertLed: ${newAttrs.heroExpertLed || 'NOT FOUND'} ${newAttrs.heroExpertLed === 'למידה בהובלת מומחים' ? '✅' : '⚠️'}`);
        console.log(`  btnSignUpToday: ${newAttrs.btnSignUpToday} ${newAttrs.btnSignUpToday === 'הירשמו היום' ? '✅' : '❌'}`);
      }
      
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

applyHebrewTranslations().catch(console.error);