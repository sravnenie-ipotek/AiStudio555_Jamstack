/**
 * Teachers Details Component - Universal Shared Component System
 * Extends UniversalDetailsComponent following Zero-Static-Content Architecture
 * ALL content populated from database - NO hardcoded text
 */

class TeachersDetailsComponent {
    constructor() {
        this.entityType = 'teachers';
        this.apiNamespace = 'api/nd';
        this.entityData = null;
        this.entityId = null;
        this.previewMode = false;
        this.API_BASE = window.location.hostname === 'localhost'
            ? 'http://localhost:1337'
            : 'https://aistudio555jamstack-production.up.railway.app';
    }

    async init() {
        console.log(`📦 Loading ${this.entityType} Details Component...`);

        // Extract teacher ID from URL
        const params = this.getUrlParams();
        this.entityId = params.id;
        this.previewMode = params.preview === 'true';
        this.locale = params.locale || 'en';

        if (!this.entityId) {
            this.showError(`No ${this.entityType} ID provided in URL`);
            return;
        }

        console.log(`🎯 Loading teacher ID: ${this.entityId} | Locale: ${this.locale}${this.previewMode ? ' (preview mode)' : ''}`);

        // Load and populate ALL content from database
        await this.loadEntityData();
    }

    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id'),
            preview: params.get('preview'),
            locale: params.get('locale') || 'en'
        };
    }

    // Alias for compatibility
    async loadTeacherData(teacherId, locale = 'en') {
        this.entityId = teacherId;
        this.locale = locale;
        this.entityData = await this.fetchEntityData(teacherId, false, locale);
        return this.entityData;
    }

    async fetchEntityData(entityId, preview = false, locale = 'en') {
        try {
            const params = new URLSearchParams();
            if (preview) params.append('preview', 'true');
            params.append('locale', locale || this.locale || 'en');

            const url = `${this.API_BASE}/${this.apiNamespace}/${this.entityType}/${entityId}?${params.toString()}`;
            console.log(`📡 Fetching ${this.entityType}:`, url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${this.entityType}: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`✅ ${this.entityType} data received:`, data);

            // Handle wrapped API response format
            return data.data || data;
        } catch (error) {
            console.error(`❌ Error fetching ${this.entityType}:`, error);
            throw error;
        }
    }

    async loadEntityData() {
        try {
            this.showLoading(true);

            this.entityData = await this.fetchEntityData(this.entityId, this.previewMode, this.locale);

            if (!this.entityData) {
                throw new Error(`No ${this.entityType} data received`);
            }

            await this.populatePageContent();
            this.setupEventHandlers();
            this.removeDynamicDataI18n(); // Remove data-i18n from dynamic content

            // Show content sections with transition
            this.showContentSections();

            console.log(`✅ ${this.entityType} details page populated successfully`);

        } catch (error) {
            console.error(`❌ Error loading ${this.entityType} data:`, error);
            this.showError(`Failed to load teacher profile. Please try again later.`);
        } finally {
            this.showLoading(false);
        }
    }

    async populatePageContent() {
        const teacher = this.entityData;
        console.log('🎨 Populating teacher profile content:', teacher);

        // Page title and meta
        document.title = `${teacher.full_name || 'Teacher Profile'} - ${teacher.professional_title || ''} | AI Studio`;

        // Breadcrumb
        this.setText('.entity-breadcrumb-title', teacher.full_name);

        // Hero section - ALL from database
        // Clean display name by removing "ד"ר" prefix for better UI
        const displayName = teacher.full_name ? teacher.full_name.replace(/^ד"ר\s+/, '').trim() : '';
        this.setText('.entity-details-hero-title', displayName);
        this.setText('.entity-professional-title', teacher.professional_title);
        this.setImage('.entity-profile-image', teacher.profile_image_url, teacher.full_name);

        // Hero subtitle with professional stats
        const subtitle = this.buildHeroSubtitle(teacher);
        this.setText('.entity-hero-subtitle', subtitle);

        // Professional Statistics Grid
        await this.populateStatistics(teacher);

        // Main content sections - ALL from database
        this.setText('.entity-full-description', this.formatBioText(teacher.bio));
        await this.populateSkills(teacher);
        await this.populateExperience(teacher);
        await this.populateCoursestaught(teacher);
        await this.populateStudentReviews(teacher);

        // CTA section
        await this.populateCTASection(teacher);

        console.log('✅ All teacher profile content populated from database');
    }

    buildHeroSubtitle(teacher) {
        const parts = [];

        if (teacher.company) parts.push(teacher.company);
        if (teacher.statistics?.students_taught) parts.push(`${teacher.statistics.students_taught}+ students mentored`);
        if (teacher.statistics?.years_experience) parts.push(`${teacher.statistics.years_experience}+ years experience`);

        return parts.join(' • ') || 'Professional Instructor';
    }

    async populateStatistics(teacher) {
        const statsContainer = document.querySelector('.entity-stats-container');
        if (!statsContainer) return;

        const stats = teacher.statistics || {};

        const statsData = [
            { number: `${stats.years_experience || 0}+`, label: 'Years Experience' },
            { number: `${stats.students_taught || 0}+`, label: 'Students Taught' },
            { number: stats.courses_count || 0, label: 'Courses' },
            { number: `${stats.rating || 5.0}/5`, label: 'Rating' }
        ];

        statsContainer.innerHTML = statsData.map(stat => `
            <div class="stat-item entity-stat-item">
                <span class="stat-number entity-stat-number">${stat.number}</span>
                <div class="stat-label entity-stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    async populateSkills(teacher) {
        const skillsContainer = document.querySelector('.entity-skills-container');
        if (!skillsContainer) return;

        const skills = this.parseContentArray(teacher.skills);

        if (skills.length > 0) {
            skillsContainer.innerHTML = skills.map(skill =>
                `<span class="skill-tag entity-skill-tag">${this.escapeHtml(skill)}</span>`
            ).join('');
        } else {
            skillsContainer.innerHTML = '<p style="color: #64748b; font-style: italic;">Skills will be updated soon.</p>';
        }
    }

    async populateExperience(teacher) {
        const experienceContainer = document.querySelector('.entity-experience-container');
        if (!experienceContainer) return;

        const experience = this.parseContentArray(teacher.experience_history);

        if (experience.length > 0) {
            experienceContainer.innerHTML = experience.map(exp => {
                // Handle both string and object formats
                let title = '';
                let company = '';
                let duration = '';
                let description = '';

                if (typeof exp === 'string') {
                    // Simple string format
                    title = exp;
                } else if (typeof exp === 'object' && exp !== null) {
                    // Object format
                    title = exp.title || exp.role || exp.position || '';
                    company = exp.company || exp.organization || '';
                    duration = exp.duration || exp.years || '';
                    description = exp.description || exp.details || '';

                    // Handle years format
                    if (exp.years && typeof exp.years === 'number') {
                        duration = `${exp.years}+ years`;
                    } else if (exp.years_experience) {
                        duration = `${exp.years_experience}+ years`;
                    }
                }

                // Translate experience content
                const translatedTitle = this.translateDynamicContent(title, this.locale);
                const translatedCompany = company ? this.translateDynamicContent(company, this.locale) : '';
                const translatedDescription = description ? this.translateDynamicContent(description, this.locale) : '';
                const translatedDuration = duration ? this.translateDynamicContent(duration, this.locale) : '';

                const companyText = translatedCompany ? ` • ${translatedCompany}` : '';
                const titleDisplay = `${this.escapeHtml(translatedTitle)}${companyText ? this.escapeHtml(companyText) : ''}`;

                return `
                    <div class="experience-item entity-experience-item">
                        <h4 class="experience-title entity-experience-title">${titleDisplay}</h4>
                        ${translatedDuration ? `<div class="experience-duration entity-experience-duration">${this.escapeHtml(translatedDuration)}</div>` : ''}
                        ${translatedDescription ? `<p class="experience-description">${this.escapeHtml(translatedDescription)}</p>` : ''}
                    </div>
                `;
            }).join('');
        } else {
            // Hide section if no experience
            const experienceSection = document.querySelector('.entity-experience-section');
            if (experienceSection) experienceSection.style.display = 'none';
        }
    }

    async populateCoursestaught(teacher) {
        const coursesContainer = document.querySelector('.entity-courses-container');
        if (!coursesContainer) return;

        const courses = this.parseContentArray(teacher.courses_taught);

        if (courses.length > 0) {
            coursesContainer.innerHTML = courses.map(course => {
                // Handle both string and object formats
                let title = '';
                let description = '';
                let students = '';
                let rating = '';

                if (typeof course === 'string') {
                    title = course;
                } else if (typeof course === 'object' && course !== null) {
                    title = course.title || course.name || 'Course';
                    description = course.description || '';
                    students = course.students || course.students_count || '';
                    rating = course.rating || '';
                }

                // Translate course content
                const translatedTitle = this.translateDynamicContent(title, this.locale);
                const translatedDescription = description ? this.translateDynamicContent(description, this.locale) : '';
                const studentsText = students ? this.translateDynamicContent(`${students}+ students`, this.locale) : '';
                const ratingText = rating ? `${rating}/5` : '';

                return `
                    <div class="course-card entity-course-card">
                        <h4 class="course-title entity-course-title">${this.escapeHtml(translatedTitle)}</h4>
                        ${translatedDescription ? `<p class="course-description">${this.escapeHtml(translatedDescription)}</p>` : ''}
                        ${studentsText || ratingText ? `
                            <div class="course-stats">
                                ${studentsText ? `<span class="course-students">👥 ${this.escapeHtml(studentsText)}</span>` : ''}
                                ${ratingText ? `<span class="course-rating">⭐ ${ratingText}</span>` : ''}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');
        } else {
            // Hide section if no courses
            const coursesSection = document.querySelector('.entity-courses-section');
            if (coursesSection) coursesSection.style.display = 'none';
        }
    }

    async populateStudentReviews(teacher) {
        const reviewsContainer = document.querySelector('.entity-reviews-container');
        if (!reviewsContainer) return;

        const reviews = this.parseContentArray(teacher.student_reviews);

        if (reviews.length > 0) {
            reviewsContainer.innerHTML = reviews.map(review => `
                <div class="review-card entity-review-card">
                    <div class="review-stars entity-review-stars">${review.stars || '★★★★★'}</div>
                    <p class="review-text entity-review-text">${this.escapeHtml(review.text || review)}</p>
                    ${review.author ? `<div class="review-author entity-review-author">- ${this.escapeHtml(review.author)}</div>` : ''}
                </div>
            `).join('');
        } else {
            // Hide section if no reviews
            const reviewsSection = document.querySelector('.entity-reviews-section');
            if (reviewsSection) reviewsSection.style.display = 'none';
        }
    }

    async populateCTASection(teacher) {
        // CTA title
        this.setText('.entity-cta-title', `Start Your Journey with ${teacher.full_name}`);

        // CTA description
        const ctaDescription = `Join successful students who have transformed their careers through expert-led education. Get hands-on experience with real-world projects guided by ${teacher.full_name}.`;
        this.setText('.entity-cta-description', ctaDescription);

        // Contact button text
        const contactText = `Contact ${teacher.full_name}`;
        this.setText('.entity-cta-contact-text', contactText);
        this.setText('.entity-cta-contact-text-abs', contactText);
    }

    // ========================================
    // TRANSLATION METHODS
    // ========================================

    translateDynamicContent(text, locale) {
        if (!text || locale === 'en') return text;

        const translations = {
            he: {
                // Job titles
                'Senior ML Engineer': 'מהנדס בכיר ללמידת מכונה',
                'ML Engineer': 'מהנדס למידת מכונה',
                'Software Developer': 'מפתח תוכנה',
                'Senior Software Engineer': 'מהנדס תוכנה בכיר',
                'Data Scientist': 'מדען נתונים',
                'AI Researcher': 'חוקר בינה מלאכותית',
                'Tech Lead': 'ראש צוות טכני',
                'Full Stack Developer': 'מפתח פול סטאק',
                'Backend Developer': 'מפתח Backend',
                'Frontend Developer': 'מפתח Frontend',

                // Companies
                'Google': 'גוגל',
                'Microsoft': 'מיקרוסופט',
                'Meta': 'מטא',
                'Amazon': 'אמזון',
                'Apple': 'אפל',
                'Netflix': 'נטפליקס',
                'Tech Industry': 'תעשיית הטכנולוגיה',
                'Startup': 'סטארטאפ',

                // Experience descriptions
                'years of commercial experience': 'שנות ניסיון מסחרי',
                'Real-world development experience before transitioning to teaching': 'ניסיון פיתוח בעולם האמיתי לפני המעבר להוראה',
                'Experience in machine learning and AI development': 'ניסיון בפיתוח למידת מכונה ובינה מלאכותית',
                'Led development teams and delivered scalable solutions': 'הוביל צוותי פיתוח וסיפק פתרונות מדרגיים',

                // Course titles
                'Introduction to AI & Machine Learning': 'מבוא לבינה מלאכותית ולמידת מכונה',
                'Advanced Web Development': 'פיתוח אתרים מתקדם',
                'Data Science Fundamentals': 'יסודות מדעי הנתונים',
                'Python Programming': 'תכנות Python',
                'JavaScript Fundamentals': 'יסודות JavaScript',
                'React Development': 'פיתוח React',
                'Node.js Backend': 'פיתוח Node.js Backend',

                // Time expressions
                'years': 'שנים',
                'year': 'שנה',
                'months': 'חודשים',
                'month': 'חודש',
                'students': 'סטודנטים',
                'rating': 'דירוג'
            },
            ru: {
                // Job titles
                'Senior ML Engineer': 'Старший инженер по машинному обучению',
                'ML Engineer': 'Инженер по машинному обучению',
                'Software Developer': 'Разработчик программного обеспечения',
                'Senior Software Engineer': 'Старший инженер-программист',
                'Data Scientist': 'Специалист по данным',
                'AI Researcher': 'Исследователь ИИ',
                'Tech Lead': 'Технический руководитель',
                'Full Stack Developer': 'Fullstack-разработчик',
                'Backend Developer': 'Backend-разработчик',
                'Frontend Developer': 'Frontend-разработчик',

                // Companies
                'Tech Industry': 'IT-индустрия',
                'Startup': 'Стартап',

                // Experience descriptions
                'years of commercial experience': 'лет коммерческого опыта',
                'Real-world development experience before transitioning to teaching': 'Реальный опыт разработки перед переходом в преподавание',

                // Course titles
                'Introduction to AI & Machine Learning': 'Введение в ИИ и машинное обучение',
                'Advanced Web Development': 'Продвинутая веб-разработка',
                'Data Science Fundamentals': 'Основы науки о данных',
                'Python Programming': 'Программирование на Python',
                'JavaScript Fundamentals': 'Основы JavaScript',
                'React Development': 'Разработка на React',
                'Node.js Backend': 'Backend на Node.js',

                // Time expressions
                'years': 'лет',
                'year': 'год',
                'months': 'месяцев',
                'month': 'месяц',
                'students': 'студентов',
                'rating': 'рейтинг'
            }
        };

        if (!translations[locale]) return text;

        let translatedText = text;
        const localeTranslations = translations[locale];

        // Sort by length (longest first) to avoid partial matches
        const sortedKeys = Object.keys(localeTranslations).sort((a, b) => b.length - a.length);

        for (const key of sortedKeys) {
            const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            translatedText = translatedText.replace(regex, localeTranslations[key]);
        }

        return translatedText;
    }

    // ========================================
    // UTILITY METHODS
    // ========================================

    parseContentArray(content) {
        if (!content) return [];

        try {
            if (typeof content === 'string') {
                // Try to parse as JSON first
                try {
                    return JSON.parse(content);
                } catch (e) {
                    // If JSON parsing fails, split by comma
                    return content.split(',').map(item => item.trim()).filter(item => item.length > 0);
                }
            }
            return Array.isArray(content) ? content : [];
        } catch (e) {
            console.warn('Could not parse content:', e);
            return [];
        }
    }

    formatBioText(bio) {
        if (!bio) return 'Professional instructor with extensive experience in their field.';

        // Convert line breaks to HTML paragraphs
        return bio.split('\n\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph => `<p>${this.escapeHtml(paragraph)}</p>`)
            .join('');
    }

    setText(selector, text) {
        const element = document.querySelector(selector);
        if (element && text) {
            if (selector.includes('entity-full-description')) {
                // Allow HTML for description
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
    }

    setImage(selector, src, alt = '') {
        const element = document.querySelector(selector);
        if (element && src) {
            element.src = src;
            element.alt = alt;
            element.style.display = 'block';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(show) {
        let loader = document.querySelector('.entity-loading-overlay');

        if (show && !loader) {
            loader = document.createElement('div');
            loader.className = 'entity-loading-overlay';
            loader.textContent = `Loading teacher profile...`;
            document.body.appendChild(loader);
        } else if (!show && loader) {
            loader.remove();
        }
    }

    showError(message) {
        console.error(`❌ Teachers Error:`, message);

        // Create error display
        const contentSection = document.querySelector('.entity-details-content-section');
        if (contentSection) {
            contentSection.innerHTML = `
                <div class="container">
                    <div class="entity-error-message">
                        <h3>Teacher Profile Not Found</h3>
                        <p>${message}</p>
                        <a href="teachers.html" class="primary-button" style="margin-top: 20px; display: inline-block; text-decoration: none;">
                            <div class="primary-button-text-wrap">
                                <div class="primary-button-text-block">Back to Teachers</div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
        }
    }

    showContentSections() {
        // Show content sections with smooth transition
        const contentSection = document.querySelector('.entity-details-content-section');
        const ctaSection = document.querySelector('.entity-cta-section');

        setTimeout(() => {
            if (contentSection) contentSection.classList.add('loaded');
            if (ctaSection) ctaSection.classList.add('loaded');
        }, 100);
    }

    setupEventHandlers() {
        // Setup any interactive elements
        console.log('🔧 Setting up event handlers for teacher profile');

        // Could add interaction handlers here if needed
        // e.g., contact form modal, course preview, etc.
    }

    removeDynamicDataI18n() {
        // Remove data-i18n attributes from dynamic content elements
        // This prevents the unified language manager from overwriting dynamic content
        const dynamicSelectors = [
            '.entity-details-hero-title',
            '.entity-professional-title',
            '.entity-hero-subtitle',
            '.entity-breadcrumb-title',
            '.entity-full-description',
            '.entity-skill-tag',
            '.entity-experience-title',
            '.entity-course-title',
            '.entity-review-text'
        ];

        dynamicSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.hasAttribute('data-i18n')) {
                    element.removeAttribute('data-i18n');
                    console.log(`🔧 Removed data-i18n from ${selector}`);
                }
            });
        });

        console.log('✅ Dynamic content data-i18n attributes removed to prevent conflicts');
    }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

function initTeachersDetailsComponent() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 DOM loaded, initializing Teachers Details Component');
            const component = new TeachersDetailsComponent();
            component.init();
        });
    } else {
        console.log('🚀 DOM already loaded, initializing Teachers Details Component');
        const component = new TeachersDetailsComponent();
        component.init();
    }
}

// Export to window for external access
window.TeachersDetailsComponent = TeachersDetailsComponent;

// Don't auto-initialize - let the page control initialization
// initTeachersDetailsComponent();