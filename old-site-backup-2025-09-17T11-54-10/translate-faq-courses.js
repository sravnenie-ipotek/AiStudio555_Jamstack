// Script to translate FAQ questions and answers in courses.html to Hebrew
const fs = require('fs');

// Read the file
let content = fs.readFileSync('he/courses.html', 'utf8');

// FAQ translations
const faqTranslations = [
  {
    oldQ: 'Q: Can I start learning from scratch with no prior experience?',
    newQ: 'ש: האם אוכל להתחיל ללמוד מאפס ללא ניסיון קודם?',
    oldA: 'Absolutely! Our courses are designed to accommodate learners at all levels. We offer beginner-friendly programs that start with the fundamentals and gradually build up to advanced concepts. Each course includes prerequisite information, so you can choose the right starting point for your journey.',
    newA: 'בהחלט! הקורסים שלנו מתוכננים להתאים ללומדים בכל הרמות. אנו מציעים תוכניות ידידותיות למתחילים שמתחילות מהיסודות ובונות בהדרגה למושגים מתקדמים. כל קורס כולל מידע על דרישות קדם, כך שתוכל לבחור את נקודת ההתחלה הנכונה למסע שלך.'
  },
  {
    oldQ: 'Q: Are there any age restrictions for enrollment?',
    newQ: 'ש: האם יש הגבלות גיל להרשמה?',
    oldA: 'There are no upper age limits for our courses. We welcome learners of all ages who are passionate about technology and AI. For younger students, we recommend being at least 16 years old to fully benefit from our curriculum, though exceptional younger students may be considered on a case-by-case basis.',
    newA: 'אין הגבלות גיל עליונות לקורסים שלנו. אנו מקבלים בברכה לומדים בכל הגילאים שנלהבים מטכנולוגיה ובינה מלאכותית. לסטודנטים צעירים, אנו ממליצים להיות בני 16 לפחות כדי להפיק תועלת מלאה מתוכנית הלימודים שלנו, אם כי סטודנטים צעירים יוצאי דופן עשויים להיחשב על בסיס אישי.'
  },
  {
    oldQ: 'Q: What career paths can I pursue after completing the courses?',
    newQ: 'ש: אילו מסלולי קריירה אוכל לפתח לאחר השלמת הקורסים?',
    oldA: 'Our graduates pursue diverse career paths including AI/ML Engineer, Data Scientist, Full-Stack Developer, Cloud Architect, DevOps Engineer, Product Manager, and more. We provide career guidance and job placement assistance to help you transition into your desired role in the tech industry.',
    newA: 'הבוגרים שלנו פונים למסלולי קריירה מגוונים כולל מהנדס AI/ML, מדען נתונים, מפתח Full-Stack, ארכיטקט ענן, מהנדס DevOps, מנהל מוצר ועוד. אנו מספקים הדרכה קריירה וסיוע בהשמה כדי לעזור לך לעבור לתפקיד הרצוי בתעשיית הטכנולוגיה.'
  },
  {
    oldQ: 'Q: Is the learning format completely online or are there offline components?',
    newQ: 'ש: האם פורמט הלמידה מקוון לחלוטין או שיש רכיבים לא מקוונים?',
    oldA: 'We offer flexible learning options to suit your needs. Most courses are available 100% online with live sessions, recorded lectures, and interactive labs. Some programs also offer optional in-person workshops and networking events in select cities for those who prefer blended learning.',
    newA: 'אנו מציעים אפשרויות למידה גמישות שיתאימו לצרכים שלך. רוב הקורסים זמינים 100% אונליין עם מפגשים חיים, הרצאות מוקלטות ומעבדות אינטראקטיביות. חלק מהתוכניות מציעות גם סדנאות פרונטליות אופציונליות ואירועי נטוורקינג בערים נבחרות למי שמעדיף למידה משולבת.'
  },
  {
    oldQ: 'Q: Do you provide job placement assistance after course completion?',
    newQ: 'ש: האם אתם מספקים סיוע בהשמה לעבודה לאחר סיום הקורס?',
    oldA: 'Yes! We have a dedicated career services team that provides comprehensive job placement support including resume reviews, interview preparation, portfolio development, and direct connections with our network of 500+ hiring partners. Our 95% placement rate speaks to the effectiveness of our career support.',
    newA: 'כן! יש לנו צוות שירותי קריירה ייעודי שמספק תמיכה מקיפה בהשמה לעבודה כולל סקירת קורות חיים, הכנה לראיונות, פיתוח פורטפוליו וחיבורים ישירים עם הרשת שלנו של 500+ שותפי גיוס. שיעור ההשמה של 95% שלנו מעיד על האפקטיביות של התמיכה הקריירה שלנו.'
  },
  {
    oldQ: 'Q: What are the payment options and is financial aid available?',
    newQ: 'ש: מהן אפשרויות התשלום והאם קיים סיוע כספי?',
    oldA: 'We offer multiple payment options including upfront payment, monthly installments, and income share agreements (ISA). Financial aid and scholarships are available for qualified students. We also partner with various lending institutions to provide educational loans at competitive rates.',
    newA: 'אנו מציעים אפשרויות תשלום מרובות כולל תשלום מראש, תשלומים חודשיים והסכמי שיתוף הכנסה (ISA). סיוע כספי ומלגות זמינים לסטודנטים מתאימים. אנו גם משתפים פעולה עם מוסדות הלוואה שונים כדי לספק הלוואות לימודים בתעריפים תחרותיים.'
  }
];

// Replace each FAQ
faqTranslations.forEach(faq => {
  // Replace questions
  content = content.replace(faq.oldQ, faq.newQ);
  // Replace answers
  content = content.replace(faq.oldA, faq.newA);
});

// Write back to file
fs.writeFileSync('he/courses.html', content, 'utf8');

console.log('✅ FAQ translations completed successfully!');