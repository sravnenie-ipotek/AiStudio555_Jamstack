#!/usr/bin/env node

const { execSync } = require('child_process');

// First, ensure Strapi is running
console.log('🌱 Seeding home page content...');

const homePageData = {
  data: {
    title: "AI Studio - Learn Programming with AI",
    heroSection: {
      title: "Unlock Potential With Proven Courses.",
      subtitle: "Expert-Led Learning", 
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
      courses: []
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
      subtitle: "Student Success Stories",
      totalReviews: "1234 reviews",
      reviews: []
    },
    alumniReviewsVisible: true,
    
    faqSection: {
      title: "Frequently Asked Questions",
      subtitle: "FAQ & Answer", 
      faqs: []
    },
    faqSectionVisible: true
  }
};

try {
  // Create or update the home page content via API
  const response = execSync(`curl -s -X PUT -H "Content-Type: application/json" -d '${JSON.stringify(homePageData)}' http://localhost:1337/api/home-page`, { encoding: 'utf-8' });
  
  console.log('📝 Response:', response);
  console.log('✅ Home page content seeded successfully!');
  console.log('\n🔗 You can now access:');  
  console.log('   - Strapi Admin: http://localhost:1337/admin');
  console.log('   - Home Page API: http://localhost:1337/api/home-page');
  console.log('   - Website: http://localhost:8000/home.html');

} catch (error) {
  console.error('❌ Error seeding data:', error.message);
  console.log('\n💡 Make sure Strapi is running: npm run develop');
}