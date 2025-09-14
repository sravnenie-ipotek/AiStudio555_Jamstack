/**
 * Hebrew Translations Fix
 * Prevents dynamic API content from overwriting Hebrew translations
 */

// Hebrew translations that should be preserved
const hebrewTranslations = {
  // Navigation
  navHome: 'בית',
  navCourses: 'קורסים',
  navTeachers: 'מורים',
  navCareerCenter: 'שירותי קריירה',
  navPricing: 'מחירים',
  navBlog: 'בלוג',
  navAbout: 'אודות',
  navContact: 'צור קשר',

  // Buttons
  btnSignUpToday: 'הרשמו היום',
  btnSignIn: 'התחברות',
  btnLearnMore: 'למד עוד',
  btnViewAllCourses: 'צפו בכל הקורסים',
  btnGetStarted: 'התחל עכשיו',
  btnStartLearning: 'התחל ללמוד',
  btnEnrollNow: 'הרשם עכשיו',
  btnCourseDetails: 'פרטי הקורס',
  btnGetInTouch: 'צרו קשר',
  btnReadMore: 'קרא עוד',

  // Titles and headings
  heroTitle: 'שחררו את הפוטנציאל שלכם עם קורסים מוכחים',
  heroSubtitle: 'למידה בהובלת מומחים',
  featuredCoursesTitle: 'קורסי IT הפופולריים ביותר לקידום הקריירה שלכם',
  featuredCoursesSubtitle: 'הקורסים הפופולריים ביותר בתחום ה-IT',
  whyChooseUsTitle: '85% פרקטיקה, 15% תיאוריה - כישורים אמיתיים שחשובים',
  whyChooseUsSubtitle: 'התמקדות בפרקטיקה',
  onlineLearningTitle: 'למדו מכל מקום, בכל זמן עם הפלטפורמה שלנו',
  onlineLearningSubtitle: 'למידה מקוונת',
  expertMentorTitle: 'מנטורים מומחים בטכנולוגיה',
  faqTitle: 'שאלות נפוצות',
  faqSubtitle: 'שאלות ותשובות',
  alumniReviewsTitle: 'ביקורות בוגרים',
  studentSuccessTitle: 'סיפורי הצלחה של סטודנטים',
  careerSuccessTitle: 'הבוגרים שלנו עובדים ב',
  careerSuccessSubtitle: 'הצלחה בקריירה',
  coreSkillsTitle: 'כישורי ליבה',

  // Form labels
  formName: 'שם',
  formEmail: 'אימייל',
  formPhone: 'טלפון',
  formMessage: 'הודעה',
  formSubmit: 'שלח',

  // Messages
  msgFormSuccess: 'תודה על הפנייה שלך',
  msgLoading: 'טוען...',
  msgError: 'שגיאה',
  msgSuccess: 'הצלחה',

  // Placeholders
  placeholderSearch: 'חיפוש...',
  placeholderEmail: 'הכנס כתובת אימייל',
  placeholderName: 'הכנס שם מלא'
};

// Override the API translation loading for Hebrew
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a Hebrew page
  const isHebrewPage = window.location.pathname.includes('/he/') ||
                      document.documentElement.lang === 'he';

  if (!isHebrewPage) {
    return; // Only apply fix on Hebrew pages
  }

  console.log('🔷 Hebrew translations fix activated');

  // Intercept and override the loadUITranslations function
  if (window.CustomAPIIntegration) {
    const originalLoadUITranslations = CustomAPIIntegration.prototype.loadUITranslations;

    CustomAPIIntegration.prototype.loadUITranslations = async function() {
      console.log('🔷 Intercepting API call for Hebrew translations');

      // If locale is Hebrew, return our static translations
      if (this.currentLanguage === 'he') {
        console.log('✅ Using static Hebrew translations instead of API');
        return hebrewTranslations;
      }

      // Otherwise, use the original function
      return originalLoadUITranslations.call(this);
    };
  }

  // Also override for UITranslator if it exists
  if (window.UITranslator) {
    const originalLoadTranslations = UITranslator.prototype.loadTranslations;

    UITranslator.prototype.loadTranslations = async function() {
      console.log('🔷 Intercepting UITranslator for Hebrew');

      if (this.currentLocale === 'he') {
        console.log('✅ Using static Hebrew translations for UITranslator');
        return hebrewTranslations;
      }

      return originalLoadTranslations.call(this);
    };
  }

  // Fallback: If scripts are already loaded and translations applied,
  // reapply Hebrew translations after a delay
  setTimeout(() => {
    if (isHebrewPage) {
      console.log('🔷 Reapplying Hebrew translations as fallback');
      applyHebrewTranslations();
    }
  }, 1500);
});

// Function to directly apply Hebrew translations to the DOM
function applyHebrewTranslations() {
  // Navigation items
  document.querySelectorAll('a[href*="home"]').forEach(el => {
    if (el.textContent.trim() === 'Home') el.textContent = 'בית';
  });

  document.querySelectorAll('a[href*="courses"]').forEach(el => {
    if (el.textContent.trim() === 'Courses') el.textContent = 'קורסים';
  });

  document.querySelectorAll('a[href*="teachers"]').forEach(el => {
    if (el.textContent.trim() === 'Teachers') el.textContent = 'מורים';
  });

  document.querySelectorAll('a[href*="pricing"]').forEach(el => {
    if (el.textContent.trim() === 'Pricing') el.textContent = 'מחירים';
  });

  // Buttons
  document.querySelectorAll('.primary-button, .button, .btn').forEach(button => {
    const text = button.textContent.trim();
    switch(text) {
      case 'Sign Up Today':
        button.textContent = 'הרשמו היום';
        break;
      case 'Learn More':
        button.textContent = 'למד עוד';
        break;
      case 'View All Courses':
      case 'Uncover All Courses':
        button.textContent = 'צפו בכל הקורסים';
        break;
      case 'Course Details':
        button.textContent = 'פרטי הקורס';
        break;
      case 'get in touch':
        button.textContent = 'צרו קשר';
        break;
      case 'Read more':
        button.textContent = 'קרא עוד';
        break;
    }
  });

  // Headings
  document.querySelectorAll('h1, h2, h3, .section-title, .section-subtitle').forEach(heading => {
    const text = heading.textContent.trim();
    switch(text) {
      case 'Expert-Led Learning':
        heading.textContent = 'למידה בהובלת מומחים';
        break;
      case 'Unlock Potential With Proven Courses.':
        heading.textContent = 'שחררו את הפוטנציאל שלכם עם קורסים מוכחים.';
        break;
      case 'Most Popular IT Courses':
        heading.textContent = 'הקורסים הפופולריים ביותר בתחום ה-IT';
        break;
      case 'Most Popular IT Courses To Advance Your Career.':
        heading.textContent = 'קורסי IT הפופולריים ביותר לקידום הקריירה שלכם.';
        break;
      case 'Focus on Practice':
        heading.textContent = 'התמקדות בפרקטיקה';
        break;
      case '85% Practice, 15% Theory - Real Skills That Matter':
        heading.textContent = '85% פרקטיקה, 15% תיאוריה - כישורים אמיתיים שחשובים';
        break;
      case 'Core Skills':
        heading.textContent = 'כישורי ליבה';
        break;
      case 'Online Learning':
        heading.textContent = 'למידה מקוונת';
        break;
      case 'Learn From Anywhere, Anytime With Our Platform.':
        heading.textContent = 'למדו מכל מקום, בכל זמן עם הפלטפורמה שלנו.';
        break;
      case 'Expert Mentor In Technology':
        heading.textContent = 'מנטורים מומחים בטכנולוגיה';
        break;
      case 'FAQ & Answer':
        heading.textContent = 'שאלות ותשובות';
        break;
      case 'Frequently Asked Questions':
        heading.textContent = 'שאלות נפוצות';
        break;
      case 'Student Success Stories':
        heading.textContent = 'סיפורי הצלחה של סטודנטים';
        break;
      case 'Alumni Reviews':
        heading.textContent = 'ביקורות בוגרים';
        break;
      case 'Career Success':
        heading.textContent = 'הצלחה בקריירה';
        break;
      case 'Our Graduates Work At':
        heading.textContent = 'הבוגרים שלנו עובדים ב';
        break;
    }
  });

  console.log('✅ Hebrew translations reapplied');
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hebrewTranslations, applyHebrewTranslations };
}