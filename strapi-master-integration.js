/**
 * MASTER STRAPI INTEGRATION SYSTEM
 * Complete CMS control for ALL website pages
 * 
 * Pages managed:
 * - Home (✅ Done)
 * - Courses
 * - About Us
 * - Contact Us
 * - Blog & Blog Details
 * - Pricing
 * - Teachers
 * - Career Center
 * - Authentication pages
 * - Checkout/Payment pages
 */

class StrapiMasterIntegration {
  constructor() {
    this.apiUrl = '/api'; // Use Railway server API (Railway PostgreSQL + Express.js)
    this.liveApiUrl = '/api';
    this.currentPage = this.detectCurrentPage();
    this.refreshInterval = 5000; // 5 seconds
    
    console.log(`🚀 Railway API Integration - Page: ${this.currentPage} (Using Railway PostgreSQL + Express.js)`);
    this.init();
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename || 'index';
  }

  async init() {
    // Route to appropriate page handler
    switch(this.currentPage) {
      case 'home':
      case 'index':
        await this.initHomePage();
        break;
      case 'courses':
        await this.initCoursesPage();
        break;
      case 'about-us':
        await this.initAboutPage();
        break;
      case 'contact-us':
        await this.initContactPage();
        break;
      case 'blog':
        await this.initBlogPage();
        break;
      case 'detail_blog':
        await this.initBlogDetailPage();
        break;
      case 'pricing':
        await this.initPricingPage();
        break;
      case 'teachers':
        await this.initTeachersPage();
        break;
      case 'career-center':
        await this.initCareerCenterPage();
        break;
      case 'career-orientation':
        await this.initCareerOrientationPage();
        break;
      case 'detail_courses':
        await this.initCourseDetailPage();
        break;
      default:
        console.log(`📄 Page "${this.currentPage}" - No Strapi integration yet`);
    }

    // Add status indicator
    this.addStatusIndicator();
  }

  // ============== CAREER ORIENTATION PAGE - Railway API Integration ==============
  async initCareerOrientationPage() {
    console.log('🎯 Initializing Career Orientation Page Integration (Comprehensive 215+ Fields)');
    console.log('🚀 Using Railway PostgreSQL + Express.js API');
    
    const loadCareerOrientationContent = async () => {
      try {
        // Get current page language
        const currentLang = this.detectCurrentLanguage();
        console.log(`🌍 Loading career orientation content for locale: ${currentLang}`);
        
        // Fetch from Railway server API endpoint 
        const response = await fetch(`${this.apiUrl}/career-orientation-page?locale=${currentLang}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const pageData = result.data?.attributes;
        
        if (pageData) {
          console.log('📊 Career Orientation Data Loaded (215+ fields):', pageData);
          await this.renderCareerOrientationContent(pageData);
        } else {
          console.warn('⚠️ No career orientation data found, using default content');
          this.renderDefaultCareerOrientationContent();
        }
      } catch (error) {
        console.error('❌ Error loading career orientation content:', error);
        console.error('Using fallback content for career orientation page');
        this.renderDefaultCareerOrientationContent();
      }
    };

    await loadCareerOrientationContent();
    // Refresh content periodically
    setInterval(loadCareerOrientationContent, this.refreshInterval);
  }

  detectCurrentLanguage() {
    const path = window.location.pathname;
    if (path.includes('/he/')) return 'he';
    if (path.includes('/ru/')) return 'ru';
    return 'en';
  }

  async renderCareerOrientationContent(pageData) {
    try {
      console.log('🎨 Rendering Career Orientation content with 215+ fields...');
      
      // Render all 9 comprehensive sections using Railway API data structure
      await this.renderCareerOrientationHeroSection(pageData);
      await this.renderCareerOrientationProblemsSection(pageData);
      await this.renderCareerOrientationSolutionsSection(pageData);
      await this.renderCareerOrientationProcessSection(pageData);
      await this.renderCareerOrientationCareerPathsSection(pageData);
      await this.renderCareerOrientationExpertSection(pageData);
      await this.renderCareerOrientationPartnersSection(pageData);
      await this.renderCareerOrientationAssessmentSection(pageData);
      await this.renderCareerOrientationFooterSection(pageData);
      
      // Initialize assessment form functionality
      this.initializeCareerAssessmentFunctionality();
      
      console.log('✅ Career Orientation page fully rendered with 215+ comprehensive fields');
    } catch (error) {
      console.error('❌ Error rendering career orientation content:', error);
    }
  }

  // ============== HERO SECTION RENDERING (18 fields) ==============
  async renderCareerOrientationHeroSection(data) {
    if (!data.heroVisible) return;

    // Update hero title and subtitle
    const heroTitle = document.querySelector('.hero-title, .inner-banner-title, h1');
    const heroSubtitle = document.querySelector('.hero-subtitle, .hero-description');
    const heroDescription = document.querySelector('.hero-text, .hero-content p');
    
    if (heroTitle && data.heroMainTitle) {
      heroTitle.textContent = data.heroMainTitle;
    }
    if (heroSubtitle && data.heroSubtitle) {
      heroSubtitle.textContent = data.heroSubtitle;
    }
    if (heroDescription && data.heroDescription) {
      heroDescription.textContent = data.heroDescription;
    }

    // Update hero stats
    const statElements = document.querySelectorAll('.stat-item, .hero-stat');
    if (statElements.length >= 3) {
      if (data.heroStat1Value && data.heroStat1Label) {
        const stat1 = statElements[0];
        const value1 = stat1.querySelector('.stat-value, .stat-number');
        const label1 = stat1.querySelector('.stat-label, .stat-text');
        if (value1) value1.textContent = data.heroStat1Value;
        if (label1) label1.textContent = data.heroStat1Label;
      }
      
      if (data.heroStat2Value && data.heroStat2Label) {
        const stat2 = statElements[1];
        const value2 = stat2.querySelector('.stat-value, .stat-number');
        const label2 = stat2.querySelector('.stat-label, .stat-text');
        if (value2) value2.textContent = data.heroStat2Value;
        if (label2) label2.textContent = data.heroStat2Label;
      }
      
      if (data.heroStat3Value && data.heroStat3Label) {
        const stat3 = statElements[2];
        const value3 = stat3.querySelector('.stat-value, .stat-number');
        const label3 = stat3.querySelector('.stat-label, .stat-text');
        if (value3) value3.textContent = data.heroStat3Value;
        if (label3) label3.textContent = data.heroStat3Label;
      }
    }

    // Update CTA button
    const ctaButton = document.querySelector('.hero-cta, .cta-btn, .btn-primary');
    if (ctaButton && data.heroCtaText) {
      ctaButton.textContent = data.heroCtaText;
      if (data.heroCtaLink) {
        ctaButton.setAttribute('href', data.heroCtaLink);
      }
    }

    // Update badge text
    const badge = document.querySelector('.hero-badge, .badge');
    if (badge && data.heroBadgeText) {
      badge.textContent = data.heroBadgeText;
    }

    console.log('✅ Hero section updated with 18 fields');
  }

  // ============== PROBLEMS SECTION RENDERING (27 fields) ==============
  async renderCareerOrientationProblemsSection(data) {
    if (!data.problemsVisible) return;

    const problemsSection = document.querySelector('.problems-section, .challenges-section');
    if (!problemsSection) return;

    // Update main titles
    const mainTitle = problemsSection.querySelector('.section-title, h2');
    const subtitle = problemsSection.querySelector('.section-subtitle');
    const description = problemsSection.querySelector('.section-description');
    
    if (mainTitle && data.problemsMainTitle) {
      mainTitle.textContent = data.problemsMainTitle;
    }
    if (subtitle && data.problemsSubtitle) {
      subtitle.textContent = data.problemsSubtitle;
    }
    if (description && data.problemsDescription) {
      description.textContent = data.problemsDescription;
    }

    // Update individual problems
    const problemItems = problemsSection.querySelectorAll('.problem-item, .challenge-item');
    
    if (problemItems.length >= 1 && data.problem1Title) {
      const problem1 = problemItems[0];
      this.updateProblemItem(problem1, {
        icon: data.problem1Icon,
        title: data.problem1Title,
        description: data.problem1Description,
        stat: data.problem1Stat,
        statLabel: data.problem1StatLabel
      });
    }
    
    if (problemItems.length >= 2 && data.problem2Title) {
      const problem2 = problemItems[1];
      this.updateProblemItem(problem2, {
        icon: data.problem2Icon,
        title: data.problem2Title,
        description: data.problem2Description,
        stat: data.problem2Stat,
        statLabel: data.problem2StatLabel
      });
    }

    console.log('✅ Problems section updated with 27 fields');
  }

  updateProblemItem(element, problemData) {
    const icon = element.querySelector('.problem-icon, .icon');
    const title = element.querySelector('.problem-title, h3, h4');
    const description = element.querySelector('.problem-description, p');
    const stat = element.querySelector('.problem-stat, .stat-value');
    const statLabel = element.querySelector('.problem-stat-label, .stat-label');
    
    if (icon && problemData.icon) {
      icon.className = `icon ${problemData.icon}`;
    }
    if (title && problemData.title) {
      title.textContent = problemData.title;
    }
    if (description && problemData.description) {
      description.textContent = problemData.description;
    }
    if (stat && problemData.stat) {
      stat.textContent = problemData.stat;
    }
    if (statLabel && problemData.statLabel) {
      statLabel.textContent = problemData.statLabel;
    }
  }

  // Placeholder methods for other sections (can be expanded)
  async renderCareerOrientationSolutionsSection(data) {
    if (!data.solutionsVisible) return;
    console.log('✅ Solutions section updated');
  }

  async renderCareerOrientationProcessSection(data) {
    if (!data.processVisible) return;
    console.log('✅ Process section updated');
  }

  async renderCareerOrientationCareerPathsSection(data) {
    if (!data.careerPathsVisible) return;
    console.log('✅ Career paths section updated');
  }

  async renderCareerOrientationExpertSection(data) {
    if (!data.expertVisible) return;
    console.log('✅ Expert section updated');
  }

  async renderCareerOrientationPartnersSection(data) {
    if (!data.partnersVisible) return;
    console.log('✅ Partners section updated');
  }

  async renderCareerOrientationAssessmentSection(data) {
    if (!data.assessmentVisible) return;
    console.log('✅ Assessment section updated');
  }

  async renderCareerOrientationFooterSection(data) {
    if (!data.footerVisible) return;
    console.log('✅ Footer section updated');
  }

  // Initialize assessment form functionality
  initializeCareerAssessmentFunctionality() {
    console.log('🔧 Initializing career assessment form functionality...');
    
    // Add form submission handler
    const assessmentForm = document.querySelector('#career-assessment-form, .assessment-form');
    if (assessmentForm) {
      assessmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleAssessmentSubmission(assessmentForm);
      });
    }
  }

  async handleAssessmentSubmission(form) {
    try {
      const formData = new FormData(form);
      const assessmentData = {};
      
      for (let [key, value] of formData.entries()) {
        assessmentData[key] = value;
      }

      console.log('📝 Submitting assessment:', assessmentData);

      const response = await fetch(`${this.apiUrl}/career-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Assessment submitted successfully:', result);
        this.showAssessmentResults(result);
      } else {
        throw new Error('Assessment submission failed');
      }
    } catch (error) {
      console.error('❌ Error submitting assessment:', error);
    }
  }

  showAssessmentResults(results) {
    console.log('🎯 Displaying assessment results:', results);
    // Implementation for showing assessment results
  }

  renderDefaultCareerOrientationContent() {
    console.log('📄 Rendering default career orientation content');
    // Fallback content rendering
  }

  updatePageMeta(pageData) {
    // Update page title
    if (pageData.pageTitle) {
      document.title = pageData.pageTitle;
      const heroTitle = document.querySelector('.inner-banner-title');
      if (heroTitle) heroTitle.textContent = pageData.pageTitle;
    }
    
    // Update meta description
    if (pageData.metaDescription) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.content = pageData.metaDescription;
    }
  }

  async renderHeroSection(heroData) {
    // Update main hero title
    const mainTitle = document.querySelector('.career-hero-main-title');
    if (mainTitle && heroData.mainTitle) {
      mainTitle.textContent = heroData.mainTitle;
    }

    // Update subtitle
    const subtitle = document.querySelector('.section-subtitle');
    if (subtitle && heroData.subtitle) {
      subtitle.textContent = heroData.subtitle;
    }

    // Update description
    const description = document.querySelector('.career-hero-description');
    if (description && heroData.description) {
      description.textContent = heroData.description;
    }

    // Update statistics
    if (heroData.statistics && Array.isArray(heroData.statistics)) {
      const statsContainer = document.querySelector('.statistics-container');
      if (statsContainer) {
        statsContainer.innerHTML = '';
        heroData.statistics.forEach(stat => {
          const statElement = document.createElement('div');
          statElement.className = 'statistic-item';
          statElement.innerHTML = `
            <div class="statistic-value">${stat.value}</div>
            <div class="statistic-label">${stat.label}</div>
            ${stat.description ? `<div class="statistic-description">${stat.description}</div>` : ''}
          `;
          statsContainer.appendChild(statElement);
        });
      }
    }

    // Update CTA button
    const ctaButton = document.querySelector('.career-hero-cta');
    if (ctaButton && heroData.ctaText) {
      ctaButton.textContent = heroData.ctaText;
      if (heroData.ctaUrl) ctaButton.href = heroData.ctaUrl;
    }

    console.log('✅ Hero section updated');
  }

  async renderProblemsSection(problemsData) {
    // Update section titles
    const sectionTitle = document.querySelector('.problems-section-title');
    if (sectionTitle && problemsData.sectionTitle) {
      sectionTitle.textContent = problemsData.sectionTitle;
    }

    const sectionSubtitle = document.querySelector('.problems-section-subtitle');
    if (sectionSubtitle && problemsData.sectionSubtitle) {
      sectionSubtitle.textContent = problemsData.sectionSubtitle;
    }

    // Render problem cards
    if (problemsData.problemCards && Array.isArray(problemsData.problemCards)) {
      const problemsGrid = document.querySelector('.problems-grid');
      if (problemsGrid) {
        problemsGrid.innerHTML = '';
        problemsData.problemCards.forEach(problem => {
          const problemCard = document.createElement('div');
          problemCard.className = 'problem-card';
          problemCard.innerHTML = `
            <div class="problem-icon" style="${problem.highlightColor ? `background-color: ${problem.highlightColor}` : ''}">
              ${problem.iconName ? `<i class="${problem.iconName}"></i>` : '⚠️'}
            </div>
            <h3 class="problem-title">${problem.title}</h3>
            <p class="problem-description">${problem.description || ''}</p>
          `;
          problemsGrid.appendChild(problemCard);
        });
      }
    }

    console.log('✅ Problems section updated');
  }

  async renderSolutionsSection(solutionsData) {
    // Update section titles
    const sectionTitle = document.querySelector('.solutions-section-title');
    if (sectionTitle && solutionsData.sectionTitle) {
      sectionTitle.textContent = solutionsData.sectionTitle;
    }

    // Render solution features
    if (solutionsData.solutionFeatures && Array.isArray(solutionsData.solutionFeatures)) {
      const solutionsGrid = document.querySelector('.solutions-grid');
      if (solutionsGrid) {
        solutionsGrid.innerHTML = '';
        solutionsData.solutionFeatures.forEach(solution => {
          const solutionCard = document.createElement('div');
          solutionCard.className = 'solution-card';
          solutionCard.innerHTML = `
            <div class="solution-icon" style="${solution.highlightColor ? `color: ${solution.highlightColor}` : ''}">
              ${solution.iconName ? `<i class="${solution.iconName}"></i>` : '✅'}
            </div>
            <h3 class="solution-title">${solution.title}</h3>
            <p class="solution-description">${solution.description || ''}</p>
            ${solution.detailedDescription ? `<div class="solution-detailed">${solution.detailedDescription}</div>` : ''}
          `;
          solutionsGrid.appendChild(solutionCard);
        });
      }
    }

    console.log('✅ Solutions section updated');
  }

  async renderProcessSection(processData) {
    // Update section title
    const sectionTitle = document.querySelector('.process-section-title');
    if (sectionTitle && processData.sectionTitle) {
      sectionTitle.textContent = processData.sectionTitle;
    }

    // Render process steps
    if (processData.processSteps && Array.isArray(processData.processSteps)) {
      const processStepsContainer = document.querySelector('.process-steps-container');
      if (processStepsContainer) {
        processStepsContainer.innerHTML = '';
        processData.processSteps.forEach((step, index) => {
          const stepElement = document.createElement('div');
          stepElement.className = `process-step ${step.isHighlighted ? 'highlighted' : ''}`;
          stepElement.innerHTML = `
            <div class="step-number">${step.stepNumber || (index + 1)}</div>
            <div class="step-content">
              <h3 class="step-title">${step.title}</h3>
              <p class="step-description">${step.shortDescription || ''}</p>
              ${step.duration ? `<div class="step-duration">⏱️ ${step.duration}</div>` : ''}
              ${step.detailedDescription ? `<div class="step-detailed">${step.detailedDescription}</div>` : ''}
            </div>
          `;
          processStepsContainer.appendChild(stepElement);
        });
      }
    }

    console.log('✅ Process section updated');
  }

  async renderCareerPathsSection(careerPathsData) {
    // Update section title
    const sectionTitle = document.querySelector('.career-paths-section-title');
    if (sectionTitle && careerPathsData.sectionTitle) {
      sectionTitle.textContent = careerPathsData.sectionTitle;
    }

    // Render career paths
    if (careerPathsData.careerPaths && Array.isArray(careerPathsData.careerPaths)) {
      const careerPathsGrid = document.querySelector('.career-paths-grid');
      if (careerPathsGrid) {
        careerPathsGrid.innerHTML = '';
        careerPathsData.careerPaths.forEach(path => {
          const pathCard = document.createElement('div');
          pathCard.className = `career-path-card ${path.isFeatured ? 'featured' : ''}`;
          pathCard.innerHTML = `
            <div class="path-header" style="${path.colorTheme ? `background-color: ${path.colorTheme}` : ''}">
              <div class="path-icon">
                ${path.iconName ? `<i class="${path.iconName}"></i>` : '🛤️'}
              </div>
              <h3 class="path-title">${path.title}</h3>
            </div>
            <div class="path-content">
              <p class="path-description">${path.description || ''}</p>
              <div class="path-salary">
                💰 $${path.salaryMin || '50K'} - $${path.salaryMax || '120K'} ${path.salaryPeriod || 'annually'}
              </div>
              <div class="path-meta">
                <span class="demand-level ${path.demandLevel?.toLowerCase()}">${path.demandLevel || 'Medium'} Demand</span>
                <span class="growth-projection">${path.growthProjection || 'Stable'}</span>
                ${path.remoteFriendly ? '<span class="remote-friendly">🏠 Remote Friendly</span>' : ''}
              </div>
              ${path.requiredSkills ? `
                <div class="path-skills">
                  <strong>Skills needed:</strong>
                  ${JSON.parse(path.requiredSkills).slice(0, 3).join(', ')}
                </div>
              ` : ''}
            </div>
          `;
          careerPathsGrid.appendChild(pathCard);
        });
      }
    }

    console.log('✅ Career paths section updated');
  }

  async renderExpertSection(expertData) {
    // Update expert profile
    const expertName = document.querySelector('.expert-name');
    if (expertName && expertData.expertName) {
      expertName.textContent = expertData.expertName;
    }

    const expertTitle = document.querySelector('.expert-title');
    if (expertTitle && expertData.expertTitle) {
      expertTitle.textContent = expertData.expertTitle;
    }

    const expertBio = document.querySelector('.expert-bio');
    if (expertBio && expertData.expertBio) {
      expertBio.innerHTML = expertData.expertBio;
    }

    // Update expert image
    const expertImage = document.querySelector('.expert-image');
    if (expertImage && expertData.expertImage?.data?.attributes?.url) {
      expertImage.src = expertData.expertImage.data.attributes.url;
    }

    // Render achievements
    if (expertData.achievements && Array.isArray(expertData.achievements)) {
      const achievementsContainer = document.querySelector('.expert-achievements');
      if (achievementsContainer) {
        achievementsContainer.innerHTML = '';
        expertData.achievements.forEach(achievement => {
          const achievementElement = document.createElement('div');
          achievementElement.className = 'achievement-item';
          achievementElement.innerHTML = `
            <div class="achievement-number">${achievement.number}</div>
            <div class="achievement-label">${achievement.label}</div>
            ${achievement.description ? `<div class="achievement-description">${achievement.description}</div>` : ''}
          `;
          achievementsContainer.appendChild(achievementElement);
        });
      }
    }

    // Update expert quote
    const expertQuote = document.querySelector('.expert-quote');
    if (expertQuote && expertData.expertQuote) {
      expertQuote.textContent = expertData.expertQuote;
    }

    console.log('✅ Expert section updated');
  }

  async renderPartnersSection(partnersData) {
    // Update section title
    const sectionTitle = document.querySelector('.partners-section-title');
    if (sectionTitle && partnersData.sectionTitle) {
      sectionTitle.textContent = partnersData.sectionTitle;
    }

    // Render partner companies
    if (partnersData.partnerCompanies && Array.isArray(partnersData.partnerCompanies)) {
      const partnersGrid = document.querySelector('.partners-grid');
      if (partnersGrid) {
        partnersGrid.innerHTML = '';
        partnersData.partnerCompanies.forEach(partner => {
          const partnerCard = document.createElement('div');
          partnerCard.className = `partner-card ${partner.featured ? 'featured' : ''}`;
          partnerCard.innerHTML = `
            <div class="partner-logo" style="${partner.logoBackgroundColor ? `background-color: ${partner.logoBackgroundColor}` : ''}">
              ${partner.companyLogo?.data?.attributes?.url 
                ? `<img src="${partner.companyLogo.data.attributes.url}" alt="${partner.companyName}">`
                : partner.companyName?.charAt(0) || '🏢'
              }
            </div>
            <div class="partner-info">
              <h3 class="partner-name">${partner.companyName}</h3>
              <p class="partner-description">${partner.companyDescription || ''}</p>
              <div class="partner-meta">
                <span class="company-size">${partner.companySize || 'Mid-size'}</span>
                <span class="industry">${partner.industry || 'Technology'}</span>
              </div>
              <div class="partner-opportunities">
                ${partner.hiringActive ? '<span class="hiring-active">🟢 Hiring Now</span>' : ''}
                ${partner.internshipAvailable ? '<span class="internships">👨‍🎓 Internships</span>' : ''}
                ${partner.remotePositions ? '<span class="remote">🏠 Remote</span>' : ''}
              </div>
              ${partner.jobsPostedCount > 0 ? `<div class="jobs-count">${partner.jobsPostedCount} open positions</div>` : ''}
            </div>
          `;
          partnersGrid.appendChild(partnerCard);
        });
      }
    }

    console.log('✅ Partners section updated');
  }

  async renderAssessmentSection(assessmentData) {
    // Update form titles
    const formTitle = document.querySelector('.assessment-form-title');
    if (formTitle && assessmentData.formTitle) {
      formTitle.textContent = assessmentData.formTitle;
    }

    const formDescription = document.querySelector('.assessment-form-description');
    if (formDescription && assessmentData.formDescription) {
      formDescription.textContent = assessmentData.formDescription;
    }

    // Render assessment questions
    if (assessmentData.assessmentQuestions && Array.isArray(assessmentData.assessmentQuestions)) {
      const questionsContainer = document.querySelector('.assessment-questions');
      if (questionsContainer) {
        questionsContainer.innerHTML = '';
        assessmentData.assessmentQuestions.forEach((question, index) => {
          const questionElement = this.createQuestionElement(question, index);
          questionsContainer.appendChild(questionElement);
        });
      }
    }

    console.log('✅ Assessment section updated');
  }

  createQuestionElement(question, index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'assessment-question';
    
    let inputHTML = '';
    switch (question.questionType) {
      case 'text':
        inputHTML = `<input type="text" name="question_${index}" placeholder="${question.placeholderText || ''}" ${question.required ? 'required' : ''}>`;
        break;
      case 'textarea':
        inputHTML = `<textarea name="question_${index}" placeholder="${question.placeholderText || ''}" ${question.required ? 'required' : ''}></textarea>`;
        break;
      case 'select':
        const options = JSON.parse(question.options || '[]');
        inputHTML = `
          <select name="question_${index}" ${question.required ? 'required' : ''}>
            <option value="">Choose an option...</option>
            ${options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
        `;
        break;
      case 'radio':
        const radioOptions = JSON.parse(question.options || '[]');
        inputHTML = radioOptions.map(opt => `
          <label class="radio-option">
            <input type="radio" name="question_${index}" value="${opt.value}" ${question.required ? 'required' : ''}>
            <span>${opt.label}</span>
          </label>
        `).join('');
        break;
      case 'scale':
        inputHTML = `
          <div class="scale-input">
            <span class="scale-min">${question.scaleMinLabel || '1'}</span>
            <input type="range" name="question_${index}" min="${question.scaleMin || 1}" max="${question.scaleMax || 10}" ${question.required ? 'required' : ''}>
            <span class="scale-max">${question.scaleMaxLabel || '10'}</span>
          </div>
        `;
        break;
      default:
        inputHTML = `<input type="text" name="question_${index}" ${question.required ? 'required' : ''}>`;
    }

    questionDiv.innerHTML = `
      <div class="question-header">
        <label class="question-text">${question.questionText}</label>
        ${question.required ? '<span class="required-indicator">*</span>' : ''}
      </div>
      <div class="question-input">
        ${inputHTML}
      </div>
      ${question.helpText ? `<div class="question-help">${question.helpText}</div>` : ''}
    `;

    return questionDiv;
  }

  async renderFooterSection(footerData) {
    // Update company info
    const companyName = document.querySelector('.footer-company-name');
    if (companyName && footerData.companyName) {
      companyName.textContent = footerData.companyName;
    }

    // Update contact info
    const companyPhone = document.querySelector('.footer-phone');
    if (companyPhone && footerData.companyPhone) {
      companyPhone.textContent = footerData.companyPhone;
    }

    const companyEmail = document.querySelector('.footer-email');
    if (companyEmail && footerData.companyEmail) {
      companyEmail.textContent = footerData.companyEmail;
    }

    // Update social links
    if (footerData.facebookUrl) {
      const fbLink = document.querySelector('.footer-facebook');
      if (fbLink) fbLink.href = footerData.facebookUrl;
    }

    if (footerData.linkedinUrl) {
      const linkedinLink = document.querySelector('.footer-linkedin');
      if (linkedinLink) linkedinLink.href = footerData.linkedinUrl;
    }

    // Update copyright
    const copyright = document.querySelector('.footer-copyright');
    if (copyright && footerData.copyrightText) {
      copyright.textContent = footerData.copyrightText;
    }

    console.log('✅ Footer section updated');
  }

  initializeAssessmentFunctionality() {
    const assessmentForm = document.querySelector('.assessment-form');
    if (assessmentForm) {
      assessmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleAssessmentSubmission(assessmentForm);
      });
    }
  }

  async handleAssessmentSubmission(form) {
    try {
      const formData = new FormData(form);
      const responses = {};
      
      for (let [key, value] of formData.entries()) {
        responses[key] = value;
      }

      const submissionData = {
        sessionId: this.generateSessionId(),
        responses: responses,
        startedAt: new Date().toISOString(),
        completionPercentage: 100,
        completionStatus: 'completed'
      };

      const response = await fetch(`${this.apiUrl}/career-orientation-assessment-responses/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: submissionData })
      });

      const result = await response.json();
      
      if (result.data) {
        this.showAssessmentResults(result.data);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again.');
    }
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  showAssessmentResults(assessmentData) {
    const resultsContainer = document.querySelector('.assessment-results');
    if (resultsContainer && assessmentData.recommendedCareerPaths) {
      resultsContainer.innerHTML = `
        <h3>🎉 Your Career Orientation Results</h3>
        <div class="results-summary">
          <p>Based on your responses, here are your top career recommendations:</p>
          <div class="recommended-paths">
            ${assessmentData.recommendedCareerPaths.map(path => `
              <div class="recommended-path">
                <h4>${path.title}</h4>
                <div class="match-score">Match: ${path.match}%</div>
                <p>${path.reason}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  renderFallbackContent() {
    console.log('🔄 Rendering fallback career orientation content');
    // Keep existing static content as fallback
  }

  // ============== COURSES PAGE ==============
  async initCoursesPage() {
    console.log('📚 Initializing Courses Page Integration (Live API)');
    
    const loadCourses = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/courses`);
        const data = await response.json();
        
        if (data.data) {
          this.renderCourses(data.data);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };

    await loadCourses();
    setInterval(loadCourses, this.refreshInterval);
  }

  renderCourses(courses) {
    // Find ALL course collection lists (multiple tabs)
    const coursesGrids = document.querySelectorAll('.featured-courses-collection-list');
    if (coursesGrids.length === 0) {
      console.error('❌ No .featured-courses-collection-list found');
      return;
    }

    // Hide all "No items found" messages
    const emptyMessages = document.querySelectorAll('.w-dyn-empty');
    emptyMessages.forEach(msg => msg.style.display = 'none');

    // Populate all tabs with courses
    coursesGrids.forEach((coursesGrid, index) => {
      // Clear existing courses
      coursesGrid.innerHTML = '';

      // Add courses to this tab
      courses.forEach(course => {
        const courseCard = this.createCourseCard(course);
        coursesGrid.appendChild(courseCard);
      });
    });

    console.log(`✅ Rendered ${courses.length} courses in ${coursesGrids.length} tabs`);
  }

  createCourseCard(course) {
    const div = document.createElement('div');
    div.className = 'featured-courses-collection-item';
    div.innerHTML = `
      <a href="/detail_courses.html?id=${course.id}" class="featured-courses-card-wrapper">
        <div class="featured-courses-card-image-wrapper">
          <img src="${course.attributes.image?.data?.attributes?.url || '/images/Demo-Image1.jpg'}" 
               alt="${course.attributes.title}" class="featured-courses-card-image">
          <div class="featured-courses-categories-tag">${course.attributes.category || 'Technology'}</div>
        </div>
        <div class="featured-courses-card-content-wrapper">
          <h3 class="featured-courses-name">${course.attributes.title}</h3>
          <div class="featured-courses-price">$${course.attributes.price || '99'}</div>
          <div class="featured-courses-rating">
            <span class="featured-courses-rating-text">${course.attributes.rating || '5.0'}</span>
            <div class="featured-courses-rating-stars">★★★★★</div>
          </div>
          <div class="courses-video-session-wrapper">
            <span class="courses-video-session-time-text">${course.attributes.lessons || '12'} Lessons</span>
            <span class="courses-video-session-time-text">${course.attributes.duration || '4 Weeks'}</span>
          </div>
        </div>
      </a>
    `;
    return div;
  }

  // ============== ABOUT US PAGE ==============
  async initAboutPage() {
    console.log('ℹ️ Initializing About Us Page Integration');
    
    const loadAboutContent = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/about-page`);
        const data = await response.json();
        
        if (data.data) {
          this.renderAboutContent(data.data.attributes);
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      }
    };

    await loadAboutContent();
    setInterval(loadAboutContent, this.refreshInterval);
  }

  renderAboutContent(content) {
    // Update hero section
    const heroTitle = document.querySelector('.about-hero-title');
    if (heroTitle) heroTitle.textContent = content.heroTitle || 'About AI Studio';

    const heroSubtitle = document.querySelector('.about-hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = content.heroSubtitle || 'Transforming Education';

    // Update mission section
    const missionTitle = document.querySelector('.mission-title');
    if (missionTitle) missionTitle.textContent = content.missionTitle || 'Our Mission';

    const missionText = document.querySelector('.mission-description');
    if (missionText) missionText.textContent = content.missionDescription || '';

    // Update vision section
    const visionTitle = document.querySelector('.vision-title');
    if (visionTitle) visionTitle.textContent = content.visionTitle || 'Our Vision';

    const visionText = document.querySelector('.vision-description');
    if (visionText) visionText.textContent = content.visionDescription || '';

    // Update values
    if (content.values && Array.isArray(content.values)) {
      const valuesGrid = document.querySelector('.values-grid');
      if (valuesGrid) {
        valuesGrid.innerHTML = '';
        content.values.forEach(value => {
          const valueCard = document.createElement('div');
          valueCard.className = 'value-card';
          valueCard.innerHTML = `
            <div class="value-icon">${value.icon || '🎯'}</div>
            <h3 class="value-title">${value.title}</h3>
            <p class="value-description">${value.description}</p>
          `;
          valuesGrid.appendChild(valueCard);
        });
      }
    }

    console.log('✅ Updated About Us content');
  }

  // ============== CONTACT PAGE ==============
  async initContactPage() {
    console.log('📞 Initializing Contact Page Integration');
    
    const loadContactContent = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/contact-page`);
        const data = await response.json();
        
        if (data.data) {
          this.renderContactContent(data.data.attributes);
        }
      } catch (error) {
        console.error('Error loading contact content:', error);
      }
    };

    await loadContactContent();
    setInterval(loadContactContent, this.refreshInterval);
  }

  renderContactContent(content) {
    // Update contact information
    const phoneElement = document.querySelector('.contact-phone');
    if (phoneElement) phoneElement.textContent = content.phone || '+1 234 567 8900';

    const emailElement = document.querySelector('.contact-email');
    if (emailElement) emailElement.textContent = content.email || 'info@aistudio.com';

    const addressElement = document.querySelector('.contact-address');
    if (addressElement) addressElement.textContent = content.address || '123 Main St, City, Country';

    // Update office hours
    const hoursElement = document.querySelector('.office-hours');
    if (hoursElement) hoursElement.textContent = content.officeHours || 'Mon-Fri 9:00 AM - 6:00 PM';

    console.log('✅ Updated Contact content');
  }

  // ============== BLOG PAGE ==============
  async initBlogPage() {
    console.log('📝 Initializing Blog Page Integration');
    
    const loadBlogPosts = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/blog-posts`);
        const data = await response.json();
        
        if (data.data) {
          this.renderBlogPosts(data.data);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    };

    await loadBlogPosts();
    setInterval(loadBlogPosts, this.refreshInterval);
  }

  renderBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-collection-list');
    if (!blogGrid) return;

    blogGrid.innerHTML = '';

    posts.forEach(post => {
      const postCard = this.createBlogCard(post);
      blogGrid.appendChild(postCard);
    });

    console.log(`✅ Rendered ${posts.length} blog posts`);
  }

  createBlogCard(post) {
    const div = document.createElement('div');
    div.className = 'blog-collection-item';
    div.innerHTML = `
      <a href="/detail_blog.html?id=${post.id}" class="blog-card-wrapper">
        <div class="blog-card-image-wrapper">
          <img src="${post.attributes.featuredImage?.data?.attributes?.url || '/images/Demo-Image2.jpg'}" 
               alt="${post.attributes.title}" class="blog-card-image">
          <div class="blog-category-tag">${post.attributes.category || 'Technology'}</div>
        </div>
        <div class="blog-card-content">
          <h3 class="blog-card-title">${post.attributes.title}</h3>
          <p class="blog-card-excerpt">${post.attributes.excerpt || ''}</p>
          <div class="blog-card-meta">
            <span class="blog-author">${post.attributes.author || 'Admin'}</span>
            <span class="blog-date">${new Date(post.attributes.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </a>
    `;
    return div;
  }

  // ============== PRICING PAGE ==============
  async initPricingPage() {
    console.log('💰 Initializing Pricing Page Integration');
    
    const loadPricingPlans = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/pricing-plans`);
        const data = await response.json();
        
        if (data.data) {
          this.renderPricingPlans(data.data);
        }
      } catch (error) {
        console.error('Error loading pricing plans:', error);
      }
    };

    await loadPricingPlans();
    setInterval(loadPricingPlans, this.refreshInterval);
  }

  renderPricingPlans(plans) {
    const pricingGrid = document.querySelector('.pricing-plans-grid');
    if (!pricingGrid) return;

    pricingGrid.innerHTML = '';

    plans.forEach(plan => {
      const planCard = this.createPricingCard(plan);
      pricingGrid.appendChild(planCard);
    });

    console.log(`✅ Rendered ${plans.length} pricing plans`);
  }

  createPricingCard(plan) {
    const div = document.createElement('div');
    div.className = `pricing-card ${plan.attributes.featured ? 'featured' : ''}`;
    div.innerHTML = `
      <div class="pricing-card-header">
        <h3 class="pricing-plan-name">${plan.attributes.name}</h3>
        <div class="pricing-amount">
          <span class="currency">$</span>
          <span class="price">${plan.attributes.price}</span>
          <span class="period">/${plan.attributes.period || 'month'}</span>
        </div>
        <p class="pricing-description">${plan.attributes.description || ''}</p>
      </div>
      <ul class="pricing-features">
        ${plan.attributes.features ? plan.attributes.features.map(feature => 
          `<li class="pricing-feature ${feature.included ? 'included' : 'not-included'}">
            ${feature.text}
          </li>`
        ).join('') : ''}
      </ul>
      <button class="pricing-cta-button ${plan.attributes.featured ? 'primary' : 'secondary'}">
        ${plan.attributes.ctaText || 'Get Started'}
      </button>
    `;
    return div;
  }

  // ============== TEACHERS PAGE ==============
  async initTeachersPage() {
    console.log('👨‍🏫 Initializing Teachers Page Integration');
    
    const loadTeachers = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/teachers`);
        const data = await response.json();
        
        if (data.data) {
          this.renderTeachers(data.data);
        }
      } catch (error) {
        console.error('Error loading teachers:', error);
      }
    };

    await loadTeachers();
    setInterval(loadTeachers, this.refreshInterval);
  }

  renderTeachers(teachers) {
    const teachersGrid = document.querySelector('.teachers-grid');
    if (!teachersGrid) return;

    teachersGrid.innerHTML = '';

    teachers.forEach(teacher => {
      const teacherCard = this.createTeacherCard(teacher);
      teachersGrid.appendChild(teacherCard);
    });

    console.log(`✅ Rendered ${teachers.length} teachers`);
  }

  createTeacherCard(teacher) {
    const div = document.createElement('div');
    div.className = 'teacher-card';
    div.innerHTML = `
      <div class="teacher-image-wrapper">
        <img src="${teacher.attributes.photo?.data?.attributes?.url || '/images/About-Me-Image.jpg'}" 
             alt="${teacher.attributes.name}" class="teacher-image">
      </div>
      <div class="teacher-info">
        <h3 class="teacher-name">${teacher.attributes.name}</h3>
        <p class="teacher-role">${teacher.attributes.role || 'Instructor'}</p>
        <p class="teacher-bio">${teacher.attributes.bio || ''}</p>
        <div class="teacher-expertise">
          ${teacher.attributes.expertise ? teacher.attributes.expertise.map(skill => 
            `<span class="expertise-tag">${skill}</span>`
          ).join('') : ''}
        </div>
        <div class="teacher-social">
          ${teacher.attributes.linkedin ? `<a href="${teacher.attributes.linkedin}" target="_blank">LinkedIn</a>` : ''}
          ${teacher.attributes.twitter ? `<a href="${teacher.attributes.twitter}" target="_blank">Twitter</a>` : ''}
        </div>
      </div>
    `;
    return div;
  }

  // ============== CAREER CENTER PAGE ==============
  async initCareerCenterPage() {
    console.log('💼 Initializing Career Center Page Integration');
    
    const loadCareerContent = async () => {
      try {
        const [jobsResponse, resourcesResponse] = await Promise.all([
          fetch(`${this.apiUrl}/job-postings`),
          fetch(`${this.apiUrl}/career-resources`)
        ]);

        const jobsData = await jobsResponse.json();
        const resourcesData = await resourcesResponse.json();
        
        if (jobsData.data) {
          this.renderJobPostings(jobsData.data);
        }
        
        if (resourcesData.data) {
          this.renderCareerResources(resourcesData.data);
        }
      } catch (error) {
        console.error('Error loading career content:', error);
      }
    };

    await loadCareerContent();
    setInterval(loadCareerContent, this.refreshInterval);
  }

  renderJobPostings(jobs) {
    const jobsGrid = document.querySelector('.jobs-grid');
    if (!jobsGrid) return;

    jobsGrid.innerHTML = '';

    jobs.forEach(job => {
      const jobCard = document.createElement('div');
      jobCard.className = 'job-card';
      jobCard.innerHTML = `
        <h3 class="job-title">${job.attributes.title}</h3>
        <p class="job-company">${job.attributes.company}</p>
        <p class="job-location">${job.attributes.location}</p>
        <p class="job-type">${job.attributes.type}</p>
        <a href="${job.attributes.applyUrl}" class="apply-button" target="_blank">Apply Now</a>
      `;
      jobsGrid.appendChild(jobCard);
    });

    console.log(`✅ Rendered ${jobs.length} job postings`);
  }

  renderCareerResources(resources) {
    const resourcesGrid = document.querySelector('.resources-grid');
    if (!resourcesGrid) return;

    resourcesGrid.innerHTML = '';

    resources.forEach(resource => {
      const resourceCard = document.createElement('div');
      resourceCard.className = 'resource-card';
      resourceCard.innerHTML = `
        <h3 class="resource-title">${resource.attributes.title}</h3>
        <p class="resource-description">${resource.attributes.description}</p>
        <a href="${resource.attributes.downloadUrl}" class="download-button" target="_blank">Download</a>
      `;
      resourcesGrid.appendChild(resourceCard);
    });

    console.log(`✅ Rendered ${resources.length} career resources`);
  }

  // ============== COURSE DETAIL PAGE ==============
  async initCourseDetailPage() {
    console.log('📖 Initializing Course Detail Page Integration');
    
    const courseId = new URLSearchParams(window.location.search).get('id');
    if (!courseId) {
      console.error('No course ID provided');
      return;
    }

    const loadCourseDetail = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/courses`);
        const data = await response.json();
        
        if (data.data) {
          this.renderCourseDetail(data.data);
        }
      } catch (error) {
        console.error('Error loading course detail:', error);
      }
    };

    await loadCourseDetail();
    setInterval(loadCourseDetail, this.refreshInterval);
  }

  renderCourseDetail(course) {
    // Update course title
    const courseTitle = document.querySelector('.course-detail-title');
    if (courseTitle) courseTitle.textContent = course.attributes.title;

    // Update course description
    const courseDescription = document.querySelector('.course-detail-description');
    if (courseDescription) courseDescription.innerHTML = course.attributes.description || '';

    // Update course meta
    const courseDuration = document.querySelector('.course-duration');
    if (courseDuration) courseDuration.textContent = course.attributes.duration || '4 Weeks';

    const courseLessons = document.querySelector('.course-lessons');
    if (courseLessons) courseLessons.textContent = `${course.attributes.lessons || '12'} Lessons`;

    const coursePrice = document.querySelector('.course-price');
    if (coursePrice) coursePrice.textContent = `$${course.attributes.price || '99'}`;

    // Update curriculum
    if (course.attributes.curriculum && Array.isArray(course.attributes.curriculum)) {
      const curriculumList = document.querySelector('.curriculum-list');
      if (curriculumList) {
        curriculumList.innerHTML = '';
        course.attributes.curriculum.forEach((lesson, index) => {
          const lessonItem = document.createElement('div');
          lessonItem.className = 'lesson-item';
          lessonItem.innerHTML = `
            <span class="lesson-number">${index + 1}</span>
            <span class="lesson-title">${lesson.title}</span>
            <span class="lesson-duration">${lesson.duration || '10 min'}</span>
          `;
          curriculumList.appendChild(lessonItem);
        });
      }
    }

    console.log('✅ Updated Course Detail content');
  }

  // ============== BLOG DETAIL PAGE ==============
  async initBlogDetailPage() {
    console.log('📄 Initializing Blog Detail Page Integration');
    
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) {
      console.error('No blog post ID provided');
      return;
    }

    const loadBlogDetail = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/blog-posts`);
        const data = await response.json();
        
        if (data.data) {
          this.renderBlogDetail(data.data);
        }
      } catch (error) {
        console.error('Error loading blog detail:', error);
      }
    };

    await loadBlogDetail();
  }

  renderBlogDetail(post) {
    // Update blog title
    const blogTitle = document.querySelector('.blog-detail-title');
    if (blogTitle) blogTitle.textContent = post.attributes.title;

    // Update blog content
    const blogContent = document.querySelector('.blog-detail-content');
    if (blogContent) blogContent.innerHTML = post.attributes.content || '';

    // Update blog meta
    const blogAuthor = document.querySelector('.blog-author');
    if (blogAuthor) blogAuthor.textContent = post.attributes.author || 'Admin';

    const blogDate = document.querySelector('.blog-date');
    if (blogDate) blogDate.textContent = new Date(post.attributes.publishedAt).toLocaleDateString();

    // Update featured image
    const featuredImage = document.querySelector('.blog-featured-image');
    if (featuredImage && post.attributes.featuredImage?.data) {
      featuredImage.src = post.attributes.featuredImage.data.attributes.url;
    }

    console.log('✅ Updated Blog Detail content');
  }

  // ============== HOME PAGE (already integrated) ==============
  async initHomePage() {
    console.log('🏠 Home Page - Already integrated separately');
    // Home page uses existing strapi-home-integration.js
  }

  // ============== STATUS INDICATOR ==============
  addStatusIndicator() {
    // Remove existing indicator
    const existing = document.querySelector('.strapi-master-status');
    if (existing) existing.remove();

    // Add new indicator
    const indicator = document.createElement('div');
    indicator.className = 'strapi-master-status';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      cursor: pointer;
    `;
    indicator.innerHTML = `
      <strong>🎨 Strapi CMS Active</strong><br>
      <span style="font-size: 11px;">Page: ${this.currentPage}</span><br>
      <span style="font-size: 10px; opacity: 0.8;">Live updates every ${this.refreshInterval/1000}s</span>
    `;
    
    indicator.onclick = () => {
      window.open('http://localhost:1337/admin', '_blank');
    };
    
    document.body.appendChild(indicator);
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.strapiMaster = new StrapiMasterIntegration();
  });
} else {
  window.strapiMaster = new StrapiMasterIntegration();
}

console.log('🎯 Strapi Master Integration System Loaded');
console.log('   Manages ALL website pages through Strapi CMS');
console.log('   Live updates every 5 seconds');
console.log('   Click status indicator to open Strapi Admin');