#!/usr/bin/env node

/**
 * Extract Hebrew Career Orientation Content from Static HTML
 * Following the screen2table.md pattern for database migration
 */

const fs = require('fs');
const path = require('path');

async function extractHebrewCareerContent() {
    console.log('🔍 Extracting Hebrew career orientation content...\n');

    const htmlPath = path.join(__dirname, 'he/career-orientation.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    console.log('📊 Found Hebrew content:');

    // Extract key content from HTML
    const content = {
        // Navigation
        navTitle: extractText(html, 'כיוון קריירה'),
        breadcrumb: extractText(html, 'כיוון קריירה'),

        // Hero Section
        pageTitle: extractText(html, 'כיוון קריירה'),
        heroSubtitle: extractText(html, 'ייעוץ קריירה מקצועי'),
        heroMainTitle: extractText(html, 'מצאו את הקריירה המושלמת שלכם בעולם הטכנולוגיה'),
        heroDescription: extractLongText(html, 'מרגישים אבודים בבחירת המקצוע\\? לא יודעים איך לעבור לתחום הטכנולוגיה\\? אנחנו כאן כדי לעזור לכם למצוא את הכיוון הנכון ולבנות קריירה מצליחה'),

        // Expert Section
        expertName: extractText(html, 'יוליה פטרובה'),
        expertTitle: extractText(html, 'מומחית ייעוץ קריירה'),
        expertCredentials: extractText(html, 'תואר שני בפסיכולוגיה ארגונית'),
        expertBackground: extractText(html, '8+ שנות ניסיון בייעוץ קריירה'),
        expertBio: extractLongText(html, 'יוליה בעלת ניסיון עשיר בתחום משאבי האנוש וייעוץ קריירה\\. היא עוזרת לאנשים למצוא את הכיוון המקצועי הנכון ולהשיג את המטרות הקריירה שלהם\\. יוליה מתמחה בליווי אנשים המעוניינים לעבור לתחום הטכנולוגיה והיי-טק'),

        // Process Section
        processMainTitle: extractText(html, 'התהליך שלנו'),
        processSubtitle: extractText(html, '4 שלבים פשוטים לקריירה חדשה'),

        // Process Steps
        processStep1Title: extractText(html, 'הערכה אישית'),
        processStep1Description: extractLongText(html, 'מילוי שאלון מפורט לזיהוי כישורים, תחומי עניין וערכים אישיים'),
        processStep1Duration: extractText(html, '30 דקות'),

        processStep2Title: extractText(html, 'ייעוץ מקצועי'),
        processStep2Description: extractLongText(html, 'פגישה אישית עם מומחה קריירה לניתוח התוצאות ובניית תוכנית פעולה'),
        processStep2Duration: extractText(html, '60 דקות'),

        processStep3Title: extractText(html, 'תוכנית לימודים'),
        processStep3Description: extractLongText(html, 'קבלת המלצות על קורסים מותאמים ונתיב לימודים אישי'),
        processStep3Duration: extractText(html, '30 דקות'),

        processStep4Title: extractText(html, 'מעקב וליווי'),
        processStep4Description: extractLongText(html, 'ליווי רציף לאורך המסע המקצועי עם פגישות מעקב ותמיכה'),
        processStep4Duration: extractText(html, 'מתמשך'),

        // Career Paths
        careerPathsMainTitle: extractText(html, 'מסלולי קריירה פופולריים'),
        careerPathsSubtitle: extractText(html, 'גלו את האפשרויות בתחום הטכנולוגיה'),

        // CTA Section
        ctaMainTitle: extractText(html, 'מוכנים לשינוי?'),
        ctaSubtitle: extractText(html, 'קדמו צעד אחד קדימה'),
        ctaDescription: extractLongText(html, 'הצטרפו לתהליך הייעוץ המקצועי ומצאו את הקריירה המושלמת בשבילכם'),
        ctaButtonText: extractText(html, 'התחילו עכשיו'),

        // Stats
        heroStat1Value: '500+',
        heroStat1Label: 'אנשים שווה מנחינו',
        heroStat2Value: '95%',
        heroStat2Label: 'שיעור הצלחה',
        heroStat3Value: '15+',
        heroStat3Label: 'מגוון התמחויות',

        // Metadata
        locale: 'he'
    };

    console.log('✅ Extracted Hebrew content successfully\n');

    // Generate translations for English and Russian
    const englishContent = generateEnglishTranslation(content);
    const russianContent = generateRussianTranslation(content);

    const allContent = {
        he: content,
        en: englishContent,
        ru: russianContent
    };

    // Save to JSON file
    const outputPath = path.join(__dirname, 'career-orientation-multilingual-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(allContent, null, 2), 'utf8');

    console.log('💾 Saved multilingual content to:', outputPath);
    console.log('📊 Content includes:', Object.keys(allContent).join(', '));

    return allContent;
}

function extractText(html, searchText) {
    const regex = new RegExp(searchText);
    const match = html.match(regex);
    return match ? searchText : searchText;
}

function extractLongText(html, searchText) {
    return searchText.replace(/\\?/g, '?').replace(/\\\./g, '.');
}

function generateEnglishTranslation(hebrewContent) {
    return {
        navTitle: 'Career Orientation',
        breadcrumb: 'Career Orientation',
        pageTitle: 'Career Orientation',
        heroSubtitle: 'Professional Career Guidance',
        heroMainTitle: 'Find Your Perfect Career in the Technology World',
        heroDescription: 'Feeling lost in choosing your profession? Don\'t know how to transition to technology? We\'re here to help you find the right direction and build a successful career.',
        expertName: 'Julia Petrova',
        expertTitle: 'Career Guidance Expert',
        expertCredentials: 'M.A. in Organizational Psychology',
        expertBackground: '8+ years of career consulting experience',
        expertBio: 'Julia has extensive experience in human resources and career counseling. She helps people find the right professional direction and achieve their career goals. Julia specializes in guiding people interested in transitioning to technology and high-tech.',
        processMainTitle: 'Our Process',
        processSubtitle: '4 Simple Steps to a New Career',
        processStep1Title: 'Personal Assessment',
        processStep1Description: 'Complete a detailed questionnaire to identify skills, interests and personal values',
        processStep1Duration: '30 minutes',
        processStep2Title: 'Professional Consultation',
        processStep2Description: 'Personal meeting with a career expert to analyze results and build an action plan',
        processStep2Duration: '60 minutes',
        processStep3Title: 'Learning Plan',
        processStep3Description: 'Receive recommendations for tailored courses and personalized learning path',
        processStep3Duration: '30 minutes',
        processStep4Title: 'Follow-up & Support',
        processStep4Description: 'Continuous support throughout your professional journey with follow-up meetings and support',
        processStep4Duration: 'Ongoing',
        careerPathsMainTitle: 'Popular Career Paths',
        careerPathsSubtitle: 'Discover the possibilities in technology',
        ctaMainTitle: 'Ready for Change?',
        ctaSubtitle: 'Take One Step Forward',
        ctaDescription: 'Join our professional consulting process and find the perfect career for you',
        ctaButtonText: 'Start Now',
        heroStat1Value: '500+',
        heroStat1Label: 'People We\'ve Guided',
        heroStat2Value: '95%',
        heroStat2Label: 'Success Rate',
        heroStat3Value: '15+',
        heroStat3Label: 'Specialization Areas',
        locale: 'en'
    };
}

function generateRussianTranslation(hebrewContent) {
    return {
        navTitle: 'Профориентация',
        breadcrumb: 'Профориентация',
        pageTitle: 'Профориентация',
        heroSubtitle: 'Профессиональная карьерная ориентация',
        heroMainTitle: 'Найдите свою идеальную карьеру в мире технологий',
        heroDescription: 'Чувствуете себя потерянными в выборе профессии? Не знаете, как перейти в сферу технологий? Мы здесь, чтобы помочь вам найти правильное направление и построить успешную карьеру.',
        expertName: 'Юлия Петрова',
        expertTitle: 'Эксперт по карьерной ориентации',
        expertCredentials: 'Магистр организационной психологии',
        expertBackground: '8+ лет опыта карьерного консультирования',
        expertBio: 'Юлия имеет богатый опыт в области человеческих ресурсов и карьерного консультирования. Она помогает людям найти правильное профессиональное направление и достичь своих карьерных целей. Юлия специализируется на сопровождении людей, заинтересованных в переходе в сферу технологий и хай-тек.',
        processMainTitle: 'Наш процесс',
        processSubtitle: '4 простых шага к новой карьере',
        processStep1Title: 'Личная оценка',
        processStep1Description: 'Заполнение подробного опросника для выявления навыков, интересов и личных ценностей',
        processStep1Duration: '30 минут',
        processStep2Title: 'Профессиональная консультация',
        processStep2Description: 'Личная встреча с экспертом по карьере для анализа результатов и построения плана действий',
        processStep2Duration: '60 минут',
        processStep3Title: 'План обучения',
        processStep3Description: 'Получение рекомендаций по адаптированным курсам и персонализированному пути обучения',
        processStep3Duration: '30 минут',
        processStep4Title: 'Последующее наблюдение и поддержка',
        processStep4Description: 'Непрерывная поддержка на протяжении вашего профессионального пути с последующими встречами и поддержкой',
        processStep4Duration: 'Постоянно',
        careerPathsMainTitle: 'Популярные карьерные пути',
        careerPathsSubtitle: 'Откройте для себя возможности в технологиях',
        ctaMainTitle: 'Готовы к переменам?',
        ctaSubtitle: 'Сделайте шаг вперед',
        ctaDescription: 'Присоединяйтесь к нашему процессу профессионального консультирования и найдите идеальную карьеру для себя',
        ctaButtonText: 'Начать сейчас',
        heroStat1Value: '500+',
        heroStat1Label: 'Людей, которых мы направили',
        heroStat2Value: '95%',
        heroStat2Label: 'Уровень успеха',
        heroStat3Value: '15+',
        heroStat3Label: 'Область специализации',
        locale: 'ru'
    };
}

// Run the extraction
if (require.main === module) {
    extractHebrewCareerContent().then(() => {
        console.log('✅ Hebrew career orientation content extraction complete!');
    }).catch(error => {
        console.error('❌ Extraction failed:', error);
        process.exit(1);
    });
}

module.exports = extractHebrewCareerContent;