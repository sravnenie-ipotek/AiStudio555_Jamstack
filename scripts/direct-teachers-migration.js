const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Teacher data extracted from HTML - mapped to SQLite schema
const TEACHERS_DATA = [
  {
    name: "Sarah Chen",
    title: "Senior ML Engineer at Google", 
    bio: "Leading ML engineer at Google with expertise in recommendation systems, natural language processing, and AutoML. Has deployed ML models serving billions of users.",
    image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=300&h=300&fit=crop&crop=face",
    expertise: "Machine Learning, NLP, AutoML"
  },
  {
    name: "Michael Rodriguez",
    title: "AI Research Scientist at OpenAI",
    bio: "Research scientist at OpenAI working on large language models and reinforcement learning. Co-author of 25+ published papers in top-tier ML conferences.",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    expertise: "Large Language Models, Reinforcement Learning"
  },
  {
    name: "Elena Petrov",
    title: "Head of Data Science at Meta",
    bio: "Leads data science initiatives at Meta, focusing on user behavior modeling and content recommendation. Expert in scaling ML systems for social platforms.",
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    expertise: "User Behavior Modeling, Content Recommendation"
  },
  {
    name: "David Kim",
    title: "Computer Vision Engineer at Tesla",
    bio: "Computer vision expert at Tesla working on autonomous driving perception systems. Specializes in object detection, depth estimation, and real-time inference.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    expertise: "Computer Vision, Object Detection, Autonomous Driving"
  },
  {
    name: "Anna Kowalski", 
    title: "NLP Engineer at Microsoft",
    bio: "Leading NLP engineer at Microsoft working on Azure Cognitive Services. Expert in transformer architectures, multilingual models, and conversational AI.",
    image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    expertise: "NLP, Transformer Architectures, Conversational AI"
  },
  {
    name: "James Wilson",
    title: "Principal Data Scientist at Amazon", 
    bio: "Principal data scientist at Amazon leading customer analytics and forecasting models. Expert in statistical modeling, time series analysis, and business intelligence.",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    expertise: "Statistical Modeling, Time Series Analysis, Business Intelligence"
  },
  {
    name: "Maria Santos",
    title: "Data Analytics Lead at Stripe",
    bio: "Data analytics lead at Stripe focusing on payment analytics and fraud detection. Expert in feature engineering, model deployment, and real-time analytics.",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    expertise: "Payment Analytics, Fraud Detection, Feature Engineering"
  },
  {
    name: "Alex Thompson",
    title: "Senior Backend Engineer at Slack", 
    bio: "Senior backend engineer at Slack building scalable messaging infrastructure. Expert in Python web frameworks, microservices architecture, and API design.",
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    expertise: "Backend Engineering, Microservices, API Design"
  },
  {
    name: "Lisa Zhang",
    title: "Python Architect at Twitter",
    bio: "Python architect at Twitter responsible for platform performance optimization. Expert in async programming, testing frameworks, and distributed systems.",
    image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
    expertise: "Python Architecture, Performance Optimization, Distributed Systems"
  },
  {
    name: "Robert Johnson",
    title: "Full Stack Lead at Apple",
    bio: "Full stack lead at Apple working on developer tools and web platforms. Expert in React, Node.js, and modern web development practices.",
    image_url: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face",
    expertise: "Full Stack Development, React, Node.js"
  },
  {
    name: "Sofia Andersson",
    title: "Frontend Architect at Spotify", 
    bio: "Frontend architect at Spotify building music streaming interfaces. Expert in React, Vue.js, performance optimization, and responsive design.",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    expertise: "Frontend Architecture, React, Vue.js, Performance"
  },
  {
    name: "Raj Patel",
    title: "Cloud Solutions Architect at AWS",
    bio: "Cloud solutions architect at AWS helping enterprises migrate to cloud. Expert in serverless architectures, container orchestration, and multi-cloud strategies.",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
    expertise: "Cloud Architecture, Serverless, Container Orchestration"
  },
  {
    name: "Jennifer Wu",
    title: "DevOps Principal at GitHub",
    bio: "DevOps principal at GitHub building CI/CD infrastructure for millions of developers. Expert in Kubernetes, Docker, and infrastructure as code.",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
    expertise: "DevOps, Kubernetes, Docker, CI/CD"
  },
  {
    name: "Marcus Brown",
    title: "BI Director at Salesforce", 
    bio: "Business intelligence director at Salesforce leading data visualization and analytics initiatives. Expert in Tableau, Power BI, and executive reporting.",
    image_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=300&fit=crop&crop=face",
    expertise: "Business Intelligence, Data Visualization, Tableau"
  },
  {
    name: "Sarah Kim",
    title: "Senior Product Manager at Airbnb",
    bio: "Senior product manager at Airbnb leading host platform experiences. Expert in user research, A/B testing, and product strategy.",
    image_url: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=300&fit=crop&crop=face",
    expertise: "Product Management, User Research, A/B Testing"
  },
  {
    name: "Emma Davis", 
    title: "Principal Designer at Adobe",
    bio: "Principal designer at Adobe working on Creative Cloud experiences. Expert in design systems, user interface patterns, and accessibility.",
    image_url: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=300&h=300&fit=crop&crop=face",
    expertise: "Design Systems, UI Patterns, Accessibility"
  }
];

async function migrateTeachersDirectly() {
  console.log('🚀 Starting Direct Teachers Database Migration');
  console.log('=====================================\n');
  
  const dbPath = path.join(__dirname, '..', 'strapi-fresh', '.tmp', 'data.db');
  console.log(`📍 Database path: ${dbPath}`);
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Error connecting to database:', err);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
    });

    console.log('✅ Using existing teachers table schema');

    // Clear existing teachers
    db.run('DELETE FROM teachers', (err) => {
      if (err) {
        console.error('❌ Error clearing teachers table:', err);
        db.close();
        reject(err);
        return;
      }
      console.log('🧹 Cleared existing teachers');

      let insertedCount = 0;
      const insertPromises = [];

      // Insert each teacher
      TEACHERS_DATA.forEach((teacher, index) => {
        const insertPromise = new Promise((resolveInsert, rejectInsert) => {
          const query = `
            INSERT INTO teachers (name, title, bio, image_url, expertise, locale, published_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `;
          
          const values = [
            teacher.name,
            teacher.title, 
            teacher.bio,
            teacher.image_url,
            teacher.expertise
          ];

          db.run(query, values, function(err) {
            if (err) {
              console.error(`❌ Error inserting ${teacher.name}:`, err);
              rejectInsert(err);
            } else {
              console.log(`✅ Inserted ${teacher.name} (${teacher.title})`);
              insertedCount++;
              resolveInsert(this.lastID);
            }
          });
        });

        insertPromises.push(insertPromise);
      });

      // Wait for all inserts to complete
      Promise.all(insertPromises)
        .then(() => {
          console.log(`\n🎉 Successfully inserted ${insertedCount}/16 teachers`);
          
          // Verify the data
          db.all('SELECT name, title, expertise FROM teachers ORDER BY id ASC', (err, rows) => {
            if (err) {
              console.error('❌ Error verifying data:', err);
              db.close();
              reject(err);
              return;
            }

            console.log('\n📋 Verification - Teachers in database:');
            rows.forEach((row, index) => {
              console.log(`   ${index + 1}. ${row.name} - ${row.title} (${row.expertise})`);
            });

            console.log(`\n✅ Migration complete! Total teachers: ${rows.length}`);
            
            // Save migration report
            const report = {
              timestamp: new Date().toISOString(),
              target: 'local SQLite database',
              totalTeachers: rows.length,
              teachers: rows.map(row => ({
                name: row.name,
                title: row.title,
                expertise: row.expertise
              }))
            };
            
            const reportPath = path.join(__dirname, '..', 'teachers-direct-migration-report.json');
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`📄 Migration report saved to: ${reportPath}`);

            db.close((err) => {
              if (err) {
                console.error('❌ Error closing database:', err);
                reject(err);
              } else {
                console.log('🔒 Database connection closed');
                resolve(report);
              }
            });
          });
        })
        .catch((err) => {
          console.error('❌ Error during batch insert:', err);
          db.close();
          reject(err);
        });
    });
  });
}

// Run migration if called directly
if (require.main === module) {
  migrateTeachersDirectly()
    .then((report) => {
      console.log('\n🎯 TEACHERS MIGRATION COMPLETE!');
      console.log('=====================================');
      console.log(`✅ Successfully migrated ${report.totalTeachers} teachers`);
      console.log('✅ Database ready for QA testing');
      console.log('=====================================');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ MIGRATION FAILED:', error);
      process.exit(1);
    });
}

module.exports = { migrateTeachersDirectly };