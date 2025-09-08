const puppeteer = require('puppeteer');

const homePageContent = {
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
};

async function autoPopulateHomePage() {
  console.log('🚀 Starting automated home page population...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Navigate to Strapi admin
    await page.goto('http://localhost:1337/admin/content-manager/single-types/api::home-page.home-page');
    
    console.log('📄 Navigated to Home Page editor');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Fill Hero Section
    console.log('🎯 Filling Hero Section...');
    await page.click('[data-testid="heroSection"] button'); // Click + button
    await page.waitForTimeout(1000);
    
    // Fill hero section fields
    await page.type('input[name="title"]', homePageContent.heroSection.title);
    await page.type('input[name="subtitle"]', homePageContent.heroSection.subtitle);
    await page.type('textarea[name="description"]', homePageContent.heroSection.description);
    await page.type('input[name="primaryButtonText"]', homePageContent.heroSection.primaryButtonText);
    await page.type('input[name="primaryButtonLink"]', homePageContent.heroSection.primaryButtonLink);
    await page.type('input[name="secondaryButtonText"]', homePageContent.heroSection.secondaryButtonText);
    await page.type('input[name="secondaryButtonLink"]', homePageContent.heroSection.secondaryButtonLink);
    
    await page.click('button[data-testid="confirm"]'); // Confirm hero section
    await page.waitForTimeout(1000);
    
    console.log('✅ Hero Section completed!');
    
    // Save and publish
    await page.click('button[data-testid="save"]');
    await page.waitForTimeout(2000);
    await page.click('button[data-testid="publish"]');
    
    console.log('🎉 Home Page populated and published successfully!');
    console.log('🔗 Check: http://localhost:1337/api/home-page?populate=*');
    
  } catch (error) {
    console.error('❌ Error during automation:', error.message);
  }
  
  await browser.close();
}

// Check if puppeteer is available
try {
  require.resolve('puppeteer');
  autoPopulateHomePage();
} catch (e) {
  console.log('📦 Installing puppeteer...');
  const { execSync } = require('child_process');
  execSync('npm install puppeteer', { stdio: 'inherit' });
  console.log('✅ Puppeteer installed, running automation...');
  autoPopulateHomePage();
}