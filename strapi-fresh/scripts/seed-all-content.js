/**
 * Seed ALL Content Types
 * Populates all Strapi content types with sample data
 * Run: cd strapi-fresh && node scripts/seed-all-content.js
 */

const fs = require('fs');
const path = require('path');

// Sample data for all content types
const sampleData = {
  // Courses
  courses: [
    {
      title: 'Complete React Development',
      description: 'Master React.js from basics to advanced concepts including Redux, Hooks, and Next.js',
      price: 199,
      duration: '12 Weeks',
      lessons: 48,
      category: 'Web Development',
      level: 'intermediate',
      rating: 4.9,
      visible: true,
      featured: true,
      curriculum: [
        { title: 'Introduction to React', duration: '45 min' },
        { title: 'JSX and Components', duration: '60 min' },
        { title: 'State and Props', duration: '90 min' },
        { title: 'React Hooks', duration: '120 min' },
        { title: 'Redux Fundamentals', duration: '90 min' }
      ]
    },
    {
      title: 'Python for Data Science',
      description: 'Learn Python programming with focus on data analysis, machine learning, and AI',
      price: 249,
      duration: '10 Weeks',
      lessons: 40,
      category: 'Data Science',
      level: 'beginner',
      rating: 4.8,
      visible: true,
      featured: true
    },
    {
      title: 'Full Stack JavaScript',
      description: 'Become a full stack developer with Node.js, Express, MongoDB, and React',
      price: 299,
      duration: '16 Weeks',
      lessons: 64,
      category: 'Web Development',
      level: 'advanced',
      rating: 4.95,
      visible: true,
      featured: true
    },
    {
      title: 'UI/UX Design Masterclass',
      description: 'Learn modern design principles, Figma, and user experience best practices',
      price: 179,
      duration: '8 Weeks',
      lessons: 32,
      category: 'Design',
      level: 'beginner',
      rating: 4.7,
      visible: true
    },
    {
      title: 'Mobile App Development',
      description: 'Build native mobile apps with React Native for iOS and Android',
      price: 229,
      duration: '12 Weeks',
      lessons: 48,
      category: 'Mobile Development',
      level: 'intermediate',
      rating: 4.85,
      visible: true
    },
    {
      title: 'Cloud Computing with AWS',
      description: 'Master AWS services and cloud architecture for scalable applications',
      price: 279,
      duration: '10 Weeks',
      lessons: 40,
      category: 'Cloud & DevOps',
      level: 'intermediate',
      rating: 4.9,
      visible: true
    }
  ],

  // About Page
  aboutPage: {
    heroTitle: 'About AI Studio',
    heroSubtitle: 'Transforming careers through expert-led online education',
    missionTitle: 'Our Mission',
    missionDescription: 'To democratize access to high-quality technical education and empower individuals to build successful careers in technology.',
    visionTitle: 'Our Vision',
    visionDescription: 'To become the leading online platform for professional development, helping millions achieve their career goals through innovative learning experiences.',
    values: [
      {
        icon: '🎯',
        title: 'Excellence',
        description: 'We strive for excellence in everything we do'
      },
      {
        icon: '🤝',
        title: 'Community',
        description: 'Building a supportive learning community'
      },
      {
        icon: '💡',
        title: 'Innovation',
        description: 'Constantly innovating our teaching methods'
      },
      {
        icon: '🌍',
        title: 'Accessibility',
        description: 'Making education accessible to everyone'
      }
    ]
  },

  // Contact Page
  contactPage: {
    phone: '+1 (555) 123-4567',
    email: 'hello@aistudio.com',
    address: '123 Learning Street, Tech Valley, CA 94025',
    officeHours: 'Monday - Friday: 9:00 AM - 6:00 PM PST',
    mapUrl: 'https://maps.google.com'
  },

  // Blog Posts
  blogPosts: [
    {
      title: 'The Future of AI in Education',
      slug: 'future-ai-education',
      excerpt: 'Exploring how artificial intelligence is revolutionizing the way we learn and teach.',
      content: `<p>Artificial Intelligence is transforming education in unprecedented ways...</p>
                <p>From personalized learning paths to intelligent tutoring systems, AI is making education more accessible and effective.</p>
                <h2>Key Benefits</h2>
                <ul>
                  <li>Personalized learning experiences</li>
                  <li>24/7 availability of AI tutors</li>
                  <li>Adaptive assessments</li>
                  <li>Predictive analytics for student success</li>
                </ul>`,
      author: 'Dr. Sarah Johnson',
      category: 'Technology',
      publishedAt: new Date()
    },
    {
      title: '10 Tips for Learning to Code',
      slug: 'tips-learning-code',
      excerpt: 'Essential tips and strategies for beginners starting their coding journey.',
      content: '<p>Learning to code can be challenging but rewarding. Here are our top tips...</p>',
      author: 'Mike Chen',
      category: 'Programming',
      publishedAt: new Date(Date.now() - 86400000)
    },
    {
      title: 'Remote Work Best Practices',
      slug: 'remote-work-practices',
      excerpt: 'How to stay productive and maintain work-life balance while working from home.',
      content: '<p>Remote work has become the new normal. Here\'s how to excel...</p>',
      author: 'Lisa Anderson',
      category: 'Career',
      publishedAt: new Date(Date.now() - 172800000)
    }
  ],

  // Pricing Plans
  pricingPlans: [
    {
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        { text: 'Access to 5 courses', included: true },
        { text: 'Basic support', included: true },
        { text: 'Community access', included: true },
        { text: 'Certificates', included: false },
        { text: '1-on-1 mentoring', included: false }
      ],
      featured: false,
      ctaText: 'Start Free Trial',
      order: 1
    },
    {
      name: 'Professional',
      price: 79,
      period: 'month',
      description: 'Most popular choice for professionals',
      features: [
        { text: 'Unlimited course access', included: true },
        { text: 'Priority support', included: true },
        { text: 'Community access', included: true },
        { text: 'Certificates', included: true },
        { text: '1-on-1 mentoring (2 hours/month)', included: true }
      ],
      featured: true,
      ctaText: 'Get Started',
      order: 2
    },
    {
      name: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'For teams and organizations',
      features: [
        { text: 'Everything in Professional', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom learning paths', included: true },
        { text: 'Team analytics', included: true },
        { text: 'Unlimited mentoring', included: true }
      ],
      featured: false,
      ctaText: 'Contact Sales',
      order: 3
    }
  ],

  // Teachers
  teachers: [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Head of Data Science',
      bio: 'PhD in Computer Science from MIT. 15+ years of experience in machine learning and AI.',
      expertise: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow'],
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: 'https://twitter.com/sarahjohnson',
      order: 1
    },
    {
      name: 'Mike Chen',
      role: 'Senior Web Developer',
      bio: 'Full stack developer with 10+ years building scalable web applications.',
      expertise: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      linkedin: 'https://linkedin.com/in/mikechen',
      order: 2
    },
    {
      name: 'Lisa Anderson',
      role: 'UX Design Lead',
      bio: 'Award-winning designer with expertise in user experience and interface design.',
      expertise: ['Figma', 'UI/UX', 'Design Systems', 'User Research'],
      linkedin: 'https://linkedin.com/in/lisaanderson',
      order: 3
    },
    {
      name: 'David Kumar',
      role: 'Cloud Architecture Expert',
      bio: 'AWS certified solutions architect with extensive DevOps experience.',
      expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      linkedin: 'https://linkedin.com/in/davidkumar',
      order: 4
    }
  ],

  // Job Postings
  jobPostings: [
    {
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA (Remote)',
      type: 'Full-time',
      description: '<p>We are looking for an experienced React developer to join our team...</p>',
      requirements: ['5+ years React experience', 'Redux/MobX', 'TypeScript', 'Testing'],
      applyUrl: 'https://techcorp.com/careers/react-dev'
    },
    {
      title: 'Data Scientist',
      company: 'DataViz Solutions',
      location: 'New York, NY',
      type: 'Full-time',
      description: '<p>Join our data science team to work on cutting-edge ML projects...</p>',
      requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
      applyUrl: 'https://dataviz.com/careers/data-scientist'
    },
    {
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'Remote',
      type: 'Contract',
      description: '<p>We need a talented UX designer for a 6-month project...</p>',
      requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      applyUrl: 'https://designhub.com/careers/ux'
    }
  ],

  // Career Resources
  careerResources: [
    {
      title: 'Resume Template Pack',
      description: 'Professional resume templates optimized for tech roles',
      type: 'Template',
      downloadUrl: '/resources/resume-templates.pdf'
    },
    {
      title: 'Interview Preparation Guide',
      description: 'Complete guide to ace technical interviews',
      type: 'Guide',
      downloadUrl: '/resources/interview-guide.pdf'
    },
    {
      title: 'Salary Negotiation Handbook',
      description: 'Learn how to negotiate your worth',
      type: 'Handbook',
      downloadUrl: '/resources/salary-negotiation.pdf'
    }
  ]
};

// Create SQL insert statements
function generateSQL() {
  const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
  
  console.log('🚀 Generating SQL for all content types...');
  
  let sql = `
-- Seed All Content Types
-- Generated: ${new Date().toISOString()}

`;

  // Insert Courses
  sql += '-- Courses\n';
  sampleData.courses.forEach((course, index) => {
    sql += `INSERT INTO courses (title, description, price, duration, lessons, category, level, rating, visible, featured, curriculum, created_at, updated_at, published_at)
VALUES ('${course.title}', '${course.description}', ${course.price}, '${course.duration}', ${course.lessons}, '${course.category}', '${course.level || 'beginner'}', ${course.rating}, ${course.visible ? 1 : 0}, ${course.featured ? 1 : 0}, '${JSON.stringify(course.curriculum || [])}', datetime('now'), datetime('now'), datetime('now'));

`;
  });

  // Insert About Page
  sql += '-- About Page\n';
  const about = sampleData.aboutPage;
  sql += `INSERT INTO about_pages (hero_title, hero_subtitle, mission_title, mission_description, vision_title, vision_description, values, created_at, updated_at, published_at)
VALUES ('${about.heroTitle}', '${about.heroSubtitle}', '${about.missionTitle}', '${about.missionDescription}', '${about.visionTitle}', '${about.visionDescription}', '${JSON.stringify(about.values)}', datetime('now'), datetime('now'), datetime('now'));

`;

  // Insert Contact Page
  sql += '-- Contact Page\n';
  const contact = sampleData.contactPage;
  sql += `INSERT INTO contact_pages (phone, email, address, office_hours, map_url, created_at, updated_at, published_at)
VALUES ('${contact.phone}', '${contact.email}', '${contact.address}', '${contact.officeHours}', '${contact.mapUrl}', datetime('now'), datetime('now'), datetime('now'));

`;

  // Insert Blog Posts
  sql += '-- Blog Posts\n';
  sampleData.blogPosts.forEach(post => {
    sql += `INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published_at, created_at, updated_at)
VALUES ('${post.title}', '${post.slug}', '${post.excerpt}', '${post.content.replace(/'/g, "''")}', '${post.author}', '${post.category}', datetime('now'), datetime('now'), datetime('now'));

`;
  });

  // Insert Pricing Plans
  sql += '-- Pricing Plans\n';
  sampleData.pricingPlans.forEach(plan => {
    sql += `INSERT INTO pricing_plans (name, price, period, description, features, featured, cta_text, "order", created_at, updated_at, published_at)
VALUES ('${plan.name}', ${plan.price}, '${plan.period}', '${plan.description}', '${JSON.stringify(plan.features)}', ${plan.featured ? 1 : 0}, '${plan.ctaText}', ${plan.order}, datetime('now'), datetime('now'), datetime('now'));

`;
  });

  // Insert Teachers
  sql += '-- Teachers\n';
  sampleData.teachers.forEach(teacher => {
    sql += `INSERT INTO teachers (name, role, bio, expertise, linkedin, twitter, "order", created_at, updated_at, published_at)
VALUES ('${teacher.name}', '${teacher.role}', '${teacher.bio}', '${JSON.stringify(teacher.expertise)}', '${teacher.linkedin || ''}', '${teacher.twitter || ''}', ${teacher.order}, datetime('now'), datetime('now'), datetime('now'));

`;
  });

  // Insert Job Postings
  sql += '-- Job Postings\n';
  sampleData.jobPostings.forEach(job => {
    sql += `INSERT INTO job_postings (title, company, location, type, description, requirements, apply_url, created_at, updated_at, published_at)
VALUES ('${job.title}', '${job.company}', '${job.location}', '${job.type}', '${job.description}', '${JSON.stringify(job.requirements)}', '${job.applyUrl}', datetime('now'), datetime('now'), datetime('now'));

`;
  });

  // Insert Career Resources
  sql += '-- Career Resources\n';
  sampleData.careerResources.forEach(resource => {
    sql += `INSERT INTO career_resources (title, description, type, download_url, created_at, updated_at, published_at)
VALUES ('${resource.title}', '${resource.description}', '${resource.type}', '${resource.downloadUrl}', datetime('now'), datetime('now'), datetime('now'));

`;
  });

  // Save SQL file
  const sqlPath = path.join(__dirname, 'seed-all-content.sql');
  fs.writeFileSync(sqlPath, sql);
  
  console.log(`✅ SQL file generated: ${sqlPath}`);
  console.log('\n📝 To apply:');
  console.log('1. Make sure Strapi is running');
  console.log(`2. Run: sqlite3 ${dbPath} < ${sqlPath}`);
  
  return sql;
}

// Generate the SQL
generateSQL();

console.log('\n✨ Sample data generation complete!');
console.log('🎯 Next steps:');
console.log('1. Restart Strapi to see new content types');
console.log('2. Apply the SQL to populate with sample data');
console.log('3. Visit any page to see the CMS integration in action');