#!/usr/bin/env node

/**
 * Remote migration runner - Executes migration on production via API
 */

const https = require('https');

const API_BASE = 'https://aistudio555jamstack-production.up.railway.app';

// Migration data for teachers page
const teachersPageData = {
  sections: [
    {
      section_name: 'hero',
      content_en: {
        title: "Our Teachers",
        subtitle: "Meet Our Team",
        description: "Expert Instructors Dedicated to Your Success",
        intro: "Learn from industry professionals with years of real-world experience who are passionate about sharing their knowledge and helping you achieve your career goals.",
        breadcrumb_home: "Home",
        breadcrumb_current: "Teachers"
      }
    },
    {
      section_name: 'instructor_grid',
      content_en: {
        instructors: [
          {
            id: 1,
            name: "Sarah Chen",
            title: "Senior AI Engineer",
            expertise: "AI & Machine Learning",
            image: "images/CTA-Section-Bg.jpg",
            bio: "Senior AI Engineer with 8+ years of experience in machine learning and deep learning. Former Google AI researcher specializing in neural networks, NLP, and AI ethics. Passionate about making AI accessible through education.",
            extended_bio: "Sarah Chen brings over 8 years of cutting-edge experience in artificial intelligence and machine learning. As a former Google AI researcher, she has contributed to breakthrough projects in neural networks, natural language processing, and AI ethics. Her work has been published in top-tier conferences including NeurIPS and ICML. Sarah is passionate about democratizing AI education and has mentored over 100 students in their journey to becoming AI practitioners.",
            experience_years: "8+",
            specialties: ["Neural Networks", "NLP", "AI Ethics", "Deep Learning"],
            achievements: ["Published 15+ papers", "Google AI Innovation Award", "100+ students mentored"],
            blog_post_title: "The Future of AI in Education: Transforming How We Learn",
            social_links: {
              linkedin: "#",
              twitter: "#",
              github: "#"
            }
          },
          {
            id: 2,
            name: "Mike Johnson",
            title: "Lead Full-Stack Developer",
            expertise: "Web Development",
            image: "images/Course-Categories-Content-Bg.jpg",
            bio: "Lead Full-Stack Developer with 10+ years building scalable applications. Former senior developer at Netflix and Spotify. Expert in React, Node.js, Python, and cloud architecture. Mentored 200+ developers worldwide.",
            extended_bio: "Mike Johnson is a seasoned full-stack developer with over a decade of experience building scalable, high-performance applications. Having worked as a senior developer at Netflix and Spotify, he brings real-world expertise in handling millions of users and complex distributed systems. Mike specializes in React, Node.js, Python, and cloud architecture, with a deep understanding of both frontend and backend technologies.",
            experience_years: "10+",
            specialties: ["React", "Node.js", "Python", "Cloud Architecture"],
            achievements: ["Built systems serving 10M+ users", "200+ developers mentored", "Open source contributor"],
            blog_post_title: "Web Development Trends to Watch in 2024",
            social_links: {
              linkedin: "#",
              twitter: "#",
              github: "#"
            }
          },
          {
            id: 3,
            name: "Emily Rodriguez",
            title: "Career Transition Coach",
            expertise: "Career Development",
            image: "images/About-Me-Image.jpg",
            bio: "Career Transition Coach with 12+ years helping professionals enter tech. Former tech recruiter turned mentor. Successfully guided 500+ career changers into their dream roles at top companies like Apple, Microsoft, and startups.",
            extended_bio: "Emily Rodriguez is a dedicated career transition coach with over 12 years of experience helping professionals successfully pivot into tech careers. As a former tech recruiter for Fortune 500 companies, she has unique insights into what top companies look for in candidates. Emily has successfully guided over 500 career changers into their dream roles at companies like Apple, Microsoft, Amazon, and innovative startups.",
            experience_years: "12+",
            specialties: ["Career Coaching", "Interview Prep", "Resume Building", "Networking"],
            achievements: ["500+ successful transitions", "Former Fortune 500 recruiter", "Published career guide author"],
            blog_post_title: "5 Steps to Successfully Transition into Tech",
            social_links: {
              linkedin: "#",
              twitter: "#",
              website: "#"
            }
          },
          {
            id: 4,
            name: "David Park",
            title: "Senior Data Scientist",
            expertise: "Data Science",
            image: "images/About-Us-Image.png",
            bio: "PhD in Computer Science from Stanford. Senior Data Scientist with 9+ years at Uber and Airbnb. Expert in predictive modeling, big data systems, and ML infrastructure. Published researcher with 20+ papers in top ML conferences.",
            extended_bio: "Dr. David Park holds a PhD in Computer Science from Stanford University and brings over 9 years of industry experience as a Senior Data Scientist at Uber and Airbnb. His expertise spans predictive modeling, big data systems, and ML infrastructure. David has published over 20 papers in top machine learning conferences and has developed data systems that process billions of data points daily.",
            experience_years: "9+",
            specialties: ["Predictive Modeling", "Big Data", "ML Infrastructure", "Statistical Analysis"],
            achievements: ["PhD from Stanford", "20+ published papers", "Billions of data points processed"],
            blog_post_title: "Machine Learning for Beginners: Where to Start",
            social_links: {
              linkedin: "#",
              scholar: "#",
              github: "#"
            }
          }
        ]
      }
    },
    {
      section_name: 'stats_banner',
      content_en: {
        stats_text: "Join 10,000+ students • Learn from 50+ expert instructors • Access 200+ courses • Build real-world projects"
      }
    },
    {
      section_name: 'cta_section',
      content_en: {
        subtitle: "Start Learning Today",
        title: "Discover A World Of Learning Opportunities.",
        description: "Don't wait to transform your career and unlock your full potential. Join our community of passionate learners and gain access to a wide range of courses.",
        primary_button: {
          text: "Get in Touch",
          link: "contact-us.html"
        },
        secondary_button: {
          text: "Check Out Courses",
          link: "courses.html"
        },
        image_1: "images/CTA-Man-Image1.png",
        image_2: "images/CTA-Man-Image2_1CTA-Man-Image2.png"
      }
    }
  ]
};

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'aistudio555jamstack-production.up.railway.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(responseData);
          resolve(json);
        } catch (e) {
          resolve({ raw: responseData, error: e.message });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runMigration() {
  console.log('🚀 Starting Remote Migration');
  console.log('============================\n');

  try {
    // Update each section
    for (const section of teachersPageData.sections) {
      console.log(`📝 Updating section: ${section.section_name}`);

      const response = await makeRequest(
        `/api/nd/teachers-page/${section.section_name}`,
        'PUT',
        {
          content: section.content_en,
          locale: 'en'
        }
      );

      if (response.success) {
        console.log(`✅ ${section.section_name} updated successfully`);
      } else {
        console.log(`❌ ${section.section_name} update failed:`, response.error || response.message);
      }
    }

    // Test the endpoint
    console.log('\n🧪 Testing teachers page endpoint...');
    const testResponse = await makeRequest('/api/nd/teachers-page?locale=en', 'GET');

    if (testResponse.success && testResponse.data) {
      console.log(`✅ Teachers page API working! Found ${testResponse.data.length} sections`);
    } else {
      console.log('⚠️ Teachers page API response:', JSON.stringify(testResponse).substring(0, 200));
    }

    console.log('\n🎉 Migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

runMigration();