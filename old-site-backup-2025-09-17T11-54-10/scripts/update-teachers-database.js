const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');

// Configuration
const API_URL = 'https://aistudio555jamstack-production.up.railway.app';
const TEACHERS_HTML_PATH = path.join(__dirname, '..', 'teachers.html');

// All teacher data extracted from HTML
const TEACHERS_DATA = [
  {
    name: "Sarah Chen",
    role: "Senior ML Engineer at Google",
    bio: "Leading ML engineer at Google with expertise in recommendation systems, natural language processing, and AutoML. Has deployed ML models serving billions of users.",
    linkedin: "https://linkedin.com/in/sarah-chen",
    twitter: "https://twitter.com/sarahchen",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=300&h=300&fit=crop&crop=face",
    order: 1
  },
  {
    name: "Michael Rodriguez",
    role: "AI Research Scientist at OpenAI",
    bio: "Research scientist at OpenAI working on large language models and reinforcement learning. Co-author of 25+ published papers in top-tier ML conferences.",
    linkedin: "https://linkedin.com/in/michael-rodriguez",
    twitter: "https://twitter.com/mrodriguez",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    order: 2
  },
  {
    name: "Elena Petrov",
    role: "Head of Data Science at Meta",
    bio: "Leads data science initiatives at Meta, focusing on user behavior modeling and content recommendation. Expert in scaling ML systems for social platforms.",
    linkedin: "https://linkedin.com/in/elena-petrov",
    twitter: "https://twitter.com/elenapetrov",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    order: 3
  },
  {
    name: "David Kim",
    role: "Computer Vision Engineer at Tesla",
    bio: "Computer vision expert at Tesla working on autonomous driving perception systems. Specializes in object detection, depth estimation, and real-time inference.",
    linkedin: "https://linkedin.com/in/david-kim",
    twitter: "https://twitter.com/davidkim",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    order: 4
  },
  {
    name: "Anna Kowalski",
    role: "NLP Engineer at Microsoft",
    bio: "Leading NLP engineer at Microsoft working on Azure Cognitive Services. Expert in transformer architectures, multilingual models, and conversational AI.",
    linkedin: "https://linkedin.com/in/anna-kowalski",
    twitter: "https://twitter.com/annakowalski",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    order: 5
  },
  {
    name: "James Wilson",
    role: "Principal Data Scientist at Amazon",
    bio: "Principal data scientist at Amazon leading customer analytics and forecasting models. Expert in statistical modeling, time series analysis, and business intelligence.",
    linkedin: "https://linkedin.com/in/james-wilson",
    twitter: "https://twitter.com/jameswilson",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    order: 6
  },
  {
    name: "Maria Santos",
    role: "Data Analytics Lead at Stripe",
    bio: "Data analytics lead at Stripe focusing on payment analytics and fraud detection. Expert in feature engineering, model deployment, and real-time analytics.",
    linkedin: "https://linkedin.com/in/maria-santos",
    twitter: "https://twitter.com/mariasantos",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    order: 7
  },
  {
    name: "Alex Thompson",
    role: "Senior Backend Engineer at Slack",
    bio: "Senior backend engineer at Slack building scalable messaging infrastructure. Expert in Python web frameworks, microservices architecture, and API design.",
    linkedin: "https://linkedin.com/in/alex-thompson",
    twitter: "https://twitter.com/alexthompson",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    order: 8
  },
  {
    name: "Lisa Zhang",
    role: "Python Architect at Twitter",
    bio: "Python architect at Twitter responsible for platform performance optimization. Expert in async programming, testing frameworks, and distributed systems.",
    linkedin: "https://linkedin.com/in/lisa-zhang",
    twitter: "https://twitter.com/lisazhang",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
    order: 9
  },
  {
    name: "Robert Johnson",
    role: "Full Stack Lead at Apple",
    bio: "Full stack lead at Apple working on developer tools and web platforms. Expert in React, Node.js, and modern web development practices.",
    linkedin: "https://linkedin.com/in/robert-johnson",
    twitter: "https://twitter.com/robertjohnson",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
    order: 10
  },
  {
    name: "Sofia Andersson",
    role: "Frontend Architect at Spotify",
    bio: "Frontend architect at Spotify building music streaming interfaces. Expert in React, Vue.js, performance optimization, and responsive design.",
    linkedin: "https://linkedin.com/in/sofia-andersson",
    twitter: "https://twitter.com/sofiaandersson",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    order: 11
  },
  {
    name: "Raj Patel",
    role: "Cloud Solutions Architect at AWS",
    bio: "Cloud solutions architect at AWS helping enterprises migrate to cloud. Expert in serverless architectures, container orchestration, and multi-cloud strategies.",
    linkedin: "https://linkedin.com/in/raj-patel",
    twitter: "https://twitter.com/rajpatel",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
    order: 12
  },
  {
    name: "Jennifer Wu",
    role: "DevOps Principal at GitHub",
    bio: "DevOps principal at GitHub building CI/CD infrastructure for millions of developers. Expert in Kubernetes, Docker, and infrastructure as code.",
    linkedin: "https://linkedin.com/in/jennifer-wu",
    twitter: "https://twitter.com/jenniferwu",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
    order: 13
  },
  {
    name: "Marcus Brown",
    role: "BI Director at Salesforce",
    bio: "Business intelligence director at Salesforce leading data visualization and analytics initiatives. Expert in Tableau, Power BI, and executive reporting.",
    linkedin: "https://linkedin.com/in/marcus-brown",
    twitter: "https://twitter.com/marcusbrown",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=300&fit=crop&crop=face",
    order: 14
  },
  {
    name: "Sarah Kim",
    role: "Senior Product Manager at Airbnb",
    bio: "Senior product manager at Airbnb leading host platform experiences. Expert in user research, A/B testing, and product strategy.",
    linkedin: "https://linkedin.com/in/sarah-kim",
    twitter: "https://twitter.com/sarahkim",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=300&fit=crop&crop=face",
    order: 15
  },
  {
    name: "Emma Davis",
    role: "Principal Designer at Adobe",
    bio: "Principal designer at Adobe working on Creative Cloud experiences. Expert in design systems, user interface patterns, and accessibility.",
    linkedin: "https://linkedin.com/in/emma-davis",
    twitter: "https://twitter.com/emmadavis",
    image: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=300&h=300&fit=crop&crop=face",
    order: 16
  }
];

// Update teachers using the bulk update API
async function updateTeachersAPI() {
  console.log('🚀 Starting Teachers Database Update');
  console.log(`📍 API URL: ${API_URL}`);
  console.log('=====================================\n');
  
  console.log(`📚 Total teachers to update: ${TEACHERS_DATA.length}`);
  
  // Update for each locale
  const locales = ['en', 'ru', 'he'];
  
  for (const locale of locales) {
    console.log(`\n🌍 Updating teachers for locale: ${locale}`);
    
    try {
      // Build the payload according to the API structure
      const payload = {};
      TEACHERS_DATA.forEach(teacher => {
        // Use order as key for the update
        payload[`teacher_${teacher.order}`] = {
          name: teacher.name,
          role: teacher.role,
          bio: teacher.bio,
          linkedin: teacher.linkedin,
          twitter: teacher.twitter,
          image: teacher.image,
          order: teacher.order,
          published_at: new Date().toISOString()
        };
      });
      
      // Send PUT request to update all teachers for this locale
      const response = await axios.put(
        `${API_URL}/api/teachers?locale=${locale}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`   ✅ Successfully updated ${TEACHERS_DATA.length} teachers for ${locale}`);
      
    } catch (error) {
      console.error(`   ❌ Error updating teachers for ${locale}:`, error.message);
      if (error.response) {
        console.error(`      Status: ${error.response.status}`);
        console.error(`      Data:`, error.response.data);
      }
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Verify the update
  console.log('\n🔍 Verifying update...');
  
  try {
    const response = await axios.get(`${API_URL}/api/teachers`);
    const teachers = response.data.data || [];
    
    console.log(`\n✅ Database now contains ${teachers.length} teachers`);
    
    if (teachers.length > 0) {
      console.log('\n📝 Current teachers in database:');
      teachers.forEach((teacher, index) => {
        console.log(`   ${index + 1}. ${teacher.attributes.name} - ${teacher.attributes.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error verifying update:', error.message);
  }
  
  // Save update report
  const report = {
    timestamp: new Date().toISOString(),
    target: API_URL,
    totalTeachers: TEACHERS_DATA.length,
    locales: locales,
    teachers: TEACHERS_DATA.map(t => ({
      name: t.name,
      role: t.role,
      order: t.order
    }))
  };
  
  const reportPath = path.join(__dirname, '..', 'teachers-update-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Update report saved to: ${reportPath}`);
}

// Run update
if (require.main === module) {
  updateTeachersAPI()
    .then(() => {
      console.log('\n✅ Teachers database update completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateTeachersAPI };