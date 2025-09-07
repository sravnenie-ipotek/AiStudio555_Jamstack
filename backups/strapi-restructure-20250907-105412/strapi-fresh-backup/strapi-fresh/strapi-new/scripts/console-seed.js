// Console script to seed home page content
// Run with: npm run strapi console < scripts/console-seed.js

(async () => {
  try {
    const homePageData = {
      heroSection: {
        subtitle: "Expert-Led Learning",
        title: "Unlock Potential With Proven Courses.",
        description: "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.",
        primaryButton: {
          label: "get in touch",
          url: "#contact",
          variant: "primary"
        }
      },
      heroSectionVisible: true,

      featuredCourses: {
        title: "Most Popular IT Courses To Advance Your Career.",
        description: "Dive into our expertly curated selection of featured courses.",
        courses: [
          {
            title: "Complete React Development Course",
            description: "Master React.js from basics to advanced concepts.",
            price: 299.99,
            duration: "12 weeks"
          },
          {
            title: "Python for Data Science & AI",
            description: "Learn Python with focus on data analysis and AI.",
            price: 399.99,
            duration: "16 weeks"
          }
        ]
      },
      featuredCoursesVisible: true,

      practiceFocus: {
        title: "85% Practice, 15% Theory - Real Skills That Matter",
        description: "We provide structured knowledge that's in demand.",
        practicePercentage: "85%",
        theoryPercentage: "15%"
      },
      practiceFocusVisible: true,

      onlineLearning: {
        title: "Learn From Anywhere, Anytime With Our Platform.",
        description: "Our online learning platform makes it easy.",
        totalLearners: "12103254",
        learnersLabel: "Total Happy Learners"
      },
      onlineLearningVisible: true,

      alumniReviews: {
        title: "Alumni Reviews",
        totalReviews: "1234 reviews",
        reviews: [
          {
            name: "Vyacheslav",
            role: "Android Developer",
            company: "Tech Solutions",
            review: "Completed the Android Development course. Great experience!"
          },
          {
            name: "Alexander",
            role: "Data Scientist", 
            company: "Analytics Corp",
            review: "Excellent training with practical skills."
          }
        ]
      },
      alumniReviewsVisible: true,

      faqSection: {
        title: "Frequently Asked Questions",
        faqs: [
          {
            question: "Q: What types of courses are available?",
            answer: "We offer comprehensive courses in all IT fields."
          },
          {
            question: "Q: How long does it take to complete?",
            answer: "Course duration varies from 3 to 6 months."
          }
        ]
      },
      faqSectionVisible: true,

      publishedAt: new Date().toISOString()
    };

    console.log('Seeding home page content...');
    
    // Check if exists
    const existing = await strapi.documents('api::home-page.home-page').findFirst({
      locale: 'en'
    });

    let result;
    if (existing) {
      console.log('Updating existing content...');
      result = await strapi.documents('api::home-page.home-page').update({
        documentId: existing.documentId,
        data: homePageData,
        locale: 'en'
      });
    } else {
      console.log('Creating new content...');
      result = await strapi.documents('api::home-page.home-page').create({
        data: homePageData,
        locale: 'en'
      });
    }

    if (result && result.documentId) {
      await strapi.documents('api::home-page.home-page').publish({
        documentId: result.documentId,
        locale: 'en'
      });
      console.log('✅ Content published successfully!');
    }

    console.log('✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();