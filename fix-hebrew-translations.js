#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Hebrew translations map
const translations = {
  // Navigation
  'Home': 'בית',
  'Courses': 'קורסים',
  'Teachers': 'מורים',
  'Career Services': 'שירותי קריירה',
  'Pricing': 'מחירים',
  'Sign Up Today': 'הרשמו היום',
  'Sign In': 'התחברות',

  // Page titles
  'Home - Zohacous - Webflow Ecommerce Website Template': 'בית - AI Studio פלטפורמת למידה',

  // Hero/Banner
  'Expert-Led Learning': 'למידה בהובלת מומחים',
  'Unlock Potential With Proven Courses.': 'שחררו את הפוטנציאל שלכם עם קורסים מוכחים.',

  // Section titles
  'Most Popular IT Courses': 'הקורסים הפופולריים ביותר בתחום ה-IT',
  'Most Popular IT Courses To Advance Your Career.': 'קורסי IT הפופולריים ביותר לקידום הקריירה שלכם.',
  'Focus on Practice': 'התמקדות בפרקטיקה',
  '85% Practice, 15% Theory - Real Skills That Matter': '85% פרקטיקה, 15% תיאוריה - כישורים אמיתיים שחשובים',
  'Core Skills': 'כישורי ליבה',
  'Online Learning': 'למידה מקוונת',
  'Learn From Anywhere, Anytime With Our Platform.': 'למדו מכל מקום, בכל זמן עם הפלטפורמה שלנו.',
  'Expert Mentor In Technology': 'מנטורים מומחים בטכנולוגיה',
  'FAQ & Answer': 'שאלות ותשובות',
  'Frequently Asked Questions': 'שאלות נפוצות',
  'Student Success Stories': 'סיפורי הצלחה של סטודנטים',
  'Alumni Reviews': 'ביקורות בוגרים',
  'Career Success': 'הצלחה בקריירה',
  'Our Graduates Work At': 'הבוגרים שלנו עובדים ב',

  // Buttons
  'Course Details': 'פרטי הקורס',
  'Uncover All Courses': 'צפו בכל הקורסים',
  'View All Courses': 'צפו בכל הקורסים',
  'get in touch': 'צרו קשר',
  'Read more': 'קרא עוד',
  'Learn More': 'למד עוד',
  'Get Started': 'התחל עכשיו',
  'Start Learning': 'התחל ללמוד',
  'Enroll Now': 'הרשם עכשיו',

  // Course categories
  'AI & Machine Learning': 'AI ולמידת מכונה',
  'Web Development': 'פיתוח אתרים',
  'Data Science': 'מדע הנתונים',
  'Cybersecurity': 'אבטחת סייבר',
  'Cloud Computing': 'מחשוב ענן',
  'Mobile Development': 'פיתוח מובייל',

  // Footer
  'Quick Links': 'קישורים מהירים',
  'Contact Us': 'צור קשר',
  'About Us': 'אודותינו',
  'Privacy Policy': 'מדיניות פרטיות',
  'Terms of Service': 'תנאי שירות',
  'Follow Us': 'עקבו אחרינו',

  // FAQ Questions (examples)
  'What courses do you offer?': 'אילו קורסים אתם מציעים?',
  'How long are the courses?': 'כמה זמן נמשכים הקורסים?',
  'Do you provide certificates?': 'האם אתם מספקים תעודות?',
  'What is your refund policy?': 'מה מדיניות ההחזרים שלכם?',
  'Can I learn at my own pace?': 'האם אני יכול ללמוד בקצב שלי?',

  // Messages
  'Loading...': 'טוען...',
  'Thank you for your submission': 'תודה על הפנייה שלך',
  'Error': 'שגיאה',
  'Success': 'הצלחה',

  // Skill levels
  'Beginner': 'מתחיל',
  'Intermediate': 'בינוני',
  'Advanced': 'מתקדם',
  'Expert': 'מומחה'
};

function translateFile(filePath) {
  console.log(`Translating ${filePath}...`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Apply all translations
  for (const [english, hebrew] of Object.entries(translations)) {
    // Create regex to match the English text in various contexts
    const patterns = [
      // Text content
      new RegExp(`>\\s*${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`, 'g'),
      // Title attributes
      new RegExp(`title="${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
      // Value attributes
      new RegExp(`value="${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
      // Placeholder attributes
      new RegExp(`placeholder="${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g')
    ];

    patterns.forEach((pattern, index) => {
      if (index === 0) {
        // For text content
        content = content.replace(pattern, `>${hebrew}<`);
      } else if (index === 1) {
        // For title attributes
        content = content.replace(pattern, `title="${hebrew}"`);
      } else if (index === 2) {
        // For value attributes
        content = content.replace(pattern, `value="${hebrew}"`);
      } else if (index === 3) {
        // For placeholder attributes
        content = content.replace(pattern, `placeholder="${hebrew}"`);
      }
    });
  }

  // Ensure HTML attributes for Hebrew
  content = content.replace(/<html([^>]*)lang="en"/, '<html$1lang="he" dir="rtl"');

  // Save the translated file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Translated ${filePath}`);
}

// Main function
function main() {
  const hebrewFiles = [
    '/Users/michaelmishayev/Desktop/newCode/he/home.html',
    '/Users/michaelmishayev/Desktop/newCode/he/index.html',
    '/Users/michaelmishayev/Desktop/newCode/he/courses.html',
    '/Users/michaelmishayev/Desktop/newCode/he/teachers.html',
    '/Users/michaelmishayev/Desktop/newCode/he/pricing.html',
    '/Users/michaelmishayev/Desktop/newCode/he/career-center.html',
    '/Users/michaelmishayev/Desktop/newCode/he/career-orientation.html',
    '/Users/michaelmishayev/Desktop/newCode/he/blog.html'
  ];

  hebrewFiles.forEach(file => {
    if (fs.existsSync(file)) {
      translateFile(file);
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  });

  console.log('\n✅ All Hebrew translations completed!');
}

// Run the script
main();