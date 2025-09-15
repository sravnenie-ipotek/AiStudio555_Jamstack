// Add these endpoints to server.js for batch migrations

// Step 1: Create tables only
app.get('/api/sync-create-tables', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // Create FAQs table
    await queryDatabase(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT,
        answer TEXT,
        category VARCHAR(255),
        order_index INTEGER,
        visible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create consultations table
    await queryDatabase(`
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        duration VARCHAR(100),
        price DECIMAL(10,2),
        features JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create career_resources table
    await queryDatabase(`
      CREATE TABLE IF NOT EXISTS career_resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        type VARCHAR(100),
        url VARCHAR(500),
        icon VARCHAR(100),
        order_index INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create company_logos table
    await queryDatabase(`
      CREATE TABLE IF NOT EXISTS company_logos (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255),
        logo_url VARCHAR(500),
        website_url VARCHAR(500),
        order_index INTEGER,
        visible BOOLEAN DEFAULT true,
        locale VARCHAR(10) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({ success: true, message: 'Tables created successfully' });
  } catch (error) {
    console.error('Table creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Insert FAQs in batches
app.get('/api/sync-faqs-batch', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const faqsData = [
      { question: 'What AI courses do you offer?', answer: 'We offer comprehensive courses in Machine Learning, Deep Learning, NLP, Computer Vision, and AI Ethics.', category: 'courses', order_index: 1 },
      { question: 'How long are the courses?', answer: 'Course duration varies from 8-week intensive bootcamps to 6-month comprehensive programs.', category: 'courses', order_index: 2 },
      { question: 'Do I need programming experience?', answer: 'Basic programming knowledge is helpful but not required. We offer beginner-friendly tracks.', category: 'requirements', order_index: 3 },
      { question: 'What career support do you provide?', answer: 'We offer resume reviews, interview prep, job placement assistance, and networking opportunities.', category: 'career', order_index: 4 }
    ];

    let inserted = 0;
    for (const faq of faqsData) {
      try {
        await queryDatabase(
          `INSERT INTO faqs (question, answer, category, order_index, visible)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [faq.question, faq.answer, faq.category, faq.order_index, true]
        );
        inserted++;
      } catch (err) {
        console.log('FAQ insert error:', err.message);
      }
    }

    res.json({ success: true, message: `${inserted} FAQs inserted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 3: Insert more FAQs
app.get('/api/sync-faqs-batch2', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const faqsData = [
      { question: 'Are courses available online?', answer: 'Yes, all our courses are available online with live sessions and recorded content.', category: 'format', order_index: 5 },
      { question: 'What is the cost of courses?', answer: 'Prices range from $999 for short courses to $4999 for comprehensive programs. Payment plans available.', category: 'pricing', order_index: 6 },
      { question: 'Do you offer certificates?', answer: 'Yes, all graduates receive industry-recognized certificates upon successful completion.', category: 'certification', order_index: 7 },
      { question: 'Can I get a refund?', answer: 'We offer a 14-day money-back guarantee if you are not satisfied with the course.', category: 'policies', order_index: 8 }
    ];

    let inserted = 0;
    for (const faq of faqsData) {
      try {
        await queryDatabase(
          `INSERT INTO faqs (question, answer, category, order_index, visible)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [faq.question, faq.answer, faq.category, faq.order_index, true]
        );
        inserted++;
      } catch (err) {
        console.log('FAQ insert error:', err.message);
      }
    }

    res.json({ success: true, message: `${inserted} FAQs inserted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 4: Insert consultations
app.get('/api/sync-consultations-batch', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const consultationsData = [
      {
        title: 'Career Strategy Session',
        description: 'One-on-one career planning and guidance',
        duration: '60 minutes',
        price: 150,
        features: { personalPlan: true, followUp: true, resources: true }
      },
      {
        title: 'Technical Interview Prep',
        description: 'Mock interviews and coding practice',
        duration: '90 minutes',
        price: 200,
        features: { mockInterview: true, feedback: true, tips: true }
      },
      {
        title: 'Portfolio Review',
        description: 'Professional review of your AI/ML projects',
        duration: '45 minutes',
        price: 100,
        features: { detailed_feedback: true, improvement_tips: true }
      }
    ];

    let inserted = 0;
    for (const consultation of consultationsData) {
      try {
        await queryDatabase(
          `INSERT INTO consultations (title, description, duration, price, features)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
          [consultation.title, consultation.description, consultation.duration, consultation.price, JSON.stringify(consultation.features)]
        );
        inserted++;
      } catch (err) {
        console.log('Consultation insert error:', err.message);
      }
    }

    res.json({ success: true, message: `${inserted} consultations inserted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 5: Insert career resources (first batch)
app.get('/api/sync-resources-batch1', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const resourcesData = [
      { title: 'AI Career Roadmap', description: 'Complete guide to AI career paths', type: 'guide', url: '/resources/ai-roadmap', icon: 'map', order_index: 1 },
      { title: 'Resume Templates', description: 'AI-optimized resume templates', type: 'template', url: '/resources/resume', icon: 'document', order_index: 2 },
      { title: 'Interview Guide', description: 'Common AI interview questions', type: 'guide', url: '/resources/interview', icon: 'chat', order_index: 3 }
    ];

    let inserted = 0;
    for (const resource of resourcesData) {
      try {
        await queryDatabase(
          `INSERT INTO career_resources (title, description, type, url, icon, order_index)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [resource.title, resource.description, resource.type, resource.url, resource.icon, resource.order_index]
        );
        inserted++;
      } catch (err) {
        console.log('Resource insert error:', err.message);
      }
    }

    res.json({ success: true, message: `${inserted} resources inserted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 6: Insert career resources (second batch)
app.get('/api/sync-resources-batch2', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const resourcesData = [
      { title: 'Salary Guide 2024', description: 'AI industry salary insights', type: 'report', url: '/resources/salary', icon: 'chart', order_index: 4 },
      { title: 'Project Ideas', description: '50+ AI project ideas for portfolio', type: 'list', url: '/resources/projects', icon: 'bulb', order_index: 5 },
      { title: 'Networking Tips', description: 'Build your AI professional network', type: 'guide', url: '/resources/networking', icon: 'users', order_index: 6 }
    ];

    let inserted = 0;
    for (const resource of resourcesData) {
      try {
        await queryDatabase(
          `INSERT INTO career_resources (title, description, type, url, icon, order_index)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [resource.title, resource.description, resource.type, resource.url, resource.icon, resource.order_index]
        );
        inserted++;
      } catch (err) {
        console.log('Resource insert error:', err.message);
      }
    }

    res.json({ success: true, message: `${inserted} resources inserted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Step 7: Insert company logo
app.get('/api/sync-logo-batch', async (req, res) => {
  const secretKey = req.query.key;
  if (secretKey !== 'sync-2025-secure-key') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    await queryDatabase(
      `INSERT INTO company_logos (company_name, logo_url, website_url, order_index, visible, locale)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      ['AI Studio', '/images/logoNew.png', 'https://www.aistudio555.com', 1, true, 'en']
    );

    res.json({ success: true, message: 'Company logo inserted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});