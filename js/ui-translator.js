// ULTRATHINK: UI Translator - Updates all UI elements with database translations
// This script consumes the new UI fields from the API and updates the frontend

class UITranslator {
  constructor() {
    this.apiBase = window.location.hostname.includes('localhost') 
      ? 'http://localhost:3000' 
      : 'https://aistudio555jamstack-production.up.railway.app';
    this.currentLocale = this.detectLocale();
    console.log('🌍 UI Translator initialized for locale:', this.currentLocale);
  }

  detectLocale() {
    // Check URL path first (e.g., /ru/home.html)
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const pathLang = pathParts.find(part => ['en', 'ru', 'he'].includes(part));
    
    // Then check URL parameters and localStorage
    const params = new URLSearchParams(window.location.search);
    const locale = pathLang || params.get('locale') || localStorage.getItem('locale') || 'en';
    
    console.log('🔍 Detected locale:', locale, 'from path:', pathLang);
    return locale;
  }

  async loadUITranslations() {
    try {
      console.log('📡 Loading UI translations...');
      const response = await fetch(`${this.apiBase}/api/home-page?locale=${this.currentLocale}`);
      const data = await response.json();
      
      if (data.data && data.data.attributes) {
        console.log('✅ UI translations loaded:', Object.keys(data.data.attributes).length, 'fields');
        return data.data.attributes;
      }
      throw new Error('Invalid API response');
    } catch (error) {
      console.error('❌ Failed to load UI translations:', error);
      return null;
    }
  }

  updateNavigation(ui) {
    console.log('🧭 Updating navigation...');
    
    // Navigation menu items
    const navItems = [
      { selector: 'a[href="/home"], a[href="home.html"], a[href="../home.html"], a[href="index.html"]', field: 'navHome' },
      { selector: 'a[href="/courses"], a[href="courses.html"], a[href="../courses.html"]', field: 'navCourses' },
      { selector: 'a[href="/teachers"], a[href="teachers.html"], a[href="../teachers.html"]', field: 'navTeachers' },
      { selector: 'a[href="/blog"], a[href="blog.html"], a[href="../blog.html"]', field: 'navBlog' },
      { selector: 'a[href="/career-center"], a[href="career-center.html"], a[href="../career-center.html"]', field: 'navCareerCenter' },
      { selector: 'a[href="/about"], a[href="about.html"], a[href="../about.html"]', field: 'navAbout' },
      { selector: 'a[href="/contact"], a[href="contact.html"], a[href="../contact.html"]', field: 'navContact' },
      { selector: 'a[href="/pricing"], a[href="pricing.html"], a[href="../pricing.html"]', field: 'navPricing' }
    ];

    navItems.forEach(item => {
      const elements = document.querySelectorAll(item.selector);
      elements.forEach(el => {
        if (ui[item.field] && el.textContent.trim() !== ui[item.field]) {
          console.log(`✅ Nav: "${el.textContent.trim()}" → "${ui[item.field]}"`);
          el.textContent = ui[item.field];
        }
      });
    });

    // Update dropdown menu text
    const dropdownItems = document.querySelectorAll('.dropdown-menu-text-link-block, .nav-link, .dropdown-list a');
    dropdownItems.forEach(item => {
      const href = item.getAttribute('href') || '';
      if (href.includes('career') && ui.navCareerCenter) {
        item.textContent = ui.navCareerCenter;
      }
    });
  }

  updateButtons(ui) {
    console.log('🔘 Updating buttons...');
    
    // Button mappings - look for common button classes and text content
    const buttonMappings = [
      { text: ['Sign Up Today', 'sign up today'], field: 'btnSignUpToday' },
      { text: ['Learn More', 'learn more'], field: 'btnLearnMore' },
      { text: ['View All Courses', 'view all courses', 'Uncover All Courses'], field: 'btnViewAllCourses' },
      { text: ['Get Started', 'get started'], field: 'btnGetStarted' },
      { text: ['Contact Us', 'contact us', 'get in touch'], field: 'btnContactUs' },
      { text: ['Enroll Now', 'enroll now'], field: 'btnEnrollNow' },
      { text: ['Start Learning', 'start learning'], field: 'btnStartLearning' },
      { text: ['Explore Courses', 'explore courses'], field: 'btnExploreCourses' },
      { text: ['View Details', 'view details', 'Course Details'], field: 'btnViewDetails' },
      { text: ['Book Consultation', 'book consultation'], field: 'btnBookConsultation' },
      { text: ['Watch Demo', 'watch demo'], field: 'btnWatchDemo' },
      { text: ['Free Trial', 'free trial'], field: 'btnFreeTrial' }
    ];

    // Find all button-like elements
    const buttonSelectors = [
      'button', '.primary-button-text-block', '.secondary-button-text-block',
      '.button', '.btn', 'a.primary-button', 'a.secondary-button',
      '.cta-button', '.action-button', '.banner-button', '[class*="button"]'
    ];

    buttonSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(button => {
        const currentText = button.textContent.trim().toLowerCase();
        
        buttonMappings.forEach(mapping => {
          if (mapping.text.some(text => currentText.includes(text.toLowerCase())) && ui[mapping.field]) {
            console.log(`✅ Button: "${button.textContent.trim()}" → "${ui[mapping.field]}"`);
            button.textContent = ui[mapping.field];
          }
        });
      });
    });
  }

  updateForms(ui) {
    console.log('📝 Updating forms...');
    
    // Form label mappings
    const formMappings = [
      { selectors: ['label[for*="email"]', 'label:contains("Email")', 'input[type="email"] + label'], field: 'formLabelEmail' },
      { selectors: ['label[for*="name"]', 'label:contains("Name")', 'input[name*="name"] + label'], field: 'formLabelName' },
      { selectors: ['label[for*="phone"]', 'label:contains("Phone")', 'input[type="tel"] + label'], field: 'formLabelPhone' },
      { selectors: ['label[for*="message"]', 'label:contains("Message")', 'textarea + label'], field: 'formLabelMessage' }
    ];

    formMappings.forEach(mapping => {
      mapping.selectors.forEach(selector => {
        // Handle :contains() pseudo-selector manually
        if (selector.includes(':contains(')) {
          const containsText = selector.match(/:contains\("([^"]+)"\)/)[1];
          const elements = Array.from(document.querySelectorAll('label')).filter(el => 
            el.textContent.includes(containsText)
          );
          elements.forEach(el => {
            if (ui[mapping.field]) {
              console.log(`✅ Form Label: "${el.textContent}" → "${ui[mapping.field]}"`);
              el.textContent = ui[mapping.field];
            }
          });
        } else {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (ui[mapping.field]) {
              console.log(`✅ Form Label: "${el.textContent}" → "${ui[mapping.field]}"`);
              el.textContent = ui[mapping.field];
            }
          });
        }
      });
    });

    // Update placeholders
    const placeholderMappings = [
      { selector: 'input[type="email"]', field: 'formPlaceholderEmail' },
      { selector: 'input[name*="name"], input[placeholder*="name" i]', field: 'formPlaceholderName' },
      { selector: 'input[type="tel"], input[name*="phone"]', field: 'formPlaceholderPhone' },
      { selector: 'textarea, input[name*="message"]', field: 'formPlaceholderMessage' }
    ];

    placeholderMappings.forEach(mapping => {
      const elements = document.querySelectorAll(mapping.selector);
      elements.forEach(input => {
        if (ui[mapping.field] && input.placeholder !== ui[mapping.field]) {
          console.log(`✅ Placeholder: "${input.placeholder}" → "${ui[mapping.field]}"`);
          input.placeholder = ui[mapping.field];
        }
      });
    });

    // Update submit buttons
    const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"], .form-submit-button');
    submitButtons.forEach(btn => {
      if (ui.formBtnSubmit && btn.value !== ui.formBtnSubmit) {
        console.log(`✅ Submit Button: "${btn.value || btn.textContent}" → "${ui.formBtnSubmit}"`);
        if (btn.tagName === 'INPUT') {
          btn.value = ui.formBtnSubmit;
        } else {
          btn.textContent = ui.formBtnSubmit;
        }
      }
    });

    // Newsletter subscribe button
    const subscribeButtons = document.querySelectorAll('.footer-details-form-submit-button, [value="Subscribe"]');
    subscribeButtons.forEach(btn => {
      if (ui.formBtnSubscribe) {
        console.log(`✅ Subscribe Button: "${btn.value || btn.textContent}" → "${ui.formBtnSubscribe}"`);
        if (btn.tagName === 'INPUT') {
          btn.value = ui.formBtnSubscribe;
        } else {
          btn.textContent = ui.formBtnSubscribe;
        }
      }
    });
    
    // Also find buttons with "Subscribe" text content
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
      if (btn.textContent && btn.textContent.trim().toLowerCase() === 'subscribe' && ui.formBtnSubscribe) {
        console.log(`✅ Subscribe Button (text): "${btn.textContent}" → "${ui.formBtnSubscribe}"`);
        btn.textContent = ui.formBtnSubscribe;
      }
    });
  }

  updateSectionTitles(ui) {
    console.log('📑 Updating section titles...');
    
    // CRITICAL: Update Expert-Led Learning with dynamic translation
    if (ui.heroExpertLed) {
      const expertLedElements = document.querySelectorAll('*');
      expertLedElements.forEach(el => {
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
          const text = el.textContent.trim();
          if (text === 'Expert-Led Learning') {
            console.log(`✅ Hero Expert-Led: "${text}" → "${ui.heroExpertLed}"`);
            el.textContent = ui.heroExpertLed;
          }
        }
      });
    }
    
    // Common section title mappings based on content
    const titleMappings = [
      { text: ['Most Popular IT Courses', 'Featured Courses', 'Popular Courses'], field: 'featuredCoursesTitle' },
      { text: ['FAQ & Answer', 'Frequently Asked Questions', 'FAQ'], field: 'faqTitle' },
      { text: ['Student Success Stories', 'Alumni Reviews'], field: 'testimonialsTitle' },
      { text: ['Your Questions Answered Here'], field: 'faqSubtitle' },
      { text: ['Focus on Practice'], field: 'focusPractice' },
      { text: ['Core Skills'], field: 'coreSkills' },
      { text: ['Online Learning'], field: 'onlineLearning' },
      { text: ['Expert Mentor In Technology'], field: 'expertMentor' }
    ];

    // Find all heading elements
    const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.section-title', '.heading', '.title'];
    
    headingSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(heading => {
        const currentText = heading.textContent.trim();
        
        titleMappings.forEach(mapping => {
          if (mapping.text.some(text => currentText.includes(text))) {
            const newText = mapping.field ? ui[mapping.field] : mapping.replacement;
            if (newText && currentText !== newText) {
              console.log(`✅ Section Title: "${currentText}" → "${newText}"`);
              heading.textContent = newText;
            }
          }
        });
      });
    });
  }

  updateMessages(ui) {
    console.log('💬 Updating system messages...');
    
    // Update loading messages
    const loadingElements = document.querySelectorAll('[data-loading], .loading, .spinner');
    loadingElements.forEach(el => {
      if (ui.msgLoading && el.textContent.includes('Loading')) {
        console.log(`✅ Loading Message: "${el.textContent}" → "${ui.msgLoading}"`);
        el.textContent = ui.msgLoading;
      }
    });

    // Update form success messages
    const successMessages = document.querySelectorAll('.w-form-done div, .form-success, .success-message');
    successMessages.forEach(el => {
      if (ui.msgFormSuccess && el.textContent.includes('Thank you')) {
        console.log(`✅ Success Message: "${el.textContent}" → "${ui.msgFormSuccess}"`);
        el.textContent = ui.msgFormSuccess;
      }
    });
  }

  updateUIElements(ui) {
    console.log('🎨 Updating UI elements...');
    
    // Update search placeholders
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i], input[placeholder*="поиск" i]');
    searchInputs.forEach(input => {
      if (ui.uiSearchPlaceholder && input.placeholder !== ui.uiSearchPlaceholder) {
        console.log(`✅ Search Placeholder: "${input.placeholder}" → "${ui.uiSearchPlaceholder}"`);
        input.placeholder = ui.uiSearchPlaceholder;
      }
    });

    // Update "Read More" links
    const readMoreLinks = document.querySelectorAll('a:contains("Read more"), a:contains("Read More"), .read-more');
    readMoreLinks.forEach(link => {
      if (ui.uiReadMore && link.textContent.toLowerCase().includes('read more')) {
        console.log(`✅ Read More: "${link.textContent}" → "${ui.uiReadMore}"`);
        link.textContent = ui.uiReadMore;
      }
    });
  }

  async translatePage() {
    console.log('🌍 Starting page translation...');
    
    try {
      const ui = await this.loadUITranslations();
      if (!ui) {
        console.error('❌ Cannot proceed without UI translations');
        return;
      }

      // Apply all translations
      this.updateNavigation(ui);
      this.updateButtons(ui);
      this.updateForms(ui);
      this.updateSectionTitles(ui);
      this.updateMessages(ui);
      this.updateUIElements(ui);

      console.log('✅ Page translation completed for locale:', this.currentLocale);
      
      // Store in localStorage for future use
      localStorage.setItem(`ui-translations-${this.currentLocale}`, JSON.stringify(ui));
      
      // Add visual indicator that translation is active
      if (this.currentLocale === 'ru') {
        document.body.setAttribute('data-locale', 'ru');
        document.body.classList.add('translated-page');
        console.log('🎉 Russian translation applied!');
      }
      
    } catch (error) {
      console.error('❌ Translation failed:', error);
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const translator = new UITranslator();
    translator.translatePage();
  });
} else {
  const translator = new UITranslator();
  translator.translatePage();
}

// Also make it available globally
window.UITranslator = UITranslator;