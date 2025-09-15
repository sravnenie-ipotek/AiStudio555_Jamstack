/**
 * Server.js FAQ JSON Enhancement Patch
 * Add this code to server.js to support JSON FAQ items
 */

// Helper function to process FAQ data
function processFAQData(homeData, locale) {
    let faqItems = [];

    // Check if we have JSON faq_items
    if (homeData.faq_items) {
        try {
            // Parse JSON if it's a string
            if (typeof homeData.faq_items === 'string') {
                faqItems = JSON.parse(homeData.faq_items);
            } else {
                faqItems = homeData.faq_items;
            }
        } catch (e) {
            console.error('Error parsing faq_items JSON:', e);
            faqItems = [];
        }
    }

    // If no JSON items, try to construct from legacy fields
    if (faqItems.length === 0) {
        for (let i = 1; i <= 6; i++) {
            const title = homeData[`faq_${i}_title`];
            const answer = homeData[`faq_${i}_answer`];
            if (title || answer) {
                faqItems.push({
                    title: title || `Question ${i}`,
                    answer: answer || ''
                });
            }
        }
    }

    // If still no items, use defaults based on locale
    if (faqItems.length === 0) {
        faqItems = getDefaultFAQs(locale);
    }

    return faqItems;
}

// Default FAQs by locale
function getDefaultFAQs(locale) {
    const defaults = {
        en: [
            { title: 'What courses do you offer?', answer: 'We offer comprehensive courses in AI, Machine Learning, Data Science, and Web Development.' },
            { title: 'How long are the courses?', answer: 'Our courses typically range from 8 to 12 weeks, with flexible scheduling options.' },
            { title: 'Do you provide certificates?', answer: 'Yes, all students receive a verified certificate upon successful completion.' },
            { title: 'Is career support included?', answer: 'Absolutely! We provide career guidance, resume reviews, and job placement assistance.' },
            { title: 'What are the prerequisites?', answer: 'Basic computer skills are required. Programming experience is helpful but not mandatory.' },
            { title: 'Can I learn at my own pace?', answer: 'Yes, we offer both self-paced and instructor-led options to suit your schedule.' }
        ],
        he: [
            { title: 'קורסים מוצעים', answer: 'אנו מציעים קורסים מקיפים ב-AI, למידת מכונה, מדע הנתונים ופיתוח אתרים.' },
            { title: 'משך הקורסים', answer: 'הקורסים שלנו נמשכים בדרך כלל בין 8 ל-12 שבועות, עם אפשרויות תזמון גמישות.' },
            { title: 'תעודות והסמכה', answer: 'כן, כל הסטודנטים מקבלים תעודה מאומתת עם השלמה מוצלחת.' },
            { title: 'תמיכה בקריירה', answer: 'בהחלט! אנו מספקים הדרכה קריירה, ביקורות קורות חיים וסיוע בהשמה.' },
            { title: 'דרישות קדם', answer: 'נדרשות מיומנויות מחשב בסיסיות. ניסיון בתכנות מועיל אך לא חובה.' },
            { title: 'למידה בקצב אישי', answer: 'כן, אנו מציעים אפשרויות ללמידה עצמית וגם עם מדריך כדי להתאים ללוח הזמנים שלך.' }
        ],
        ru: [
            { title: 'Какие курсы вы предлагаете?', answer: 'Мы предлагаем комплексные курсы по ИИ, машинному обучению, науке о данных и веб-разработке.' },
            { title: 'Какова продолжительность курсов?', answer: 'Наши курсы обычно длятся от 8 до 12 недель с гибким расписанием.' },
            { title: 'Выдаете ли вы сертификаты?', answer: 'Да, все студенты получают подтвержденный сертификат после успешного завершения.' },
            { title: 'Включена ли поддержка карьеры?', answer: 'Конечно! Мы предоставляем карьерное руководство, проверку резюме и помощь в трудоустройстве.' },
            { title: 'Каковы предварительные требования?', answer: 'Требуются базовые навыки работы с компьютером. Опыт программирования полезен, но не обязателен.' },
            { title: 'Могу ли я учиться в своем темпе?', answer: 'Да, мы предлагаем варианты самостоятельного обучения и с преподавателем.' }
        ]
    };
    return defaults[locale] || defaults.en;
}

// UPDATE YOUR HOME PAGE API ENDPOINT:
// In the /api/home-page endpoint, after fetching homeData, add:

/*
// Process FAQ data (JSON or legacy format)
const faqItems = processFAQData(homeData, locale);

// In the response, add both formats for compatibility:
res.json({
  data: {
    id: homeData.id,
    attributes: {
      // ... other fields ...

      // New JSON format
      faqItems: faqItems,

      // Maintain backward compatibility with individual fields
      faq1Title: faqItems[0]?.title || homeData.faq_1_title,
      faq1Answer: faqItems[0]?.answer || homeData.faq_1_answer,
      faq2Title: faqItems[1]?.title || homeData.faq_2_title,
      faq2Answer: faqItems[1]?.answer || homeData.faq_2_answer,
      faq3Title: faqItems[2]?.title || homeData.faq_3_title,
      faq3Answer: faqItems[2]?.answer || homeData.faq_3_answer,
      faq4Title: faqItems[3]?.title || homeData.faq_4_title,
      faq4Answer: faqItems[3]?.answer || homeData.faq_4_answer,
      faq5Title: faqItems[4]?.title || homeData.faq_5_title,
      faq5Answer: faqItems[4]?.answer || homeData.faq_5_answer,
      faq6Title: faqItems[5]?.title || homeData.faq_6_title,
      faq6Answer: faqItems[5]?.answer || homeData.faq_6_answer,

      // ... rest of fields ...
    }
  }
});
*/

// UPDATE YOUR HOME PAGE POST ENDPOINT:
// In the POST /api/home-page endpoint, handle both formats:

/*
app.post('/api/home-page', async (req, res) => {
  try {
    const homeData = req.body;
    const locale = homeData.locale || 'en';

    // Process FAQ items if provided
    let faqItemsJson = null;
    if (homeData.faqItems || homeData.faq_items) {
      const items = homeData.faqItems || homeData.faq_items;
      faqItemsJson = typeof items === 'string' ? items : JSON.stringify(items);
    }

    // Build update data
    const updateData = {
      ...homeData,
      faq_items: faqItemsJson,
      // Also update individual fields for backward compatibility
      faq_1_title: homeData.faq1Title || homeData.faq_1_title,
      faq_1_answer: homeData.faq1Answer || homeData.faq_1_answer,
      faq_2_title: homeData.faq2Title || homeData.faq_2_title,
      faq_2_answer: homeData.faq2Answer || homeData.faq_2_answer,
      faq_3_title: homeData.faq3Title || homeData.faq_3_title,
      faq_3_answer: homeData.faq3Answer || homeData.faq_3_answer,
      faq_4_title: homeData.faq4Title || homeData.faq_4_title,
      faq_4_answer: homeData.faq4Answer || homeData.faq_4_answer,
      faq_5_title: homeData.faq5Title || homeData.faq_5_title,
      faq_5_answer: homeData.faq5Answer || homeData.faq_5_answer,
      faq_6_title: homeData.faq6Title || homeData.faq_6_title,
      faq_6_answer: homeData.faq6Answer || homeData.faq_6_answer,
    };

    // Update database...
    // ... rest of your update logic ...
  } catch (error) {
    // ... error handling ...
  }
});
*/

module.exports = {
    processFAQData,
    getDefaultFAQs
};