const axios = require('axios');

async function populateHomePage() {
  const baseURL = 'http://localhost:1337/api';
  
  // Home page data from home.html
  const homePageData = {
    data: {
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
      }
    }
  };

  try {
    // First check if home page exists
    const checkResponse = await axios.get(`${baseURL}/home-page`).catch(() => null);
    
    let response;
    if (checkResponse && checkResponse.data) {
      // Update existing
      response = await axios.put(`${baseURL}/home-page`, homePageData);
      console.log('✅ Home Page updated successfully!');
    } else {
      // Create new  
      response = await axios.post(`${baseURL}/home-page`, homePageData);
      console.log('✅ Home Page created successfully!');
    }
    
    console.log('📄 Home Page ID:', response.data.data?.id);
    console.log('🚀 View at: http://localhost:1337/api/home-page?populate=*');
    
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Network Error:', error.message);
    }
  }
}

// Check if axios is available
try {
  require.resolve('axios');
  populateHomePage();
} catch (e) {
  console.log('Installing axios...');
  const { execSync } = require('child_process');
  execSync('npm install axios', { stdio: 'inherit' });
  populateHomePage();
}