// Simple script to populate HomePage content in Strapi admin

const DATABASE_PATH = '.tmp/data.db';

async function populateHomePage() {
  console.log('🔄 Populating HomePage content...');
  
  try {
    // Import Strapi after it's running
    const strapi = require('@strapi/strapi');
    const app = await strapi().start();
    
    // Create or update HomePage content
    const homePageData = {
      title: "AI Studio - Premier E-Learning Platform",
      heroTitle: "Transform Your Career with AI Education", 
      heroSubtitle: "Learn from Industry Experts in Machine Learning, Data Science & AI Development",
      heroSectionVisible: true,
      featuredCoursesTitle: "Most Popular IT Courses To Advance Your Career",
      featuredCoursesDescription: "Dive into our expertly curated selection of featured courses.",
      featuredCoursesVisible: true,
      course1Title: "Complete React Development Course",
      course1Rating: "4.9",
      course1Lessons: "48 Lessons",
      course1Duration: "12 Weeks",
      course1Category: "Web Dev",
      course1Visible: true
    };
    
    // Create or update the single type entry
    const existingHomePage = await strapi.db.query('api::home-page.home-page').findOne();
    
    if (existingHomePage) {
      await strapi.db.query('api::home-page.home-page').update({
        where: { id: existingHomePage.id },
        data: homePageData
      });
      console.log('✅ HomePage updated successfully!');
    } else {
      await strapi.db.query('api::home-page.home-page').create({
        data: homePageData
      });
      console.log('✅ HomePage created successfully!');
    }
    
    await strapi.destroy();
    console.log('🎉 Done! Refresh your admin panel to see the content.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

populateHomePage();