/**
 * TEACHERS PAGE DATABASE INTEGRATION
 * Fetches ALL content from nd_teachers_page table and populates the page
 * CRITICAL: No hardcoded content should remain in teachers.html
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:1337'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from URL or default to 'en'
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPath = window.location.pathname;

        // Check if we're in a language subdirectory
        if (urlPath.includes('/en/')) return 'en';
        if (urlPath.includes('/ru/')) return 'ru';
        if (urlPath.includes('/he/')) return 'he';

        return urlParams.get('locale') || 'en';
    }

    // Main function to load teachers page data
    async function loadTeachersPageData() {
        try {
            console.log('🔄 Loading teachers page data from database...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/nd/teachers-page?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch teachers page data: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Teachers page data loaded:', data);

            // Populate the page with data
            if (data.data) {
                populateTeachersPage(data.data);
            } else {
                console.warn('⚠️ No teachers page data found in database');
            }

            // Load individual teachers
            await loadTeachers();

        } catch (error) {
            console.error('❌ Error loading teachers page data:', error);
            console.log('⚠️ Using static content as fallback');
        }
    }

    // Populate all sections of the teachers page
    function populateTeachersPage(data) {
        console.log('📝 Populating teachers page sections:', Object.keys(data));

        // 1. Hero Section
        if (data.hero && data.hero.content) {
            populateHeroSection(data.hero.content);
        }

        // 2. Teachers Section Header
        if (data.teachers_section && data.teachers_section.content) {
            populateTeachersSectionHeader(data.teachers_section.content);
        }

        // 3. Stats/Features Section
        if (data.stats && data.stats.content) {
            populateStatsSection(data.stats.content);
        }

        // 4. CTA Section
        if (data.cta && data.cta.content) {
            populateCTASection(data.cta.content);
        }

        // 5. FAQ Section
        if (data.faq && data.faq.content) {
            populateFAQSection(data.faq.content);
        }
    }

    // Populate Hero Section
    function populateHeroSection(heroData) {
        console.log('🎯 Updating teachers hero section with:', heroData);

        // Update page title
        if (heroData.title) {
            updateTextContent('.banner-heading', heroData.title);
            // Also update document title
            document.title = heroData.title + ' - AI Studio';
        }

        // Update subtitle
        if (heroData.subtitle) {
            updateTextContent('.banner-subtitle', heroData.subtitle);
        }

        // Update description
        if (heroData.description) {
            updateTextContent('.banner-description-text', heroData.description);
        }

        // Update breadcrumb
        if (heroData.breadcrumb) {
            updateTextContent('.breadcrumb-current', heroData.breadcrumb);
        }

        console.log('✅ Teachers hero section updated');
    }

    // Populate Teachers Section Header
    function populateTeachersSectionHeader(sectionData) {
        console.log('👨‍🏫 Updating teachers section header...');

        // Update section title
        if (sectionData.title) {
            updateTextContent('.teachers-section .section-title', sectionData.title);
        }

        // Update section subtitle
        if (sectionData.subtitle) {
            updateTextContent('.teachers-section .section-subtitle', sectionData.subtitle);
        }

        // Update section description
        if (sectionData.description) {
            updateTextContent('.teachers-section .section-description-text', sectionData.description);
        }

        console.log('✅ Teachers section header updated');
    }

    // Load Individual Teachers from API
    async function loadTeachers() {
        try {
            console.log('🎯 Loading teachers from API...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/nd/teachers?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch teachers: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Teachers data loaded:', data);

            // Populate the teachers grid
            if (data.success && data.data) {
                populateTeachersGrid(data.data);
            } else {
                console.warn('⚠️ No teachers data found');
            }

        } catch (error) {
            console.error('❌ Error loading teachers:', error);
        }
    }

    // Populate Teachers Grid with dynamic cards
    function populateTeachersGrid(teachers) {
        console.log('👥 Creating teacher cards:', teachers.length);

        const container = document.querySelector('.teachers-collection-list') ||
                         document.querySelector('.teacher-card-grid');

        if (!container) {
            console.warn('❌ Teachers container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Add grid styling if not present
        if (!container.classList.contains('teacher-card-grid')) {
            container.className = 'teachers-collection-list teacher-card-grid w-dyn-items';
        }

        // Create teacher cards
        teachers.forEach((teacher, index) => {
            const teacherCard = createTeacherCard(teacher);
            container.appendChild(teacherCard);
        });

        // Hide empty state
        const emptyState = document.querySelector('.teachers-wrapper .w-dyn-empty');
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        console.log(`✅ Created ${teachers.length} teacher cards`);
    }

    // Create Individual Teacher Card
    function createTeacherCard(teacher) {
        const teacherCard = document.createElement('div');
        teacherCard.className = 'teachers-collection-item teacher-card w-dyn-item';
        teacherCard.setAttribute('role', 'listitem');

        // Add click handler for drill-down navigation
        teacherCard.style.cursor = 'pointer';
        teacherCard.onclick = function() {
            // Navigate to teacher detail page with teacher ID
            const teacherId = teacher.id || teacher.teacher_key;
            const currentLocale = getCurrentLocale();
            window.location.href = `teacher-detail.html?id=${teacherId}&locale=${currentLocale}`;
        };

        teacherCard.innerHTML = `
            <div class="teachers-single">
                <div class="teacher-image-container">
                    <img loading="lazy"
                         src="${teacher.image || 'images/placeholder-teacher.jpg'}"
                         alt="${teacher.name}"
                         class="teachers-image">
                </div>

                <div class="teachers-content">
                    <div class="teachers-typography">
                        <h3 class="teachers-name">${teacher.name}</h3>

                        <div class="teachers-role">
                            ${teacher.title || teacher.specialization || 'Expert Instructor'}
                        </div>

                        <div class="teachers-description">
                            ${teacher.bio || teacher.description || ''}
                        </div>

                        ${teacher.specialties ? `
                        <div class="teachers-specialties">
                            <div class="teachers-specialties-title">Specialties:</div>
                            <div class="teachers-specialties-list">
                                ${Array.isArray(teacher.specialties)
                                    ? teacher.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')
                                    : teacher.specialties}
                            </div>
                        </div>
                        ` : ''}

                        ${teacher.experience_years ? `
                        <div class="teachers-experience">
                            <span class="experience-years">${teacher.experience_years}</span> years of experience
                        </div>
                        ` : ''}
                    </div>

                    ${teacher.social_links || teacher.email ? `
                    <div class="teachers-social">
                        ${teacher.email ? `
                        <a href="mailto:${teacher.email}" class="teachers-social-link">
                            <div class="teachers-social-icon">📧</div>
                        </a>
                        ` : ''}

                        ${teacher.social_links && teacher.social_links.linkedin ? `
                        <a href="${teacher.social_links.linkedin}" class="teachers-social-link" target="_blank">
                            <div class="teachers-social-icon">💼</div>
                        </a>
                        ` : ''}

                        ${teacher.social_links && teacher.social_links.twitter ? `
                        <a href="${teacher.social_links.twitter}" class="teachers-social-link" target="_blank">
                            <div class="teachers-social-icon">🐦</div>
                        </a>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        return teacherCard;
    }

    // Populate Stats Section
    function populateStatsSection(statsData) {
        console.log('📊 Updating stats section...');

        // Update section title
        if (statsData.title) {
            updateTextContent('.stats-section .section-title', statsData.title);
        }

        // Update individual stats
        if (statsData.stats && Array.isArray(statsData.stats)) {
            statsData.stats.forEach((stat, index) => {
                const statElement = document.querySelector(`.stat-item:nth-child(${index + 1})`);
                if (statElement) {
                    const numberElement = statElement.querySelector('.stat-number');
                    const labelElement = statElement.querySelector('.stat-label');

                    if (numberElement && stat.number) {
                        numberElement.textContent = stat.number;
                    }
                    if (labelElement && stat.label) {
                        labelElement.textContent = stat.label;
                    }
                }
            });
        }

        console.log('✅ Stats section updated');
    }

    // Populate CTA Section
    function populateCTASection(ctaData) {
        console.log('📢 Updating CTA section...');

        // Find CTA section
        const ctaSection = document.querySelector('.cta-section') ||
                          document.querySelector('[data-section="cta"]');

        if (ctaSection && ctaData) {
            // Update CTA title
            if (ctaData.title) {
                updateTextContent('.cta-section .section-title', ctaData.title);
            }

            // Update CTA description
            if (ctaData.description) {
                updateTextContent('.cta-section .section-description-text', ctaData.description);
            }

            // Update CTA button
            if (ctaData.button_text) {
                const ctaButton = ctaSection.querySelector('.primary-button');
                if (ctaButton) {
                    const buttonTexts = ctaButton.querySelectorAll('.primary-button-text-block');
                    buttonTexts.forEach(el => {
                        el.textContent = ctaData.button_text;
                    });
                    if (ctaData.button_link) {
                        ctaButton.href = ctaData.button_link;
                    }
                }
            }
        }

        console.log('✅ CTA section updated');
    }

    // Populate FAQ Section
    function populateFAQSection(faqData) {
        console.log('❓ Updating FAQ section...');

        // Find FAQ section
        const faqSection = document.querySelector('.faq-section') ||
                         document.querySelector('[data-section="faq"]');

        if (faqSection && faqData) {
            // Update FAQ title
            if (faqData.title) {
                updateTextContent('.faq-section .section-title', faqData.title);
            }

            // Update FAQ items
            if (faqData.items && Array.isArray(faqData.items)) {
                console.log(`📝 ${faqData.items.length} FAQ items available`);

                const faqContainer = faqSection.querySelector('.faq-list') ||
                                   faqSection.querySelector('.accordion-list');

                if (faqContainer) {
                    // Clear existing FAQs
                    faqContainer.innerHTML = '';

                    // Create FAQ items
                    faqData.items.forEach((faq, index) => {
                        const faqItem = createFAQItem(faq, index);
                        faqContainer.appendChild(faqItem);
                    });
                }
            }
        }

        console.log('✅ FAQ section updated');
    }

    // Create FAQ Item
    function createFAQItem(faq, index) {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item accordion-item';

        faqItem.innerHTML = `
            <div class="faq-question accordion-header" data-faq-toggle="${index}">
                <h3 class="faq-question-text">${faq.question}</h3>
                <div class="faq-icon">+</div>
            </div>
            <div class="faq-answer accordion-content" data-faq-content="${index}">
                <div class="faq-answer-text">${faq.answer}</div>
            </div>
        `;

        // Add click handler for accordion functionality
        const questionElement = faqItem.querySelector('.faq-question');
        const answerElement = faqItem.querySelector('.faq-answer');
        const iconElement = faqItem.querySelector('.faq-icon');

        questionElement.addEventListener('click', () => {
            const isOpen = answerElement.style.display === 'block';

            // Close all other FAQs
            document.querySelectorAll('.faq-answer').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('.faq-icon').forEach(el => {
                el.textContent = '+';
            });

            // Toggle current FAQ
            if (!isOpen) {
                answerElement.style.display = 'block';
                iconElement.textContent = '−';
            }
        });

        return faqItem;
    }

    // Utility function to safely update text content
    function updateTextContent(selector, text) {
        if (!text) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.textContent = text;
                // Remove opacity:0 to ensure content is visible
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadTeachersPageData);
    } else {
        loadTeachersPageData();
    }

    // Expose function globally for debugging
    window.reloadTeachersPageData = loadTeachersPageData;
    window.loadTeachers = loadTeachers;

})();