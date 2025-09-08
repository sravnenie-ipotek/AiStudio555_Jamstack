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

// STATUS ENDPOINT
function getStatus(res) {
  Promise.all([
    queryDatabasePromise('SELECT COUNT(*) as count FROM courses WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM blog_posts WHERE published_at IS NOT NULL'),
    queryDatabasePromise('SELECT COUNT(*) as count FROM teachers WHERE published_at IS NOT NULL')
  ]).then(([courses, blogs, teachers]) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'Connected - CRUD Operations Available',
      database: DB_PATH,
      timestamp: new Date().toISOString(),
      features: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
      content: {
        courses: courses[0].count,
        blogPosts: blogs[0].count,
        teachers: teachers[0].count
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
  console.log(`📊 Available endpoints:`);
  console.log(`   GET/POST http://localhost:${PORT}/api/courses`);
  console.log(`   GET/PUT/DELETE http://localhost:${PORT}/api/courses/{id}`);
  console.log(`   GET/POST http://localhost:${PORT}/api/blog-posts`);
  console.log(`   GET/PUT/DELETE http://localhost:${PORT}/api/blog-posts/{id}`);
  console.log(`   GET/POST http://localhost:${PORT}/api/teachers`);
  console.log(`   GET/PUT/DELETE http://localhost:${PORT}/api/teachers/{id}`);
  console.log(`   GET http://localhost:${PORT}/api/status`);
  console.log(`💾 Database: ${DB_PATH}`);
  console.log(`🛠️ CRUD Operations: CREATE ✅ READ ✅ UPDATE ✅ DELETE ✅`);
  console.log(`✨ Ready for content management!`);
});