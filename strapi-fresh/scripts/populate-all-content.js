/**
 * Populate All Content Types via Strapi API
 * This script adds sample content to all content types
 * Run: cd strapi-fresh && node scripts/populate-all-content.js
 */

const axios = require('axios');

// Strapi configuration
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '6ba76f584778637fd308f48aac27461c1cf3a00b48c1e1b3bd017e87c019ea72e38e2e5c7c4bf01c1c69b039025e5a6797bb8e72ba956f86c0c5577bb59f4ab5f37d1c17a99a073e67e95ba1bc1e50c99bc02e14fde2ccfe88cad10c0b2ee091e982ad3ff4c39f696dc0e2c4d091cbd4c0037aa07f68e43097e37c90e6e96e4b'; // Use your actual API token

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Sample data
const sampleData = {
  // Courses
  courses: [
    {
      data: {
        title: 'Complete React Development',
        description: 'Master React.js from basics to advanced concepts including Redux, Hooks, and Next.js. This comprehensive course covers everything you need to become a professional React developer.',
        price: 199,
        duration: '12 Weeks',
        lessons: 48,
        category: 'Web Development',
        level: 'intermediate',
        rating: 4.9,
        visible: true,
        featured: true,
        enrollments: 1250,
        curriculum: {
          modules: [
            { title: 'Introduction to React', duration: '45 min', lessons: 5 },
            { title: 'JSX and Components', duration: '60 min', lessons: 7 },
            { title: 'State and Props', duration: '90 min', lessons: 8 },
            { title: 'React Hooks', duration: '120 min', lessons: 10 },
            { title: 'Redux Fundamentals', duration: '90 min', lessons: 8 }
          ]
        },
        requirements: ['Basic JavaScript knowledge', 'HTML & CSS fundamentals', 'Code editor installed'],
        outcomes: ['Build production-ready React apps', 'Master state management', 'Implement modern React patterns']
      }
    },
    {
      data: {
        title: 'Python for Data Science',
        description: 'Learn Python programming with focus on data analysis, machine learning, and AI. Perfect for beginners who want to enter the field of data science.',
        price: 249,
        duration: '10 Weeks',
        lessons: 40,
        category: 'Data Science',
        level: 'beginner',
        rating: 4.8,
        visible: true,
        featured: true,
        enrollments: 980
      }
    },
    {
      data: {
        title: 'Full Stack JavaScript',
        description: 'Become a full stack developer with Node.js, Express, MongoDB, and React. Build complete web applications from scratch.',
        price: 299,
        duration: '16 Weeks',
        lessons: 64,
        category: 'Web Development',
        level: 'advanced',
        rating: 4.95,
        visible: true,
        featured: true,
        enrollments: 750
      }
    },
    {
      data: {
        title: 'UI/UX Design Masterclass',
        description: 'Learn modern design principles, Figma, and user experience best practices. Create beautiful and functional designs.',
        price: 179,
        duration: '8 Weeks',
        lessons: 32,
        category: 'Design',
        level: 'beginner',
        rating: 4.7,
        visible: true,
        enrollments: 1100
      }
    },
    {
      data: {
        title: 'Mobile App Development',
        description: 'Build native mobile apps with React Native for iOS and Android. Learn once, deploy everywhere.',
        price: 229,
        duration: '12 Weeks',
        lessons: 48,
        category: 'Mobile Development',
        level: 'intermediate',
        rating: 4.85,
        visible: true,
        enrollments: 620
      }
    },
    {
      data: {
        title: 'Cloud Computing with AWS',
        description: 'Master AWS services and cloud architecture for scalable applications. Prepare for AWS certification.',
        price: 279,
        duration: '10 Weeks',
        lessons: 40,
        category: 'Cloud & DevOps',
        level: 'intermediate',
        rating: 4.9,
        visible: true,
        enrollments: 520
      }
    }
  ],

  // Blog Posts
  blogPosts: [
    {
      data: {
        title: 'The Future of AI in Education',
        slug: 'future-ai-education',
        excerpt: 'Exploring how artificial intelligence is revolutionizing the way we learn and teach in the digital age.',
        content: `Artificial Intelligence is transforming education in unprecedented ways. From personalized learning paths to intelligent tutoring systems, AI is making education more accessible and effective than ever before.

## The AI Revolution in Learning

The integration of AI in educational platforms has opened up new possibilities for both students and educators. Machine learning algorithms can now adapt to individual learning styles, providing customized content that matches each student's pace and preferences.

## Key Benefits of AI in Education

1. **Personalized Learning Experiences**: AI analyzes student performance and adapts content accordingly
2. **24/7 Availability**: AI tutors are available round the clock for student support
3. **Instant Feedback**: Students receive immediate feedback on their work
4. **Predictive Analytics**: Early identification of students who might need additional help

## Looking Ahead

As we move forward, AI will continue to play an increasingly important role in education, making quality learning accessible to everyone, everywhere.`,
        author: 'Dr. Sarah Johnson',
        category: 'Technology',
        publishedAt: new Date().toISOString()
      }
    },
    {
      data: {
        title: '10 Essential Tips for Learning to Code',
        slug: 'tips-learning-code',
        excerpt: 'Start your coding journey with these proven strategies that will accelerate your learning.',
        content: `Learning to code can be challenging but incredibly rewarding. Here are our top 10 tips to help you succeed in your programming journey.

## 1. Start with the Basics
Don't rush into complex frameworks. Master the fundamentals first.

## 2. Practice Daily
Consistency is key. Even 30 minutes a day is better than weekend marathons.

## 3. Build Projects
Theory is important, but building real projects solidifies your knowledge.

## 4. Join a Community
Connect with other learners and experienced developers.

## 5. Read Other People's Code
Learn from how others solve problems.

## 6. Don't Fear Errors
Errors are your teachers. Learn to debug effectively.

## 7. Use Version Control
Start using Git from day one.

## 8. Focus on Problem-Solving
Programming is about solving problems, not memorizing syntax.

## 9. Take Breaks
Your brain needs time to process information.

## 10. Never Stop Learning
Technology evolves constantly. Stay curious and keep learning.`,
        author: 'Mike Chen',
        category: 'Programming',
        publishedAt: new Date(Date.now() - 86400000).toISOString()
      }
    },
    {
      data: {
        title: 'Remote Work Best Practices',
        slug: 'remote-work-practices',
        excerpt: 'Master the art of working from home with these proven strategies for productivity and work-life balance.',
        content: `Remote work has become the new normal for many professionals. Here's how to excel in a remote environment while maintaining a healthy work-life balance.

## Creating Your Workspace
Set up a dedicated workspace that signals "work mode" to your brain.

## Establishing Routines
Maintain regular working hours and morning routines.

## Communication is Key
Over-communicate with your team to stay aligned.

## Taking Care of Yourself
Remember to take breaks, exercise, and maintain social connections.`,
        author: 'Lisa Anderson',
        category: 'Career',
        publishedAt: new Date(Date.now() - 172800000).toISOString()
      }
    }
  ],

  // Teachers
  teachers: [
    {
      data: {
        name: 'Dr. Sarah Johnson',
        role: 'Head of Data Science',
        bio: 'PhD in Computer Science from MIT with over 15 years of experience in machine learning and AI. Published author and conference speaker.',
        expertise: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch'],
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson',
        order: 1
      }
    },
    {
      data: {
        name: 'Mike Chen',
        role: 'Senior Web Developer',
        bio: 'Full stack developer with 10+ years building scalable web applications for Fortune 500 companies. Passionate about clean code and best practices.',
        expertise: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
        linkedin: 'https://linkedin.com/in/mikechen',
        order: 2
      }
    },
    {
      data: {
        name: 'Lisa Anderson',
        role: 'UX Design Lead',
        bio: 'Award-winning designer with expertise in user experience and interface design. Former design lead at top tech companies.',
        expertise: ['Figma', 'UI/UX', 'Design Systems', 'User Research', 'Prototyping'],
        linkedin: 'https://linkedin.com/in/lisaanderson',
        order: 3
      }
    },
    {
      data: {
        name: 'David Kumar',
        role: 'Cloud Architecture Expert',
        bio: 'AWS certified solutions architect with extensive DevOps experience. Specialized in building scalable cloud infrastructure.',
        expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        linkedin: 'https://linkedin.com/in/davidkumar',
        order: 4
      }
    }
  ],

  // Pricing Plans
  pricingPlans: [
    {
      data: {
        name: 'Basic',
        price: 29,
        period: 'month',
        description: 'Perfect for getting started with online learning',
        features: [
          { text: 'Access to 5 courses per month', included: true },
          { text: 'Basic email support', included: true },
          { text: 'Community forum access', included: true },
          { text: 'Course completion certificates', included: false },
          { text: '1-on-1 mentoring sessions', included: false },
          { text: 'Priority support', included: false }
        ],
        featured: false,
        ctaText: 'Start Free Trial',
        order: 1
      }
    },
    {
      data: {
        name: 'Professional',
        price: 79,
        period: 'month',
        description: 'Most popular choice for serious learners',
        features: [
          { text: 'Unlimited course access', included: true },
          { text: 'Priority email & chat support', included: true },
          { text: 'Community forum access', included: true },
          { text: 'Course completion certificates', included: true },
          { text: '2 hours monthly 1-on-1 mentoring', included: true },
          { text: 'Downloadable resources', included: true }
        ],
        featured: true,
        ctaText: 'Get Started',
        order: 2
      }
    },
    {
      data: {
        name: 'Enterprise',
        price: 199,
        period: 'month',
        description: 'For teams and organizations',
        features: [
          { text: 'Everything in Professional', included: true },
          { text: 'Dedicated account manager', included: true },
          { text: 'Custom learning paths', included: true },
          { text: 'Team analytics dashboard', included: true },
          { text: 'Unlimited mentoring', included: true },
          { text: 'API access', included: true }
        ],
        featured: false,
        ctaText: 'Contact Sales',
        order: 3
      }
    }
  ],

  // Job Postings
  jobPostings: [
    {
      data: {
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA (Remote)',
        type: 'Full-time',
        description: 'We are looking for an experienced React developer to join our growing team and help build the next generation of our products.',
        requirements: ['5+ years React experience', 'Redux/MobX expertise', 'TypeScript proficiency', 'Testing experience'],
        applyUrl: 'https://techcorp.com/careers/react-dev'
      }
    },
    {
      data: {
        title: 'Data Scientist',
        company: 'DataViz Solutions',
        location: 'New York, NY',
        type: 'Full-time',
        description: 'Join our data science team to work on cutting-edge machine learning projects that impact millions of users.',
        requirements: ['Python expertise', 'Machine Learning experience', 'SQL proficiency', 'Statistics background'],
        applyUrl: 'https://dataviz.com/careers/data-scientist'
      }
    },
    {
      data: {
        title: 'UX Designer',
        company: 'DesignHub',
        location: 'Remote',
        type: 'Contract',
        description: 'We need a talented UX designer for a 6-month project to redesign our flagship product.',
        requirements: ['Figma expertise', 'User Research skills', 'Prototyping experience', 'Design Systems knowledge'],
        applyUrl: 'https://designhub.com/careers/ux'
      }
    }
  ],

  // Career Resources
  careerResources: [
    {
      data: {
        title: 'Resume Template Pack',
        description: 'Professional resume templates optimized for ATS systems and tech roles',
        type: 'Template',
        downloadUrl: '/resources/resume-templates.pdf'
      }
    },
    {
      data: {
        title: 'Interview Preparation Guide',
        description: 'Complete guide to ace technical interviews with practice questions and tips',
        type: 'Guide',
        downloadUrl: '/resources/interview-guide.pdf'
      }
    },
    {
      data: {
        title: 'Salary Negotiation Handbook',
        description: 'Learn how to negotiate your worth and get the compensation you deserve',
        type: 'Handbook',
        downloadUrl: '/resources/salary-negotiation.pdf'
      }
    }
  ],

  // Single Types
  aboutPage: {
    data: {
      heroTitle: 'About AI Studio',
      heroSubtitle: 'Transforming careers through expert-led online education',
      missionTitle: 'Our Mission',
      missionDescription: 'To democratize access to high-quality technical education and empower individuals worldwide to build successful careers in technology. We believe that everyone deserves the opportunity to learn and grow, regardless of their background or location.',
      visionTitle: 'Our Vision',
      visionDescription: 'To become the leading online platform for professional development, helping millions achieve their career goals through innovative learning experiences. We envision a world where quality education is accessible to all.',
      values: [
        {
          icon: '🎯',
          title: 'Excellence',
          description: 'We strive for excellence in everything we do, from course content to student support'
        },
        {
          icon: '🤝',
          title: 'Community',
          description: 'Building a supportive learning community where students help each other succeed'
        },
        {
          icon: '💡',
          title: 'Innovation',
          description: 'Constantly innovating our teaching methods and platform features'
        },
        {
          icon: '🌍',
          title: 'Accessibility',
          description: 'Making education accessible to everyone, everywhere in the world'
        }
      ]
    }
  },

  contactPage: {
    data: {
      phone: '+1 (555) 123-4567',
      email: 'hello@aistudio.com',
      address: '123 Learning Street, Tech Valley, CA 94025, USA',
      officeHours: 'Monday - Friday: 9:00 AM - 6:00 PM PST',
      mapUrl: 'https://maps.google.com'
    }
  }
};

// Function to create content
async function populateContent() {
  console.log('🚀 Starting content population...\n');
  
  try {
    // Create Courses
    console.log('📚 Creating Courses...');
    for (const course of sampleData.courses) {
      try {
        const response = await api.post('/courses', course);
        console.log(`✅ Created course: ${course.data.title}`);
      } catch (error) {
        console.error(`❌ Failed to create course: ${course.data.title}`, error.response?.data?.error?.message || error.message);
      }
    }
    
    // Create Blog Posts
    console.log('\n📝 Creating Blog Posts...');
    for (const post of sampleData.blogPosts) {
      try {
        const response = await api.post('/blog-posts', post);
        console.log(`✅ Created blog post: ${post.data.title}`);
      } catch (error) {
        console.error(`❌ Failed to create blog post: ${post.data.title}`, error.response?.data?.error?.message || error.message);
      }
    }
    
    // Create Teachers
    console.log('\n👨‍🏫 Creating Teachers...');
    for (const teacher of sampleData.teachers) {
      try {
        const response = await api.post('/teachers', teacher);
        console.log(`✅ Created teacher: ${teacher.data.name}`);
      } catch (error) {
        console.error(`❌ Failed to create teacher: ${teacher.data.name}`, error.response?.data?.error?.message || error.message);
      }
    }
    
    // Create Pricing Plans
    console.log('\n💰 Creating Pricing Plans...');
    for (const plan of sampleData.pricingPlans) {
      try {
        const response = await api.post('/pricing-plans', plan);
        console.log(`✅ Created pricing plan: ${plan.data.name}`);
      } catch (error) {
        console.error(`❌ Failed to create pricing plan: ${plan.data.name}`, error.response?.data?.error?.message || error.message);
      }
    }
    
    // Create Job Postings
    console.log('\n💼 Creating Job Postings...');
    for (const job of sampleData.jobPostings) {
      try {
        const response = await api.post('/job-postings', job);
        console.log(`✅ Created job posting: ${job.data.title}`);
      } catch (error) {
        console.error(`❌ Failed to create job posting: ${job.data.title}`, error.response?.data?.error?.message || error.message);
      }
    }
    
    // Create Career Resources
    console.log('\n📄 Creating Career Resources...');
    for (const resource of sampleData.careerResources) {
      try {
        const response = await api.post('/career-resources', resource);
        console.log(`✅ Created career resource: ${resource.data.title}`);
      } catch (error) {
        console.error(`❌ Failed to create career resource: ${resource.data.title}`, error.response?.data?.error?.message || error.message);
      }
    }
    
    // Update About Page (Single Type)
    console.log('\nℹ️ Updating About Page...');
    try {
      const response = await api.put('/about-page', sampleData.aboutPage);
      console.log('✅ Updated About Page');
    } catch (error) {
      console.error('❌ Failed to update About Page', error.response?.data?.error?.message || error.message);
    }
    
    // Update Contact Page (Single Type)
    console.log('\n📞 Updating Contact Page...');
    try {
      const response = await api.put('/contact-page', sampleData.contactPage);
      console.log('✅ Updated Contact Page');
    } catch (error) {
      console.error('❌ Failed to update Contact Page', error.response?.data?.error?.message || error.message);
    }
    
    console.log('\n✨ Content population complete!');
    console.log('\n📊 Summary:');
    console.log(`  - ${sampleData.courses.length} Courses`);
    console.log(`  - ${sampleData.blogPosts.length} Blog Posts`);
    console.log(`  - ${sampleData.teachers.length} Teachers`);
    console.log(`  - ${sampleData.pricingPlans.length} Pricing Plans`);
    console.log(`  - ${sampleData.jobPostings.length} Job Postings`);
    console.log(`  - ${sampleData.careerResources.length} Career Resources`);
    console.log(`  - 2 Single Type Pages (About & Contact)`);
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Visit http://localhost:1337/admin to see the content');
    console.log('2. Open http://localhost:3005/cms-dashboard.html for overview');
    console.log('3. Browse the website to see live content integration');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️ Make sure:');
    console.log('1. Strapi is running on port 1337');
    console.log('2. API token is valid and has proper permissions');
    console.log('3. Content types are created and published');
  }
}

// Check if axios is installed
try {
  require.resolve('axios');
  // Run the population
  populateContent();
} catch(e) {
  console.log('📦 Installing axios...');
  const { execSync } = require('child_process');
  execSync('npm install axios', { stdio: 'inherit' });
  console.log('✅ Axios installed. Please run the script again.');
}