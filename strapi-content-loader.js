/**
 * Strapi Content Loader for Home Page
 * Fetches all content from Strapi CMS and updates the page dynamically
 */

class StrapiContentLoader {
  constructor() {
    this.strapiUrl = 'https://aistudio555jamstack-production.up.railway.app';
    this.homePageEndpoint = '/api/home-page';
    this.init();
  }

  async init() {
    console.log('🚀 Loading content from Strapi CMS...');
    await this.loadHomePageContent();
    console.log('✅ Content loaded successfully!');
  }

  async loadHomePageContent() {
    try {
      const response = await fetch(this.strapiUrl + this.homePageEndpoint);
      const data = await response.json();

      if (data.error) {
        console.error('❌ Error loading content:', data.error);
        console.log('Using default content from HTML...');
        return;
      }

      if (data.data && data.data.attributes) {
        this.applyContent(data.data.attributes);
      }
      
    } catch (error) {
      console.error('❌ Error fetching content:', error);
      console.log('💡 Make sure Strapi is running and home-page permissions are set to public');
    }
  }

  applyContent(content) {
    console.log('📝 Applying content to page...');
    
    // Hero Section
    if (content.heroSection) {
      this.updateHeroSection(content.heroSection);
    }
    if (content.heroSectionVisible === false) {
      document.querySelector('.section.banner')?.setAttribute('style', 'display: none');
    }

    // Featured Courses Section  
    if (content.featuredCourses) {
      this.updateFeaturedCourses(content.featuredCourses);
    }
    if (content.featuredCoursesVisible === false) {
      document.querySelector('.section.featured-courses')?.setAttribute('style', 'display: none');
    }

    // Practice Focus Section
    if (content.practiceFocus) {
      this.updatePracticeFocus(content.practiceFocus);
    }
    if (content.practiceFocusVisible === false) {
      document.querySelector('.section.practice-focus')?.setAttribute('style', 'display: none');
    }

    // Online Learning Section
    if (content.onlineLearning) {
      this.updateOnlineLearning(content.onlineLearning);
    }
    if (content.onlineLearningVisible === false) {
      document.querySelector('.section.online-learning')?.setAttribute('style', 'display: none');
    }

    // Alumni Reviews Section
    if (content.alumniReviews) {
      this.updateAlumniReviews(content.alumniReviews);
    }
    if (content.alumniReviewsVisible === false) {
      document.querySelector('.section.alumni-reviews')?.setAttribute('style', 'display: none');
    }

    // FAQ Section
    if (content.faqSection) {
      this.updateFAQSection(content.faqSection);
    }
    if (content.faqSectionVisible === false) {
      document.querySelector('.section.faq-section')?.setAttribute('style', 'display: none');
    }
  }

  updateHeroSection(hero) {
    // Update subtitle
    const subtitle = document.querySelector('.banner-content .subtitle');
    if (subtitle && hero.subtitle) {
      subtitle.textContent = hero.subtitle;
    }

    // Update main heading
    const heading = document.querySelector('.banner-content h1');
    if (heading && hero.title) {
      heading.textContent = hero.title;
    }

    // Update description
    const description = document.querySelector('.banner-content p');
    if (description && hero.description) {
      description.textContent = hero.description;
    }

    // Update button text
    const button = document.querySelector('.banner-content .button');
    if (button && hero.primaryButton?.label) {
      button.textContent = hero.primaryButton.label;
    }
  }

  updateFeaturedCourses(courses) {
    // Update section title
    const sectionTitle = document.querySelector('.featured-courses-header h2');
    if (sectionTitle && courses.title) {
      sectionTitle.textContent = courses.title;
    }

    // Update section description
    const sectionDesc = document.querySelector('.featured-courses-header p');
    if (sectionDesc && courses.description) {
      sectionDesc.textContent = courses.description;
    }

    // Update course cards if data is available
    if (courses.courses && Array.isArray(courses.courses)) {
      const courseCards = document.querySelectorAll('.course-card');
      courses.courses.forEach((course, index) => {
        if (courseCards[index]) {
          const card = courseCards[index];
          
          // Update course title
          const title = card.querySelector('.course-title, h3');
          if (title) title.textContent = course.title;

          // Update course description
          const desc = card.querySelector('.course-description, p');
          if (desc) desc.textContent = course.description;

          // Update price
          const price = card.querySelector('.price');
          if (price) price.textContent = `$${course.price}`;

          // Update duration
          const duration = card.querySelector('.duration');
          if (duration) duration.textContent = course.duration;
        }
      });
    }
  }

  updatePracticeFocus(practice) {
    // Update title
    const title = document.querySelector('.practice-focus h2');
    if (title && practice.title) {
      title.textContent = practice.title;
    }

    // Update description
    const desc = document.querySelector('.practice-focus .description');
    if (desc && practice.description) {
      desc.textContent = practice.description;
    }

    // Update percentages
    const practicePercent = document.querySelector('.practice-percentage');
    if (practicePercent && practice.practicePercentage) {
      practicePercent.textContent = practice.practicePercentage;
    }

    const theoryPercent = document.querySelector('.theory-percentage');
    if (theoryPercent && practice.theoryPercentage) {
      theoryPercent.textContent = practice.theoryPercentage;
    }

    // Update skills section
    const skillsTitle = document.querySelector('.skills-section h3');
    if (skillsTitle && practice.skillsTitle) {
      skillsTitle.textContent = practice.skillsTitle;
    }

    // Update individual skills
    if (practice.skills && Array.isArray(practice.skills)) {
      const skillItems = document.querySelectorAll('.skill-item');
      practice.skills.forEach((skill, index) => {
        if (skillItems[index]) {
          const item = skillItems[index];
          
          const title = item.querySelector('h4, .skill-title');
          if (title) title.textContent = skill.title;

          const desc = item.querySelector('p, .skill-description');
          if (desc) desc.textContent = skill.description;
        }
      });
    }
  }

  updateOnlineLearning(online) {
    // Update title
    const title = document.querySelector('.online-learning h2');
    if (title && online.title) {
      title.textContent = online.title;
    }

    // Update description
    const desc = document.querySelector('.online-learning .description');
    if (desc && online.description) {
      desc.textContent = online.description;
    }

    // Update learners count
    const count = document.querySelector('.learners-count');
    if (count && online.totalLearners) {
      count.textContent = online.totalLearners;
    }

    // Update learners label
    const label = document.querySelector('.learners-label');
    if (label && online.learnersLabel) {
      label.textContent = online.learnersLabel;
    }

    // Update about description
    const aboutDesc = document.querySelector('.about-description');
    if (aboutDesc && online.aboutDescription) {
      aboutDesc.textContent = online.aboutDescription;
    }
  }

  updateAlumniReviews(alumni) {
    // Update section title
    const title = document.querySelector('.alumni-reviews h2');
    if (title && alumni.title) {
      title.textContent = alumni.title;
    }

    // Update subtitle
    const subtitle = document.querySelector('.alumni-reviews .subtitle');
    if (subtitle && alumni.subtitle) {
      subtitle.textContent = alumni.subtitle;
    }

    // Update reviews count
    const reviewsCount = document.querySelector('.reviews-count');
    if (reviewsCount && alumni.totalReviews) {
      reviewsCount.textContent = alumni.totalReviews;
    }

    // Update individual reviews
    if (alumni.reviews && Array.isArray(alumni.reviews)) {
      const reviewCards = document.querySelectorAll('.review-card, .testimonial-card');
      alumni.reviews.forEach((review, index) => {
        if (reviewCards[index]) {
          const card = reviewCards[index];
          
          // Update name
          const name = card.querySelector('.reviewer-name, h4');
          if (name) name.textContent = review.name;

          // Update review text
          const text = card.querySelector('.review-text, p');
          if (text) text.textContent = review.review;

          // Update role
          const role = card.querySelector('.reviewer-role');
          if (role) role.textContent = review.role;

          // Update company
          const company = card.querySelector('.reviewer-company');
          if (company) company.textContent = review.company;
        }
      });
    }
  }

  updateFAQSection(faq) {
    // Update section title
    const title = document.querySelector('.faq-section h2');
    if (title && faq.title) {
      title.textContent = faq.title;
    }

    // Update section subtitle
    const subtitle = document.querySelector('.faq-section .subtitle');
    if (subtitle && faq.subtitle) {
      subtitle.textContent = faq.subtitle;
    }

    // Update FAQ items
    if (faq.faqs && Array.isArray(faq.faqs)) {
      const faqItems = document.querySelectorAll('.faq-item');
      faq.faqs.forEach((item, index) => {
        if (faqItems[index]) {
          const faqElement = faqItems[index];
          
          // Update question
          const question = faqElement.querySelector('.faq-question, h3');
          if (question) question.textContent = item.question;

          // Update answer
          const answer = faqElement.querySelector('.faq-answer, p');
          if (answer) answer.textContent = item.answer;
        }
      });
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.strapiContent = new StrapiContentLoader();
  });
} else {
  window.strapiContent = new StrapiContentLoader();
}

// Console helper functions
console.log('💡 Strapi Content Loader initialized');
console.log('   Use window.strapiContent.loadHomePageContent() to refresh content');
console.log('   Content will auto-load from Strapi CMS if available');