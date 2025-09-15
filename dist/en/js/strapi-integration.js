/**
 * Strapi Frontend Integration
 * Handles dynamic content loading and live preview
 */

class StrapiIntegration {
  constructor() {
    this.strapiUrl = 'http://localhost:1337';
    this.apiToken = '6ba76f584778637fd308f48aac27461c1aca7f088c963d614ad2e73bb7f3f9a646ad9e38cf12e5bd8f7e6f8e0ad2f014ea90ee088bb8a3c3c84a40f9fb0c592e5c8b05e8d25c09f4a9c0b685b2c90bacd5e604fbe4e1b01e0a6e32c76e7e93b1f21e5e47dcad5e80a6b0cf967e2a38b74f5edd19e92f5c0e6d387e1c16e5ce59';
    this.currentLocale = this.getLocale();
    this.isPreviewMode = this.checkPreviewMode();
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    console.log('🚀 Initializing Strapi Integration');
    
    // Load dynamic content
    this.loadPageContent();
    
    // Set up live preview if in preview mode
    if (this.isPreviewMode) {
      this.initLivePreview();
    }
    
    // Set up language switcher
    this.setupLanguageSwitcher();
  }

  getLocale() {
    const params = new URLSearchParams(window.location.search);
    const locale = params.get('locale') || localStorage.getItem('locale') || 'en';
    
    // Apply RTL for Hebrew
    if (locale === 'he') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
    }
    
    return locale;
  }

  checkPreviewMode() {
    const params = new URLSearchParams(window.location.search);
    return params.has('preview') || params.has('edit');
  }

  async loadPageContent() {
    try {
      const pageName = this.getPageName();
      const content = await this.fetchPageContent(pageName);
      
      if (content) {
        this.applyContent(content);
      }
    } catch (error) {
      console.error('Error loading page content:', error);
    }
  }

  getPageName() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html' || path === '/home.html') {
      return 'home-page';
    }
    if (path.includes('courses')) {
      return 'courses-page';
    }
    if (path.includes('about')) {
      return 'about-page';
    }
    return 'home-page';
  }

  async fetchPageContent(pageName) {
    try {
      const response = await fetch(
        `${this.strapiUrl}/api/${pageName}?locale=${this.currentLocale}&populate=deep`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data?.attributes;
    } catch (error) {
      console.warn('Could not fetch content from Strapi:', error.message);
      return null;
    }
  }

  applyContent(content) {
    // Apply hero section content
    if (content.hero) {
      this.applyHeroContent(content.hero);
    }
    
    // Apply featured courses
    if (content.featuredCourses) {
      this.applyFeaturedCoursesContent(content.featuredCourses);
    }
    
    // Apply focus on practice
    if (content.focusOnPractice) {
      this.applyPracticeFocusContent(content.focusOnPractice);
    }
    
    // Apply online learning
    if (content.onlineLearning) {
      this.applyOnlineLearningContent(content.onlineLearning);
    }
    
    // Apply FAQ
    if (content.faq) {
      this.applyFaqContent(content.faq);
    }
  }

  applyHeroContent(hero) {
    // Update hero title
    const titleElement = document.querySelector('h1.banner-heading');
    if (titleElement && hero.title) {
      titleElement.textContent = hero.title;
    }
    
    // Update subtitle
    const subtitleElement = document.querySelector('.banner-subtitle');
    if (subtitleElement && hero.subtitle) {
      subtitleElement.textContent = hero.subtitle;
    }
    
    // Update description
    const descriptionElement = document.querySelector('p.banner-description-text');
    if (descriptionElement && hero.description) {
      descriptionElement.textContent = hero.description;
    }
    
    // Update primary button
    const primaryButton = document.querySelector('.banner-button-wrapper a:first-child .primary-button-text-block');
    if (primaryButton && hero.primaryButtonText) {
      primaryButton.textContent = hero.primaryButtonText;
    }
    
    // Update secondary button
    const secondaryButton = document.querySelector('.banner-button-wrapper a:last-child .primary-button-text-block');
    if (secondaryButton && hero.secondaryButtonText) {
      secondaryButton.textContent = hero.secondaryButtonText;
    }
  }

  applyFeaturedCoursesContent(featuredCourses) {
    // Update section title
    const titleElement = document.querySelector('.featured-courses h2.section-title');
    if (titleElement && featuredCourses.sectionTitle) {
      titleElement.textContent = featuredCourses.sectionTitle;
    }
    
    // Update section subtitle
    const subtitleElement = document.querySelector('.featured-courses .section-subtitle');
    if (subtitleElement && featuredCourses.sectionSubtitle) {
      subtitleElement.textContent = featuredCourses.sectionSubtitle;
    }
    
    // Update section description
    const descriptionElement = document.querySelector('.featured-courses p.section-description-text');
    if (descriptionElement && featuredCourses.sectionDescription) {
      descriptionElement.textContent = featuredCourses.sectionDescription;
    }
    
    // Load courses if available
    if (featuredCourses.courses?.data) {
      this.renderCourses(featuredCourses.courses.data);
    }
  }

  applyPracticeFocusContent(practiceFocus) {
    // Update section title
    const titleElement = document.querySelector('.why-choose-us h2.section-title');
    if (titleElement && practiceFocus.title) {
      titleElement.textContent = practiceFocus.title;
    }
    
    // Update section subtitle
    const subtitleElement = document.querySelector('.why-choose-us .section-subtitle');
    if (subtitleElement && practiceFocus.subtitle) {
      subtitleElement.textContent = practiceFocus.subtitle;
    }
    
    // Update section description
    const descriptionElement = document.querySelector('.why-choose-us p.section-description-text');
    if (descriptionElement && practiceFocus.description) {
      descriptionElement.textContent = practiceFocus.description;
    }
    
    // Update percentages
    if (practiceFocus.practicePercentage) {
      const practiceElement = document.querySelector('.why-choose-us-counter-single:nth-child(1) .why-choose-us-counter-number');
      if (practiceElement) {
        practiceElement.textContent = `${practiceFocus.practicePercentage}%`;
      }
    }
    
    if (practiceFocus.theoryPercentage) {
      const theoryElement = document.querySelector('.why-choose-us-counter-single:nth-child(2) .why-choose-us-counter-number');
      if (theoryElement) {
        theoryElement.textContent = `${practiceFocus.theoryPercentage}%`;
      }
    }
  }

  applyOnlineLearningContent(onlineLearning) {
    // Update section title
    const titleElement = document.querySelector('.about-us h2.section-title');
    if (titleElement && onlineLearning.title) {
      titleElement.textContent = onlineLearning.title;
    }
    
    // Update section subtitle
    const subtitleElement = document.querySelector('.about-us .section-subtitle');
    if (subtitleElement && onlineLearning.subtitle) {
      subtitleElement.textContent = onlineLearning.subtitle;
    }
    
    // Update section description
    const descriptionElement = document.querySelector('.about-us p.section-description-text');
    if (descriptionElement && onlineLearning.description) {
      descriptionElement.textContent = onlineLearning.description;
    }
    
    // Update instructor name
    const instructorNameElement = document.querySelector('h4.about-us-name');
    if (instructorNameElement && onlineLearning.instructorName) {
      instructorNameElement.textContent = onlineLearning.instructorName;
    }
    
    // Update instructor bio
    const instructorBioElement = document.querySelector('p.about-us-description-text');
    if (instructorBioElement && onlineLearning.instructorBio) {
      instructorBioElement.textContent = onlineLearning.instructorBio;
    }
  }

  applyFaqContent(faq) {
    // Update section title
    const titleElement = document.querySelector('.faq h2.section-title');
    if (titleElement && faq.title) {
      titleElement.textContent = faq.title;
    }
    
    // Update section subtitle
    const subtitleElement = document.querySelector('.faq .section-subtitle');
    if (subtitleElement && faq.subtitle) {
      subtitleElement.textContent = faq.subtitle;
    }
    
    // Update section description
    const descriptionElement = document.querySelector('p.faq-section-description-text');
    if (descriptionElement && faq.description) {
      descriptionElement.textContent = faq.description;
    }
    
    // Load FAQs if available
    if (faq.faqs?.data) {
      this.renderFaqs(faq.faqs.data);
    }
  }

  async renderCourses(courses) {
    // This would render the course cards dynamically
    // For now, we'll just update the existing course cards with data
    const courseCards = document.querySelectorAll('.featured-courses-collection-item');
    
    courses.slice(0, courseCards.length).forEach((course, index) => {
      const card = courseCards[index];
      if (!card) return;
      
      const attributes = course.attributes;
      
      // Update course name
      const nameElement = card.querySelector('.featured-courses-name');
      if (nameElement && attributes.title) {
        nameElement.textContent = attributes.title;
      }
      
      // Update rating
      const ratingElement = card.querySelector('.featured-courses-rating-text');
      if (ratingElement && attributes.rating) {
        ratingElement.textContent = attributes.rating.toFixed(1);
      }
      
      // Update lessons count
      const lessonsElement = card.querySelector('.courses-video-session-time-text');
      if (lessonsElement && attributes.lessons) {
        lessonsElement.textContent = `${attributes.lessons} Lessons`;
      }
      
      // Update duration
      const durationElements = card.querySelectorAll('.courses-video-session-time-text');
      if (durationElements[1] && attributes.duration) {
        durationElements[1].textContent = `${attributes.duration} ${attributes.durationUnit || 'Weeks'}`;
      }
      
      // Update category tag
      const categoryElement = card.querySelector('.featured-courses-categories-tag');
      if (categoryElement && attributes.category) {
        categoryElement.textContent = attributes.category;
      }
      
      // Update thumbnail if available
      const imageElement = card.querySelector('.featured-courses-image');
      if (imageElement && attributes.thumbnail?.data?.attributes?.url) {
        imageElement.src = `${this.strapiUrl}${attributes.thumbnail.data.attributes.url}`;
      }
    });
  }

  async renderFaqs(faqs) {
    const faqContainer = document.querySelector('.faq-accordion-wrapper');
    if (!faqContainer) return;
    
    // Sort FAQs by order
    const sortedFaqs = faqs.sort((a, b) => a.attributes.order - b.attributes.order);
    
    // Update existing FAQ items
    const faqItems = faqContainer.querySelectorAll('.single-faq-accordion-wrap');
    
    sortedFaqs.slice(0, faqItems.length).forEach((faq, index) => {
      const item = faqItems[index];
      if (!item) return;
      
      const attributes = faq.attributes;
      
      // Update question
      const questionElement = item.querySelector('.faq-question');
      if (questionElement && attributes.question) {
        questionElement.textContent = `Q: ${attributes.question}`;
      }
      
      // Update answer
      const answerElement = item.querySelector('.faq-answer');
      if (answerElement && attributes.answer) {
        answerElement.textContent = attributes.answer;
      }
    });
  }

  initLivePreview() {
    console.log('👁️ Initializing live preview mode');
    
    // Add preview mode class
    document.body.classList.add('preview-mode');
    
    // Connect to WebSocket for live updates
    this.connectWebSocket();
    
    // Add visual indicators for editable areas
    this.highlightEditableAreas();
    
    // Enable click-to-edit functionality
    this.enableClickToEdit();
  }

  connectWebSocket() {
    // Import Socket.IO client if available
    if (typeof io !== 'undefined') {
      this.socket = io(this.strapiUrl);
      
      this.socket.on('content-update', (data) => {
        console.log('📝 Content update received:', data);
        this.handleContentUpdate(data);
      });
      
      console.log('✓ WebSocket connected');
    }
  }

  handleContentUpdate(data) {
    if (data.page === this.getPageName() && data.locale === this.currentLocale) {
      // Apply the updated content
      this.applyContent(data.content);
      
      // Add update animation
      this.animateUpdate(data.section);
    }
  }

  animateUpdate(sectionId) {
    const section = document.querySelector(`.${sectionId}`);
    if (section) {
      section.classList.add('content-updating');
      setTimeout(() => {
        section.classList.remove('content-updating');
      }, 1000);
    }
  }

  highlightEditableAreas() {
    const editableSelectors = [
      'h1.banner-heading',
      '.banner-subtitle',
      'p.banner-description-text',
      'h2.section-title',
      '.section-description-text',
      '.featured-courses-name',
      '.faq-question',
      '.faq-answer',
      '.about-us-name',
      '.about-us-description-text'
    ];
    
    editableSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.classList.add('editable-highlight');
        el.setAttribute('data-editable', 'true');
        el.setAttribute('title', 'Click to edit in CMS');
      });
    });
  }

  enableClickToEdit() {
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-editable')) {
        e.preventDefault();
        
        const selector = this.getUniqueSelector(e.target);
        const currentValue = e.target.textContent;
        
        // Send message to parent window if in iframe
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'edit-field',
            selector: selector,
            currentValue: currentValue
          }, this.strapiUrl);
        }
        
        console.log('Edit field:', selector, currentValue);
      }
    });
  }

  getUniqueSelector(element) {
    const path = [];
    let el = element;
    
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      let selector = el.nodeName.toLowerCase();
      
      if (el.id) {
        selector = '#' + el.id;
        path.unshift(selector);
        break;
      } else if (el.className) {
        selector += '.' + el.className.split(' ').filter(c => c && !c.includes('editable')).join('.');
      }
      
      path.unshift(selector);
      el = el.parentNode;
    }
    
    return path.join(' > ');
  }

  setupLanguageSwitcher() {
    // Create language switcher if it doesn't exist
    const existingSwitcher = document.querySelector('.language-switcher');
    if (!existingSwitcher && this.isPreviewMode) {
      const switcher = document.createElement('div');
      switcher.className = 'language-switcher';
      switcher.innerHTML = `
        <button data-locale="en" class="${this.currentLocale === 'en' ? 'active' : ''}">🇬🇧 EN</button>
        <button data-locale="ru" class="${this.currentLocale === 'ru' ? 'active' : ''}">🇷🇺 RU</button>
        <button data-locale="he" class="${this.currentLocale === 'he' ? 'active' : ''}">🇮🇱 HE</button>
      `;
      
      switcher.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        z-index: 9999;
        display: flex;
        gap: 5px;
        background: white;
        padding: 5px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      `;
      
      document.body.appendChild(switcher);
      
      // Add click handlers
      switcher.addEventListener('click', (e) => {
        if (e.target.dataset.locale) {
          this.switchLocale(e.target.dataset.locale);
        }
      });
    }
  }

  switchLocale(locale) {
    // Update URL parameters
    const url = new URL(window.location);
    url.searchParams.set('locale', locale);
    
    // Store in localStorage
    localStorage.setItem('locale', locale);
    
    // Reload page with new locale
    window.location.href = url.toString();
  }
}

// Initialize Strapi Integration
window.strapiIntegration = new StrapiIntegration();