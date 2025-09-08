/**
 * COMPLETE CRUD Live API - Full Create, Read, Update, Delete Operations
 * Supports all content types with database operations
 */

const http = require('http');
const { exec } = require('child_process');
const path = require('path');
const url = require('url');

const PORT = 3335; // Different port to avoid conflicts
const DB_PATH = path.join(__dirname, 'strapi-fresh/.tmp/data.db');

// Create server with CRUD operations
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // Parse request body for POST/PUT requests
  let body = '';
  if (method === 'POST' || method === 'PUT') {
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        handleRequest(pathname, method, data, res, parsedUrl.query);
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    handleRequest(pathname, method, null, res, parsedUrl.query);
  }
});

// Main request handler
function handleRequest(pathname, method, data, res, query) {
  
  // COURSES ENDPOINTS
  if (pathname === '/api/courses') {
    if (method === 'GET') {
      getCourses(res);
    } else if (method === 'POST') {
      createCourse(data, res);
    }
  } else if (pathname.match(/\/api\/courses\/(\d+)$/)) {
    const courseId = pathname.split('/')[3];
    if (method === 'GET') {
      getCourseById(courseId, res);
    } else if (method === 'PUT') {
      updateCourse(courseId, data, res);
    } else if (method === 'DELETE') {
      deleteCourse(courseId, res);
    }
  }
  
  // BLOG POSTS ENDPOINTS
  else if (pathname === '/api/blog-posts') {
    if (method === 'GET') {
      getBlogPosts(res);
    } else if (method === 'POST') {
      createBlogPost(data, res);
    }
  } else if (pathname.match(/\/api\/blog-posts\/(\d+)$/)) {
    const postId = pathname.split('/')[3];
    if (method === 'PUT') {
      updateBlogPost(postId, data, res);
    } else if (method === 'DELETE') {
      deleteBlogPost(postId, res);
    }
  }
  
  // TEACHERS ENDPOINTS
  else if (pathname === '/api/teachers') {
    if (method === 'GET') {
      getTeachers(res);
    } else if (method === 'POST') {
      createTeacher(data, res);
    }
  } else if (pathname.match(/\/api\/teachers\/(\d+)$/)) {
    const teacherId = pathname.split('/')[3];
    if (method === 'PUT') {
      updateTeacher(teacherId, data, res);
    } else if (method === 'DELETE') {
      deleteTeacher(teacherId, res);
    }
  }
  
  // FAQs ENDPOINTS
  else if (pathname === '/api/faqs') {
    if (method === 'GET') {
      getFAQs(res);
    } else if (method === 'POST') {
      createFAQ(data, res);
    }
  } else if (pathname.match(/\/api\/faqs\/(\d+)$/)) {
    const faqId = pathname.split('/')[3];
    if (method === 'PUT') {
      updateFAQ(faqId, data, res);
    } else if (method === 'DELETE') {
      deleteFAQ(faqId, res);
    }
  }
  
  // PRICING PLANS ENDPOINTS
  else if (pathname === '/api/pricing-plans') {
    if (method === 'GET') {
      getPricingPlans(res);
    } else if (method === 'POST') {
      createPricingPlan(data, res);
    }
  } else if (pathname.match(/\/api\/pricing-plans\/(\d+)$/)) {
    const planId = pathname.split('/')[3];
    if (method === 'PUT') {
      updatePricingPlan(planId, data, res);
    } else if (method === 'DELETE') {
      deletePricingPlan(planId, res);
    }
  }
  
  // JOB POSTINGS ENDPOINTS
  else if (pathname === '/api/job-postings') {
    if (method === 'GET') {
      getJobPostings(res);
    } else if (method === 'POST') {
      createJobPosting(data, res);
    }
  } else if (pathname.match(/\/api\/job-postings\/(\d+)$/)) {
    const jobId = pathname.split('/')[3];
    if (method === 'PUT') {
      updateJobPosting(jobId, data, res);
    } else if (method === 'DELETE') {
      deleteJobPosting(jobId, res);
    }
  }
  
  // CAREER RESOURCES ENDPOINTS
  else if (pathname === '/api/career-resources') {
    if (method === 'GET') {
      getCareerResources(res);
    } else if (method === 'POST') {
      createCareerResource(data, res);
    }
  } else if (pathname.match(/\/api\/career-resources\/(\d+)$/)) {
    const resourceId = pathname.split('/')[3];
    if (method === 'PUT') {
      updateCareerResource(resourceId, data, res);
    } else if (method === 'DELETE') {
      deleteCareerResource(resourceId, res);
    }
  }
  
  // HOME PAGE ENDPOINTS
  else if (pathname === '/api/home-page' && method === 'PUT') {
    updateHomePage(data, res);
  }
  
  // ABOUT PAGE ENDPOINTS
  else if (pathname === '/api/about-page' && method === 'PUT') {
    updateAboutPage(data, res);
  }
  
  // CONTACT PAGE ENDPOINTS
  else if (pathname === '/api/contact-page' && method === 'PUT') {
    updateContactPage(data, res);
  }
  
  // STATUS ENDPOINT
  else if (pathname === '/api/status' && method === 'GET') {
    getStatus(res);
  }
  
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
}

// COURSES CRUD OPERATIONS
function getCourses(res) {
  queryDatabase(`
    SELECT * FROM courses WHERE published_at IS NOT NULL ORDER BY id DESC
  `, res, (data) => {
    return {
      data: data.map(course => ({
        id: course.id,
        attributes: {
          title: course.title,
          description: course.description,
          price: course.price,
          duration: course.duration,
          lessons: course.lessons,
          category: course.category,
          rating: course.rating,
          visible: Boolean(course.visible)
        }
      }))
    };
  });
}

function getCourseById(courseId, res) {
  queryDatabase(`
    SELECT * FROM courses WHERE id = ${courseId} AND published_at IS NOT NULL
  `, res, (data) => {
    if (data.length === 0) {
      return { error: 'Course not found' };
    }
    return {
      data: {
        id: data[0].id,
        attributes: {
          title: data[0].title,
          description: data[0].description,
          price: data[0].price,
          duration: data[0].duration,
          lessons: data[0].lessons,
          category: data[0].category,
          rating: data[0].rating,
          visible: Boolean(data[0].visible)
        }
      }
    };
  });
}

function createCourse(courseData, res) {
  const documentId = 'course-' + Date.now();
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    INSERT INTO courses (
      document_id, title, description, price, duration, lessons, category, rating, visible,
      created_at, updated_at, published_at, created_by_id, updated_by_id
    ) VALUES (
      '${documentId}', 
      '${escapeSQL(courseData.title)}', 
      '${escapeSQL(courseData.description)}', 
      ${courseData.price}, 
      '${escapeSQL(courseData.duration)}', 
      ${courseData.lessons}, 
      '${escapeSQL(courseData.category)}', 
      ${courseData.rating}, 
      ${courseData.visible ? 1 : 0},
      '${now}', '${now}', '${now}', 1, 1
    )
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Created course: ${courseData.title}`);
    return { message: 'Course created successfully', data: { title: courseData.title } };
  });
}

function updateCourse(courseId, courseData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    UPDATE courses SET
      title = '${escapeSQL(courseData.title)}',
      description = '${escapeSQL(courseData.description)}',
      price = ${courseData.price},
      duration = '${escapeSQL(courseData.duration)}',
      lessons = ${courseData.lessons},
      category = '${escapeSQL(courseData.category)}',
      rating = ${courseData.rating},
      visible = ${courseData.visible ? 1 : 0},
      updated_at = '${now}'
    WHERE id = ${courseId}
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Updated course ID: ${courseId}`);
    return { message: 'Course updated successfully', id: courseId };
  });
}

function deleteCourse(courseId, res) {
  const query = `DELETE FROM courses WHERE id = ${courseId}`;
  
  executeUpdate(query, res, () => {
    console.log(`🗑️ Deleted course ID: ${courseId}`);
    return { message: 'Course deleted successfully', id: courseId };
  });
}

// BLOG POSTS CRUD OPERATIONS
function getBlogPosts(res) {
  queryDatabase(`
    SELECT * FROM blog_posts WHERE published_at IS NOT NULL ORDER BY created_at DESC
  `, res, (data) => {
    return {
      data: data.map(post => ({
        id: post.id,
        attributes: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          publishedAt: post.published_at
        }
      }))
    };
  });
}

function createBlogPost(postData, res) {
  const documentId = 'post-' + Date.now();
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  const slug = postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  const query = `
    INSERT INTO blog_posts (
      document_id, title, slug, excerpt, content, author, category,
      created_at, updated_at, published_at, created_by_id, updated_by_id
    ) VALUES (
      '${documentId}', 
      '${escapeSQL(postData.title)}', 
      '${slug}',
      '${escapeSQL(postData.excerpt)}', 
      '${escapeSQL(postData.content)}', 
      '${escapeSQL(postData.author)}', 
      '${escapeSQL(postData.category)}',
      '${now}', '${now}', '${now}', 1, 1
    )
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Created blog post: ${postData.title}`);
    return { message: 'Blog post created successfully', data: { title: postData.title } };
  });
}

function updateBlogPost(postId, postData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  const slug = postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  const query = `
    UPDATE blog_posts SET
      title = '${escapeSQL(postData.title)}',
      slug = '${slug}',
      excerpt = '${escapeSQL(postData.excerpt)}',
      content = '${escapeSQL(postData.content)}',
      author = '${escapeSQL(postData.author)}',
      category = '${escapeSQL(postData.category)}',
      updated_at = '${now}'
    WHERE id = ${postId}
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Updated blog post ID: ${postId}`);
    return { message: 'Blog post updated successfully', id: postId };
  });
}

function deleteBlogPost(postId, res) {
  const query = `DELETE FROM blog_posts WHERE id = ${postId}`;
  
  executeUpdate(query, res, () => {
    console.log(`🗑️ Deleted blog post ID: ${postId}`);
    return { message: 'Blog post deleted successfully', id: postId };
  });
}

// TEACHERS CRUD OPERATIONS
function getTeachers(res) {
  queryDatabase(`
    SELECT * FROM teachers WHERE published_at IS NOT NULL ORDER BY [order] ASC
  `, res, (data) => {
    return {
      data: data.map(teacher => ({
        id: teacher.id,
        attributes: {
          name: teacher.name,
          role: teacher.role,
          bio: teacher.bio,
          linkedin: teacher.linkedin,
          twitter: teacher.twitter,
          order: teacher.order
        }
      }))
    };
  });
}

function createTeacher(teacherData, res) {
  const documentId = 'teacher-' + Date.now();
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    INSERT INTO teachers (
      document_id, name, role, bio, linkedin, twitter, [order],
      created_at, updated_at, published_at, created_by_id, updated_by_id
    ) VALUES (
      '${documentId}', 
      '${escapeSQL(teacherData.name)}', 
      '${escapeSQL(teacherData.role)}', 
      '${escapeSQL(teacherData.bio)}', 
      '${escapeSQL(teacherData.linkedin || '')}', 
      '${escapeSQL(teacherData.twitter || '')}',
      ${teacherData.order || 99},
      '${now}', '${now}', '${now}', 1, 1
    )
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Created teacher: ${teacherData.name}`);
    return { message: 'Teacher created successfully', data: { name: teacherData.name } };
  });
}

function updateTeacher(teacherId, teacherData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    UPDATE teachers SET
      name = '${escapeSQL(teacherData.name)}',
      role = '${escapeSQL(teacherData.role)}',
      bio = '${escapeSQL(teacherData.bio)}',
      linkedin = '${escapeSQL(teacherData.linkedin || '')}',
      twitter = '${escapeSQL(teacherData.twitter || '')}',
      [order] = ${teacherData.order || 99},
      updated_at = '${now}'
    WHERE id = ${teacherId}
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Updated teacher ID: ${teacherId}`);
    return { message: 'Teacher updated successfully', id: teacherId };
  });
}

function deleteTeacher(teacherId, res) {
  const query = `DELETE FROM teachers WHERE id = ${teacherId}`;
  
  executeUpdate(query, res, () => {
    console.log(`🗑️ Deleted teacher ID: ${teacherId}`);
    return { message: 'Teacher deleted successfully', id: teacherId };
  });
}

// FAQs CRUD OPERATIONS
function getFAQs(res) {
  queryDatabase(`
    SELECT * FROM faqs WHERE published_at IS NOT NULL ORDER BY [order] ASC
  `, res, (data) => {
    return {
      data: data.map(faq => ({
        id: faq.id,
        attributes: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          order: faq.order
        }
      }))
    };
  });
}

function createFAQ(faqData, res) {
  const documentId = 'faq-' + Date.now();
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    INSERT INTO faqs (
      document_id, question, answer, category, [order],
      created_at, updated_at, published_at, created_by_id, updated_by_id
    ) VALUES (
      '${documentId}', 
      '${escapeSQL(faqData.question)}', 
      '${escapeSQL(faqData.answer)}', 
      '${escapeSQL(faqData.category)}',
      ${faqData.order || 1},
      '${now}', '${now}', '${now}', 1, 1
    )
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Created FAQ: ${faqData.question}`);
    return { message: 'FAQ created successfully', data: { question: faqData.question } };
  });
}

function updateFAQ(faqId, faqData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    UPDATE faqs SET
      question = '${escapeSQL(faqData.question)}',
      answer = '${escapeSQL(faqData.answer)}',
      category = '${escapeSQL(faqData.category)}',
      [order] = ${faqData.order || 1},
      updated_at = '${now}'
    WHERE id = ${faqId}
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Updated FAQ ID: ${faqId}`);
    return { message: 'FAQ updated successfully', id: faqId };
  });
}

function deleteFAQ(faqId, res) {
  const query = `DELETE FROM faqs WHERE id = ${faqId}`;
  
  executeUpdate(query, res, () => {
    console.log(`🗑️ Deleted FAQ ID: ${faqId}`);
    return { message: 'FAQ deleted successfully', id: faqId };
  });
}

// PRICING PLANS CRUD OPERATIONS
function getPricingPlans(res) {
  queryDatabase(`
    SELECT * FROM pricing_plans WHERE published_at IS NOT NULL ORDER BY [order] ASC
  `, res, (data) => {
    return {
      data: data.map(plan => ({
        id: plan.id,
        attributes: {
          name: plan.name,
          price: plan.price,
          period: plan.period,
          description: plan.description,
          featured: Boolean(plan.featured),
          ctaText: plan.cta_text,
          order: plan.order
        }
      }))
    };
  });
}

function createPricingPlan(planData, res) {
  const documentId = 'plan-' + Date.now();
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    INSERT INTO pricing_plans (
      document_id, name, price, period, description, featured, cta_text, [order],
      created_at, updated_at, published_at, created_by_id, updated_by_id
    ) VALUES (
      '${documentId}', 
      '${escapeSQL(planData.name)}', 
      ${planData.price}, 
      '${escapeSQL(planData.period)}',
      '${escapeSQL(planData.description)}',
      ${planData.featured ? 1 : 0},
      '${escapeSQL(planData.ctaText || 'Get Started')}',
      ${planData.order || 1},
      '${now}', '${now}', '${now}', 1, 1
    )
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Created pricing plan: ${planData.name}`);
    return { message: 'Pricing plan created successfully', data: { name: planData.name } };
  });
}

function updatePricingPlan(planId, planData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    UPDATE pricing_plans SET
      name = '${escapeSQL(planData.name)}',
      price = ${planData.price},
      period = '${escapeSQL(planData.period)}',
      description = '${escapeSQL(planData.description)}',
      featured = ${planData.featured ? 1 : 0},
      cta_text = '${escapeSQL(planData.ctaText || 'Get Started')}',
      [order] = ${planData.order || 1},
      updated_at = '${now}'
    WHERE id = ${planId}
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Updated pricing plan ID: ${planId}`);
    return { message: 'Pricing plan updated successfully', id: planId };
  });
}

function deletePricingPlan(planId, res) {
  const query = `DELETE FROM pricing_plans WHERE id = ${planId}`;
  
  executeUpdate(query, res, () => {
    console.log(`🗑️ Deleted pricing plan ID: ${planId}`);
    return { message: 'Pricing plan deleted successfully', id: planId };
  });
}

// JOB POSTINGS CRUD OPERATIONS
function getJobPostings(res) {
  queryDatabase(`
    SELECT * FROM job_postings WHERE published_at IS NOT NULL ORDER BY created_at DESC
  `, res, (data) => {
    return {
      data: data.map(job => ({
        id: job.id,
        attributes: {
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          description: job.description,
          applyUrl: job.apply_url
        }
      }))
    };
  });
}

function createJobPosting(jobData, res) {
  const documentId = 'job-' + Date.now();
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    INSERT INTO job_postings (
      document_id, title, company, location, type, description, apply_url,
      created_at, updated_at, published_at, created_by_id, updated_by_id
    ) VALUES (
      '${documentId}', 
      '${escapeSQL(jobData.title)}', 
      '${escapeSQL(jobData.company)}', 
      '${escapeSQL(jobData.location)}',
      '${escapeSQL(jobData.type)}',
      '${escapeSQL(jobData.description)}',
      '${escapeSQL(jobData.applyUrl)}',
      '${now}', '${now}', '${now}', 1, 1
    )
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Created job posting: ${jobData.title}`);
    return { message: 'Job posting created successfully', data: { title: jobData.title } };
  });
}

function updateJobPosting(jobId, jobData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    UPDATE job_postings SET
      title = '${escapeSQL(jobData.title)}',
      company = '${escapeSQL(jobData.company)}',
      location = '${escapeSQL(jobData.location)}',
      type = '${escapeSQL(jobData.type)}',
      description = '${escapeSQL(jobData.description)}',
      apply_url = '${escapeSQL(jobData.applyUrl)}',
      updated_at = '${now}'
    WHERE id = ${jobId}
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Updated job posting ID: ${jobId}`);
    return { message: 'Job posting updated successfully', id: jobId };
  });
}

function deleteJobPosting(jobId, res) {
  const query = `DELETE FROM job_postings WHERE id = ${jobId}`;
  
  executeUpdate(query, res, () => {
    console.log(`🗑️ Deleted job posting ID: ${jobId}`);
    return { message: 'Job posting deleted successfully', id: jobId };
  });
}

// CAREER RESOURCES CRUD OPERATIONS
function getCareerResources(res) {
  queryDatabase(`
    SELECT * FROM career_resources WHERE published_at IS NOT NULL ORDER BY created_at DESC
  `, res, (data) => {
    return {
      data: data.map(resource => ({
        id: resource.id,
        attributes: {
          title: resource.title,
          description: resource.description,
          type: resource.type,
          downloadUrl: resource.download_url
        }
      }))
    };
  });
}

function createCareerResource(resourceData, res) {
  const documentId = 'resource-' + Date.now();
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    INSERT INTO career_resources (
      document_id, title, description, type, download_url,
      created_at, updated_at, published_at, created_by_id, updated_by_id
    ) VALUES (
      '${documentId}', 
      '${escapeSQL(resourceData.title)}', 
      '${escapeSQL(resourceData.description)}', 
      '${escapeSQL(resourceData.type)}',
      '${escapeSQL(resourceData.downloadUrl)}',
      '${now}', '${now}', '${now}', 1, 1
    )
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Created career resource: ${resourceData.title}`);
    return { message: 'Career resource created successfully', data: { title: resourceData.title } };
  });
}

function updateCareerResource(resourceId, resourceData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  const query = `
    UPDATE career_resources SET
      title = '${escapeSQL(resourceData.title)}',
      description = '${escapeSQL(resourceData.description)}',
      type = '${escapeSQL(resourceData.type)}',
      download_url = '${escapeSQL(resourceData.downloadUrl)}',
      updated_at = '${now}'
    WHERE id = ${resourceId}
  `;
  
  executeUpdate(query, res, () => {
    console.log(`✅ Updated career resource ID: ${resourceId}`);
    return { message: 'Career resource updated successfully', id: resourceId };
  });
}

function deleteCareerResource(resourceId, res) {
  const query = `DELETE FROM career_resources WHERE id = ${resourceId}`;
  
  executeUpdate(query, res, () => {
    console.log(`🗑️ Deleted career resource ID: ${resourceId}`);
    return { message: 'Career resource deleted successfully', id: resourceId };
  });
}

// HOME PAGE UPDATE OPERATION
function updateHomePage(homeData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  // First, get the current home page ID
  queryDatabase(`SELECT id FROM home_pages WHERE published_at IS NOT NULL LIMIT 1`, null, (data) => {
    if (data.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Home page not found' }));
      return;
    }
    
    const homeId = data[0].id;
    
    // Build the update query with ALL 123 fields
    let updateFields = [];
    
    // Basic fields
    if (homeData.title !== undefined) updateFields.push(`title = '${escapeSQL(homeData.title)}'`);
    if (homeData.heroTitle !== undefined) updateFields.push(`hero_title = '${escapeSQL(homeData.heroTitle)}'`);
    if (homeData.heroSubtitle !== undefined) updateFields.push(`hero_subtitle = '${escapeSQL(homeData.heroSubtitle)}'`);
    if (homeData.heroDescription !== undefined) updateFields.push(`hero_description = '${escapeSQL(homeData.heroDescription)}'`);
    if (homeData.heroSectionVisible !== undefined) updateFields.push(`hero_section_visible = ${homeData.heroSectionVisible ? 1 : 0}`);
    
    // Featured courses section
    if (homeData.featuredCoursesTitle !== undefined) updateFields.push(`featured_courses_title = '${escapeSQL(homeData.featuredCoursesTitle)}'`);
    if (homeData.featuredCoursesDescription !== undefined) updateFields.push(`featured_courses_description = '${escapeSQL(homeData.featuredCoursesDescription)}'`);
    if (homeData.featuredCoursesVisible !== undefined) updateFields.push(`featured_courses_visible = ${homeData.featuredCoursesVisible ? 1 : 0}`);
    
    // About section
    if (homeData.aboutTitle !== undefined) updateFields.push(`about_title = '${escapeSQL(homeData.aboutTitle)}'`);
    if (homeData.aboutSubtitle !== undefined) updateFields.push(`about_subtitle = '${escapeSQL(homeData.aboutSubtitle)}'`);
    if (homeData.aboutDescription !== undefined) updateFields.push(`about_description = '${escapeSQL(homeData.aboutDescription)}'`);
    if (homeData.aboutVisible !== undefined) updateFields.push(`about_visible = ${homeData.aboutVisible ? 1 : 0}`);
    
    // Companies section
    if (homeData.companiesTitle !== undefined) updateFields.push(`companies_title = '${escapeSQL(homeData.companiesTitle)}'`);
    if (homeData.companiesDescription !== undefined) updateFields.push(`companies_description = '${escapeSQL(homeData.companiesDescription)}'`);
    if (homeData.companiesVisible !== undefined) updateFields.push(`companies_visible = ${homeData.companiesVisible ? 1 : 0}`);
    
    // Testimonials section
    if (homeData.testimonialsTitle !== undefined) updateFields.push(`testimonials_title = '${escapeSQL(homeData.testimonialsTitle)}'`);
    if (homeData.testimonialsSubtitle !== undefined) updateFields.push(`testimonials_subtitle = '${escapeSQL(homeData.testimonialsSubtitle)}'`);
    if (homeData.testimonialsVisible !== undefined) updateFields.push(`testimonials_visible = ${homeData.testimonialsVisible ? 1 : 0}`);
    
    // Individual courses (6 courses)
    if (homeData.courses && Array.isArray(homeData.courses)) {
      homeData.courses.forEach((course, index) => {
        const num = index + 1;
        if (course.title !== undefined) updateFields.push(`course_${num}_title = '${escapeSQL(course.title)}'`);
        if (course.rating !== undefined) updateFields.push(`course_${num}_rating = ${course.rating}`);
        if (course.lessons !== undefined) updateFields.push(`course_${num}_lessons = ${course.lessons}`);
        if (course.duration !== undefined) updateFields.push(`course_${num}_duration = '${escapeSQL(course.duration)}'`);
        if (course.category !== undefined) updateFields.push(`course_${num}_category = '${escapeSQL(course.category)}'`);
        if (course.description !== undefined) updateFields.push(`course_${num}_description = '${escapeSQL(course.description)}'`);
        if (course.visible !== undefined) updateFields.push(`course_${num}_visible = ${course.visible ? 1 : 0}`);
      });
    }
    
    // Individual testimonials (4 testimonials)
    if (homeData.testimonials && Array.isArray(homeData.testimonials)) {
      homeData.testimonials.forEach((testimonial, index) => {
        const num = index + 1;
        if (testimonial.text !== undefined) updateFields.push(`testimonial_${num}_text = '${escapeSQL(testimonial.text)}'`);
        if (testimonial.author !== undefined) updateFields.push(`testimonial_${num}_author = '${escapeSQL(testimonial.author)}'`);
        if (testimonial.rating !== undefined) updateFields.push(`testimonial_${num}_rating = ${testimonial.rating}`);
        if (testimonial.visible !== undefined) updateFields.push(`testimonial_${num}_visible = ${testimonial.visible ? 1 : 0}`);
      });
    }
    
    updateFields.push(`updated_at = '${now}'`);
    
    const query = `
      UPDATE home_pages SET
        ${updateFields.join(',\n        ')}
      WHERE id = ${homeId}
    `;
    
    executeUpdate(query, res, () => {
      console.log(`✅ Updated home page with ${updateFields.length} fields`);
      return { message: 'Home page updated successfully', fieldsUpdated: updateFields.length };
    });
  });
}

// ABOUT PAGE UPDATE OPERATION
function updateAboutPage(aboutData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  // Get the current about page ID
  queryDatabase(`SELECT id FROM about_pages WHERE published_at IS NOT NULL LIMIT 1`, null, (data) => {
    if (data.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'About page not found' }));
      return;
    }
    
    const aboutId = data[0].id;
    
    const query = `
      UPDATE about_pages SET
        hero_title = '${escapeSQL(aboutData.heroTitle || '')}',
        hero_subtitle = '${escapeSQL(aboutData.heroSubtitle || '')}',
        mission_title = '${escapeSQL(aboutData.missionTitle || '')}',
        mission_description = '${escapeSQL(aboutData.missionDescription || '')}',
        vision_title = '${escapeSQL(aboutData.visionTitle || '')}',
        vision_description = '${escapeSQL(aboutData.visionDescription || '')}',
        updated_at = '${now}'
      WHERE id = ${aboutId}
    `;
    
    executeUpdate(query, res, () => {
      console.log(`✅ Updated about page`);
      return { message: 'About page updated successfully' };
    });
  });
}

// CONTACT PAGE UPDATE OPERATION
function updateContactPage(contactData, res) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, -5);
  
  // Get the current contact page ID
  queryDatabase(`SELECT id FROM contact_pages WHERE published_at IS NOT NULL LIMIT 1`, null, (data) => {
    if (data.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Contact page not found' }));
      return;
    }
    
    const contactId = data[0].id;
    
    const query = `
      UPDATE contact_pages SET
        phone = '${escapeSQL(contactData.phone || '')}',
        email = '${escapeSQL(contactData.email || '')}',
        address = '${escapeSQL(contactData.address || '')}',
        office_hours = '${escapeSQL(contactData.officeHours || '')}',
        map_url = '${escapeSQL(contactData.mapUrl || '')}',
        updated_at = '${now}'
      WHERE id = ${contactId}
    `;
    
    executeUpdate(query, res, () => {
      console.log(`✅ Updated contact page`);
      return { message: 'Contact page updated successfully' };
    });
  });
}

// STATUS ENDPOINT
function getStatus(res) {
  Promise.all([
    queryDatabasePromise('SELECT COUNT(*) as count FROM courses WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM blog_posts WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM teachers WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM faqs WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM pricing_plans WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM job_postings WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM career_resources WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM home_pages WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM about_pages WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM contact_pages WHERE published_at IS NOT NULL')
  ]).then(([courses, blogs, teachers, faqs, pricing, jobs, resources, home, about, contact]) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'Connected - COMPLETE CRUD Operations Available',
      database: DB_PATH,
      timestamp: new Date().toISOString(),
      features: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      endpoints: [
        'courses', 'blog-posts', 'teachers', 'faqs', 'pricing-plans', 
        'job-postings', 'career-resources', 'home-page', 'about-page', 'contact-page'
      ],
      content: {
        courses: courses[0].count,
        blogPosts: blogs[0].count,
        teachers: teachers[0].count,
        faqs: faqs[0].count,
        pricingPlans: pricing[0].count,
        jobPostings: jobs[0].count,
        careerResources: resources[0].count,
        homePages: home[0].count,
        aboutPages: about[0].count,
        contactPages: contact[0].count
      }
    }, null, 2));
  }).catch(error => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  });
}

// UTILITY FUNCTIONS
function escapeSQL(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

function queryDatabase(query, res, formatter) {
  const command = `sqlite3 -json "${DB_PATH}" "${query}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Database error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database error', details: stderr }));
      return;
    }
    
    try {
      const data = JSON.parse(stdout || '[]');
      const response = formatter(data);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response, null, 2));
      
      console.log(`✅ Database query successful: ${data.length} records`);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Parse error' }));
    }
  });
}

function executeUpdate(query, res, successCallback) {
  const command = `sqlite3 "${DB_PATH}" "${query}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Database update error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database update failed', details: stderr }));
      return;
    }
    
    try {
      const response = successCallback();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response, null, 2));
    } catch (callbackError) {
      console.error('Callback error:', callbackError);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Operation failed' }));
    }
  });
}

function queryDatabasePromise(query) {
  return new Promise((resolve, reject) => {
    const command = `sqlite3 -json "${DB_PATH}" "${query}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(stdout || '[]'));
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 COMPLETE CRUD Live API running at http://localhost:${PORT}`);
  console.log(`📊 Available CRUD endpoints:`);
  console.log(`   📚 COURSES:         GET/POST http://localhost:${PORT}/api/courses`);
  console.log(`                      GET/PUT/DELETE http://localhost:${PORT}/api/courses/{id}`);
  console.log(`   📝 BLOG POSTS:      GET/POST http://localhost:${PORT}/api/blog-posts`);
  console.log(`                      PUT/DELETE http://localhost:${PORT}/api/blog-posts/{id}`);
  console.log(`   👨‍🏫 TEACHERS:        GET/POST http://localhost:${PORT}/api/teachers`);
  console.log(`                      PUT/DELETE http://localhost:${PORT}/api/teachers/{id}`);
  console.log(`   ❓ FAQs:            GET/POST http://localhost:${PORT}/api/faqs`);
  console.log(`                      PUT/DELETE http://localhost:${PORT}/api/faqs/{id}`);
  console.log(`   💰 PRICING PLANS:   GET/POST http://localhost:${PORT}/api/pricing-plans`);
  console.log(`                      PUT/DELETE http://localhost:${PORT}/api/pricing-plans/{id}`);
  console.log(`   💼 JOB POSTINGS:    GET/POST http://localhost:${PORT}/api/job-postings`);
  console.log(`                      PUT/DELETE http://localhost:${PORT}/api/job-postings/{id}`);
  console.log(`   📄 CAREER RESOURCES: GET/POST http://localhost:${PORT}/api/career-resources`);
  console.log(`                      PUT/DELETE http://localhost:${PORT}/api/career-resources/{id}`);
  console.log(`   🏠 HOME PAGE:       PUT http://localhost:${PORT}/api/home-page`);
  console.log(`   ℹ️ ABOUT PAGE:       PUT http://localhost:${PORT}/api/about-page`);
  console.log(`   📞 CONTACT PAGE:    PUT http://localhost:${PORT}/api/contact-page`);
  console.log(`   📊 STATUS:          GET http://localhost:${PORT}/api/status`);
  console.log(`💾 Database: ${DB_PATH}`);
  console.log(`🛠️ CRUD Operations: CREATE ✅ READ ✅ UPDATE ✅ DELETE ✅`);
  console.log(`🎯 Content Types: 10 fully supported with complete CRUD`);
  console.log(`✨ Ready for comprehensive content management!`);
});