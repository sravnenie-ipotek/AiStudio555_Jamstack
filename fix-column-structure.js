// Add these fixed endpoints to server.js (replace the broken ones)

// Fixed: Add Russian FAQs (matching production structure)
app.get('/api/sync-add-russian-faqs-fixed', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const russianFaqs = [
      ['Как записаться на курс?', 'Нажмите кнопку "Записаться" на любой курс и заполните форму регистрации.', 'Общее', 5],
      ['Что включено в стоимость курса?', 'В стоимость включены все учебные материалы, практические задания и сертификат.', 'Курсы', 6],
      ['Выдаете ли вы сертификаты?', 'Да, все выпускники получают сертификат о прохождении курса.', 'Курсы', 7],
      ['Какие способы оплаты вы принимаете?', 'Мы принимаем банковские карты, PayPal и банковские переводы.', 'Оплата', 8]
    ];

    let inserted = 0;
    for (const faq of russianFaqs) {
      await queryDatabase(
        'INSERT INTO faqs (question, answer, category, "order") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        faq
      );
      inserted++;
    }

    res.json({ success: true, message: `${inserted} Russian FAQs added` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fixed: Add Hebrew FAQs (matching production structure)
app.get('/api/sync-add-hebrew-faqs-fixed', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const hebrewFaqs = [
      ['איך נרשמים לקורס?', 'לחצו על כפתור "הרשמה" בכל קורס ומלאו את טופס ההרשמה.', 'כללי', 9],
      ['מה כלול בעלות הקורס?', 'בעלות כלולים כל חומרי הלימוד, משימות מעשיות ותעודה.', 'קורסים', 10],
      ['האם אתם נותנים תעודות?', 'כן, כל הבוגרים מקבלים תעודת סיום קורס.', 'קורסים', 11],
      ['אילו אמצעי תשלום אתם מקבלים?', 'אנחנו מקבלים כרטיסי אשראי, PayPal והעברות בנקאיות.', 'תשלום', 12]
    ];

    let inserted = 0;
    for (const faq of hebrewFaqs) {
      await queryDatabase(
        'INSERT INTO faqs (question, answer, category, "order") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        faq
      );
      inserted++;
    }

    res.json({ success: true, message: `${inserted} Hebrew FAQs added` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fixed: Add Russian career resources (matching production structure)
app.get('/api/sync-add-russian-resources-fixed', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const russianResources = [
      ['Шаблон резюме для ИИ', 'Профессиональный шаблон резюме для специалистов по ИИ', 'Шаблон', '/downloads/resume-template-ru.pdf'],
      ['Руководство по подготовке к интервью', 'Полное руководство по подготовке к техническим интервью', 'Руководство', '/downloads/interview-guide-ru.pdf'],
      ['Справочник по переговорам о зарплате', 'Стратегии эффективных переговоров о зарплате в сфере ИИ', 'Справочник', '/downloads/salary-guide-ru.pdf'],
      ['Идеи портфолио проектов', '50+ идей проектов для портфолио в области ИИ', 'Список', '/downloads/portfolio-projects-ru.pdf']
    ];

    let inserted = 0;
    for (const resource of russianResources) {
      await queryDatabase(
        'INSERT INTO career_resources (title, description, type, "downloadUrl") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        resource
      );
      inserted++;
    }

    res.json({ success: true, message: `${inserted} Russian career resources added` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fixed: Add Hebrew career resources (matching production structure)
app.get('/api/sync-add-hebrew-resources-fixed', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const hebrewResources = [
      ['תבנית קורות חיים לבינה מלאכותית', 'תבנית מקצועית לקורות חיים למומחי בינה מלאכותית', 'תבנית', '/downloads/resume-template-he.pdf'],
      ['מדריך הכנה לראיון עבודה', 'מדריך מלא להכנה לראיונות עבודה טכניים', 'מדריך', '/downloads/interview-guide-he.pdf'],
      ['מדריך משא ומתן על שכר', 'אסטרטגיות למשא ומתן יעיל על שכר בתחום הבינה המלאכותית', 'מדריך', '/downloads/salary-guide-he.pdf'],
      ['רעיונות לפרויקטים בפורטפוליו', '50+ רעיונות לפרויקטים בפורטפוליו בתחום הבינה המלאכותית', 'רשימה', '/downloads/portfolio-projects-he.pdf']
    ];

    let inserted = 0;
    for (const resource of hebrewResources) {
      await queryDatabase(
        'INSERT INTO career_resources (title, description, type, "downloadUrl") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        resource
      );
      inserted++;
    }

    res.json({ success: true, message: `${inserted} Hebrew career resources added` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});