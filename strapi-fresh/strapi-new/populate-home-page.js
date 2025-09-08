const strapi = require('@strapi/strapi');

async function populateHomePage() {
  const strapiInstance = strapi({
    distDir: './dist',
  });
  
  await strapiInstance.load();
  
  try {
    // Create home page content
    const homePageData = {
      heroSection: {
        title: "Unlock Potential With Proven Courses.",
        subtitle: "Expert-Led Learning",
        description: "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.",
        primaryButtonText: "Start Learning Today",
        primaryButtonLink: "/courses",
        secondaryButtonText: "View Success Stories", 
        secondaryButtonLink: "/testimonials"
      },
      featuredCourses: {
        sectionTitle: "Most Popular IT Courses To Advance Your Career.",
        sectionSubtitle: "Most Popular IT Courses",
        sectionDescription: "Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.",
        showAllCoursesButton: true,
        allCoursesButtonText: "Uncover All Courses"
      },
      practiceFocus: {
        title: "85% Practice, 15% Theory - Real Skills That Matter",
        subtitle: "Focus on Practice", 
        description: "We provide structured knowledge that's in demand in today's job market. No fluff in our teaching - only hands-on experience and real-world projects.",
        practicePercentage: 85,
        theoryPercentage: 15,
        jobSupportPercentage: 100
      },
      onlineLearning: {
        title: "Learn From Anywhere, Anytime With Our Platform.",
        subtitle: "Online Learning",
        description: "Our online learning platform makes it easy to access world-class education from the comfort of your home. Learn at your own pace with expert instructors and interactive course materials.",
        totalCourses: "20+",
        totalLearners: "14K+",
        yearsExperience: "8+",
        instructorName: "Mrs. Sarah Johnson",
        instructorTitle: "Expert Mentor In Technology",
        achievements: "She has received prestigious honors \"Top Educator\" award and the \"Teaching Excellence\" award."
      },
      alumniReviews: {
        sectionTitle: "Alumni Reviews",
        sectionSubtitle: "Student Success Stories",
        sectionDescription: "Real feedback from our graduates who have successfully transformed their careers through our courses.",
        overallRating: 4.9,
        trustpilotRating: 4.9,
        googleRating: 4.8,
        showMoreReviewsButton: true,
        moreReviewsButtonText: "View All Reviews",
        moreReviewsButtonLink: "/reviews"
      },
      faqSection: {
        title: "Frequently Asked Questions",
        subtitle: "FAQ & Answer",
        description: "Find answers to the most common questions about our courses, learning platform, and support services.",
        ctaButtonText: "get in touch",
        ctaButtonLink: "contact-us.html"
      },
      publishedAt: new Date()
    };
    
    // Check if home page already exists
    const existingHomePage = await strapi.entityService.findMany('api::home-page.home-page');
    
    if (existingHomePage) {
      // Update existing
      const updated = await strapi.entityService.update('api::home-page.home-page', existingHomePage.id, {
        data: homePageData
      });
      console.log('✅ Home Page updated successfully!', updated);
    } else {
      // Create new
      const created = await strapi.entityService.create('api::home-page.home-page', {
        data: homePageData
      });
      console.log('✅ Home Page created successfully!', created);
    }
    
  } catch (error) {
    console.error('❌ Error populating home page:', error);
  }
  
  await strapiInstance.destroy();
  process.exit(0);
}

populateHomePage();