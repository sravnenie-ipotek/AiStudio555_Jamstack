/**
 * HOME PAGE DATABASE INTEGRATION
 * Fetches ALL content from nd_home table and populates the page
 * CRITICAL: No hardcoded content should remain in home.html
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from URL or default to 'en'
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') || 'en';
    }

    // Helper function to extract FAQ data from individual fields
    function extractFAQFromAttributes(attributes) {
        const faqItems = [];

        // Extract FAQ items from faq1Title/faq1Answer, faq2Title/faq2Answer, etc.
        for (let i = 1; i <= 10; i++) { // Check up to 10 FAQ items
            const titleKey = `faq${i}Title`;
            const answerKey = `faq${i}Answer`;

            if (attributes[titleKey] && attributes[answerKey]) {
                faqItems.push({
                    question: attributes[titleKey],
                    answer: attributes[answerKey]
                });
                console.log(`📄 Found FAQ ${i}: ${attributes[titleKey]}`);
            }
        }

        console.log(`📄 Extracted ${faqItems.length} FAQ items from attributes`);
        return {
            title: attributes.faqTitle || 'FAQ',
            items: faqItems
        };
    }

    // Main function to load home page data
    async function loadHomePageData() {
        try {
            console.log('🔄 Loading home page data from database...');
            console.log('⏰ Home integration start time:', new Date().toISOString());

            // Check if language manager has already run
            const sampleElement = document.querySelector('.faq-question');
            if (sampleElement) {
                console.log('🔍 Initial FAQ question state:', {
                    hasDataI18n: sampleElement.hasAttribute('data-i18n'),
                    dataI18nValue: sampleElement.getAttribute('data-i18n'),
                    currentText: sampleElement.textContent,
                    timestamp: new Date().toISOString()
                });
            }

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/nd/home-page?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch home data: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Home page data loaded. Keys:', Object.keys(data));

            // Debug data structure
            if (data.data) {
                console.log('🔍 data.data keys:', Object.keys(data.data));
                if (data.data.attributes) {
                    console.log('🔍 data.data.attributes exists. Keys:', Object.keys(data.data.attributes));
                    console.log('🔍 Has testimonials array?', Array.isArray(data.data.attributes.testimonials));
                    console.log('🔍 Has faq1Title?', !!data.data.attributes.faq1Title);
                }
            }

            // Debug old structure checks
            console.log('🔍 Old structure checks:');
            console.log('  - data.testimonials:', !!data.testimonials);
            console.log('  - data.testimonials_data:', !!data.testimonials_data);
            console.log('  - data.faq:', !!data.faq);

            console.log('📦 Full data structure sample:', JSON.stringify(data, null, 2).substring(0, 500) + '...');

            // Populate the page with data - handle the actual API structure
            if (data.data) {
                populateHomePage(data.data);
            } else {
                console.warn('⚠️ No home page data found in database');
                // Don't show anything if no data (per user requirement)
            }

        } catch (error) {
            console.error('❌ Error loading home page data:', error);
            // Don't show anything if API fails (per user requirement)
            console.log('⚠️ Using static content as fallback');

            // Still try to load featured courses even if home page data fails
            console.log('🎯 Featured courses will be handled by nd-courses-integration.js');
            // loadFeaturedCourses(); // DISABLED - handled by nd-courses-integration.js
        }
    }

    // Populate all sections of the home page
    function populateHomePage(data) {
        console.log('📝 Populating home page sections:', Object.keys(data));

        // 1. Hero Section - SKIP UI translation (handled by unified-language-manager)
        // Only handle dynamic URLs if needed
        if (data.hero && data.hero.content && data.hero.content.buttons) {
            updateHeroButtonURLs(data.hero.content.buttons);
        }

        // 2. Course Categories Section
        if (data.course_categories && data.course_categories.content) {
            populateCourseCategories(data.course_categories.content);
        } else if (data.courses && data.courses.content) {
            populateCourseCategories(data.courses.content);
        }

        // 3. Featured Courses Section (from separate API)
        // DISABLED: Let nd-courses-integration.js handle featured courses
        // Check if courses section should be visible
        if (data.courses && data.courses.visible === false) {
            hideFeaturedCoursesSection();
        } else {
            showFeaturedCoursesSection();
            // loadFeaturedCourses(); // DISABLED - handled by nd-courses-integration.js
            console.log('🎯 Featured courses will be handled by nd-courses-integration.js');
        }

        // 4. Features Section - SKIP (handled by unified-language-manager)
        // Features are static UI content

        // 3. About Section - SKIP UI translation (handled by unified-language-manager)
        // Only handle dynamic statistics if needed
        if (data.about && data.about.content && data.about.content.statistics) {
            updateAboutStatistics(data.about.content.statistics);
        }

        // 4. Testimonials Section - DISABLED for static translation support
        // Following dual-system architecture - testimonials handled by System 1 (data-i18n)
        // Dynamic testimonials loading disabled to preserve data-i18n attributes
        console.log('📍 Testimonials: Using static HTML with data-i18n attributes (System 1)');

        // 5. FAQ Section - DISABLED for static translation support
        // Following dual-system architecture - FAQ handled by System 1 (data-i18n)
        // Dynamic FAQ loading disabled to preserve data-i18n attributes
        console.log('📍 FAQ: Using static HTML with data-i18n attributes (System 1)');

        /* RACE CONDITION FIX: FAQ dynamic loading disabled
        if (data.faq && data.faq.content) {
            console.log('📍 Found FAQ data in new structure');
            populateFAQSection(data.faq.content);
        }
        // Fallback: Handle FAQ data from individual fields in API attributes (old structure)
        else if (data.attributes) {
            console.log('📍 Found attributes structure, processing FAQ from individual fields...');
            const faqData = extractFAQFromAttributes(data.attributes);
            if (faqData.items && faqData.items.length > 0) {
                populateFAQSection(faqData);
            }
        }
        */

        // 6. Process Section - SKIP (handled by unified-language-manager)
        // Process content is static UI

        // 7. Statistics Section
        if (data.statistics && data.statistics.content) {
            populateStatisticsSection(data.statistics.content);
        }
    }

    // DEPRECATED: populateHeroSection() - UI translation now handled by unified-language-manager
    // This function has been replaced by updateHeroButtonURLs() for dynamic URLs only

    // Populate Course Categories Section
    function populateCourseCategories(categoriesData) {
        console.log('📚 Updating course categories section...', categoriesData);

        // Update section titles
        if (categoriesData.subtitle) {
            updateTextContent('.course-categories .section-subtitle', categoriesData.subtitle);
        }
        if (categoriesData.title) {
            updateTextContent('.course-categories .section-title', categoriesData.title);
        }
        if (categoriesData.description) {
            updateTextContent('.course-categories .section-description-text', categoriesData.description);
        }

        // Update category items
        const categories = categoriesData.categories || categoriesData.items || [];
        if (categories.length > 0) {
            updateCategoryItems(categories);
        }

        console.log('✅ Course categories section updated');
    }

    // Update category items dynamically with shared card system
    function updateCategoryItems(categories) {
        console.log('🔄 Creating category items with shared card system:', categories.length);

        const container = document.querySelector('.course-categories-collection-list');
        if (!container) {
            console.warn('❌ Category container not found');
            return;
        }

        // Add shared cards grid class to container
        container.className = 'course-categories-collection-list shared-cards-grid w-dyn-items';

        // Clear existing items
        container.innerHTML = '';

        // Create category items (limit to 4 as requested)
        const limitedCategories = categories.slice(0, 4);

        limitedCategories.forEach((category, index) => {
            // Get category class for specific styling
            const categoryClass = getCategoryClass(category.name);
            const fullDescription = category.description || '';
            const isLongDescription = fullDescription.length > 120;

            // Create card directly (not wrapped in additional div)
            const categoryCard = document.createElement('a');
            categoryCard.className = `shared-card ${categoryClass}`;
            categoryCard.setAttribute('data-w-id', `category-${index}`);
            categoryCard.setAttribute('href', category.url || '#');
            categoryCard.setAttribute('data-category', category.name.toLowerCase().replace(/\s+/g, '-'));
            categoryCard.setAttribute('role', 'listitem');

            categoryCard.innerHTML = `
                <div class="shared-card-content">
                    <div class="shared-card-icon">
                        <img loading="lazy"
                             src="${category.icon || 'images/placeholder-icon.svg'}"
                             alt="${category.name}">
                    </div>

                    <h4 class="shared-card-title"
                        ${isLongText(category.name, 40) ? 'title="' + category.name + '"' : ''}>
                        ${category.name}
                    </h4>

                    <div class="shared-card-description ${isLongDescription ? 'expandable' : ''}"
                         ${isLongDescription ? 'title="' + fullDescription + '"' : ''}>
                        ${fullDescription}
                    </div>

                    ${isLongDescription ? '<div class="shared-card-tooltip">' + fullDescription + '</div>' : ''}
                </div>

                <div class="shared-card-bg"></div>
            `;

            // Add text overflow detection
            setTimeout(() => {
                const descElement = categoryCard.querySelector('.shared-card-description');
                if (descElement && isTextOverflowing(descElement)) {
                    descElement.classList.add('text-overflow');
                }
            }, 100);

            // Add click handler for expandable descriptions
            const descElement = categoryCard.querySelector('.shared-card-description.expandable');
            if (descElement) {
                descElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    descElement.classList.toggle('expanded');
                });
            }

            container.appendChild(categoryCard);
        });

        // Hide the "No items found" message
        const emptyState = document.querySelector('.course-categories-wrapper .w-dyn-empty');
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        console.log(`✅ Created ${limitedCategories.length} shared card category items`);
    }

    // Helper function to get category-specific CSS class
    function getCategoryClass(categoryName) {
        const name = categoryName.toLowerCase().replace(/\s+/g, '-');
        switch (name) {
            case 'web-development':
                return 'category-web-dev';
            case 'mobile-development':
                return 'category-mobile';
            case 'machine-learning':
                return 'category-ml';
            case 'cloud-computing':
                return 'category-cloud';
            default:
                return 'category-default';
        }
    }

    // Helper function to check if text is too long
    function isLongText(text, maxLength) {
        return text && text.length > maxLength;
    }

    // Helper function to detect text overflow
    function isTextOverflowing(element) {
        return element.scrollHeight > element.clientHeight;
    }

    // DEPRECATED: populateFeaturesSection() - UI translation now handled by unified-language-manager
    // Features are static UI content that should use data-i18n attributes

    // DEPRECATED: populateAboutSection() - UI translation now handled by unified-language-manager
    // This function has been replaced by updateAboutStatistics() for dynamic numbers only

    // Populate Testimonials Section
    function populateTestimonialsSection(testimonialsData) {
        console.log('💬 Updating testimonials section...');

        // DUAL-SYSTEM: Section title and subtitle handled by unified-language-manager
        // Do NOT update section title/subtitle here to avoid overriding translations
        console.log('🔄 Skipping section title/subtitle - handled by language manager');

        // Update testimonial cards
        // Handle the deeply nested structure from API: testimonials_data.content.content.content.content
        let testimonialItems = [];

        // Extract testimonials from various possible locations
        if (testimonialsData.content) {
            if (testimonialsData.content.content) {
                if (testimonialsData.content.content.content) {
                    if (testimonialsData.content.content.content.content) {
                        // Deepest nested level - actual testimonials at indices 0-5
                        testimonialItems = testimonialsData.content.content.content.content;
                        console.log('Found testimonials at deepest level (content.content.content.content)');
                    } else {
                        // One level up - might have some testimonials
                        testimonialItems = testimonialsData.content.content.content;
                        console.log('Found testimonials at content.content.content');
                    }
                } else if (testimonialsData.content.content) {
                    testimonialItems = testimonialsData.content.content;
                    console.log('Found testimonials at content.content');
                }
            } else if (testimonialsData.content) {
                testimonialItems = testimonialsData.content;
                console.log('Found testimonials at content');
            }
        }

        // Also check for items array
        if (testimonialsData.items && Array.isArray(testimonialsData.items)) {
            console.log(`📝 ${testimonialsData.items.length} testimonials in items array`);
        }

        // Handle both old nested format and new direct array format
        let actualTestimonialItems = testimonialItems;

        // If it's the new format with 'items' array, use that
        if (testimonialsData.items && Array.isArray(testimonialsData.items)) {
            console.log(`📋 Processing ${testimonialsData.items.length} testimonials from items array`);
            actualTestimonialItems = testimonialsData.items;

            // Convert new format to old format for processing
            const convertedItems = {};
            testimonialsData.items.forEach((item, index) => {
                convertedItems[index] = {
                    title: item.text ? item.text.substring(0, 50) + (item.text.length > 50 ? '...' : '') : '',
                    text: item.text || '',
                    name: item.author || '',
                    course_taken: item.course_taken || '',
                    role: item.role || ''
                };
            });
            actualTestimonialItems = convertedItems;
        }

        // Update individual testimonial cards by tab index
        if (actualTestimonialItems && typeof actualTestimonialItems === 'object') {
            // Update testimonials by index (0-6)
            for (let i = 0; i <= 6; i++) {
                if (actualTestimonialItems[i]) {
                    const testimonial = actualTestimonialItems[i];

                    // Find the tab pane for this index
                    let tabSelector = '';
                    if (i === 0) tabSelector = '[data-w-tab="Tab 1"]';
                    else if (i === 1) tabSelector = '[data-w-tab="Tab 2"]';
                    else if (i === 2) tabSelector = '[data-w-tab="Tab 3"]';
                    else if (i === 3) tabSelector = '[data-w-tab="Tab 4"]';
                    else if (i === 4) tabSelector = '[data-w-tab="Tab 5"]';
                    else if (i === 5) tabSelector = '[data-w-tab="Tab 6"]';
                    else if (i === 6) tabSelector = '[data-w-tab="Tab 7"]';

                    const tabPane = document.querySelector(`.testimonials-tab-pane${tabSelector}`);
                    if (tabPane) {
                        // Update title/text
                        const titleEl = tabPane.querySelector('.testimonials-title');
                        if (titleEl && testimonial.title) {
                            console.log(`🔍 Testimonial ${i + 1} title element before update:`, {
                                hasDataI18n: titleEl.hasAttribute('data-i18n'),
                                dataI18nValue: titleEl.getAttribute('data-i18n'),
                                currentText: titleEl.textContent
                            });

                            titleEl.textContent = `"${testimonial.title}"`;
                            titleEl.removeAttribute('data-i18n'); // Prevent overwrite by language manager

                            console.log(`✅ Testimonial ${i + 1} title updated:`, {
                                newText: `"${testimonial.title}"`,
                                hasDataI18nAfter: titleEl.hasAttribute('data-i18n')
                            });
                        } else if (titleEl && testimonial.text) {
                            console.log(`🔍 Testimonial ${i + 1} title element before update (using text):`, {
                                hasDataI18n: titleEl.hasAttribute('data-i18n'),
                                dataI18nValue: titleEl.getAttribute('data-i18n'),
                                currentText: titleEl.textContent
                            });

                            // If no title, use first part of text
                            const shortText = testimonial.text.substring(0, 50);
                            const newTitle = `"${shortText}${testimonial.text.length > 50 ? '...' : ''}"`;
                            titleEl.textContent = newTitle;
                            titleEl.removeAttribute('data-i18n'); // Prevent overwrite by language manager

                            console.log(`✅ Testimonial ${i + 1} title updated (using text):`, {
                                newText: newTitle,
                                hasDataI18nAfter: titleEl.hasAttribute('data-i18n')
                            });
                        }

                        // Update description text
                        const textEl = tabPane.querySelector('.testimonials-card-description-text');
                        if (textEl && testimonial.text) {
                            console.log(`🔍 Testimonial ${i + 1} description element before update:`, {
                                hasDataI18n: textEl.hasAttribute('data-i18n'),
                                dataI18nValue: textEl.getAttribute('data-i18n'),
                                currentText: textEl.textContent
                            });

                            textEl.textContent = `"${testimonial.text}"`;
                            textEl.removeAttribute('data-i18n'); // Prevent overwrite by language manager

                            console.log(`✅ Testimonial ${i + 1} description updated:`, {
                                newText: `"${testimonial.text}"`,
                                hasDataI18nAfter: textEl.hasAttribute('data-i18n')
                            });
                        }

                        // Update author name
                        const nameEl = tabPane.querySelector('.testimonials-card-author-name');
                        if (nameEl && testimonial.name) {
                            console.log(`🔍 Testimonial ${i + 1} name element before update:`, {
                                hasDataI18n: nameEl.hasAttribute('data-i18n'),
                                dataI18nValue: nameEl.getAttribute('data-i18n'),
                                currentText: nameEl.textContent
                            });

                            nameEl.textContent = testimonial.name;
                            nameEl.removeAttribute('data-i18n'); // Prevent overwrite by language manager

                            console.log(`✅ Testimonial ${i + 1} name updated:`, {
                                newText: testimonial.name,
                                hasDataI18nAfter: nameEl.hasAttribute('data-i18n')
                            });
                        }

                        // Update author role/course
                        const roleEl = tabPane.querySelector('.testimonials-card-author-bio-text');
                        if (roleEl && testimonial.course_taken) {
                            console.log(`🔍 Testimonial ${i + 1} role element before update (course):`, {
                                hasDataI18n: roleEl.hasAttribute('data-i18n'),
                                dataI18nValue: roleEl.getAttribute('data-i18n'),
                                currentText: roleEl.textContent
                            });

                            roleEl.textContent = testimonial.course_taken;
                            roleEl.removeAttribute('data-i18n'); // Prevent overwrite by language manager

                            console.log(`✅ Testimonial ${i + 1} role updated (course):`, {
                                newText: testimonial.course_taken,
                                hasDataI18nAfter: roleEl.hasAttribute('data-i18n')
                            });
                        } else if (roleEl && testimonial.role) {
                            console.log(`🔍 Testimonial ${i + 1} role element before update (role):`, {
                                hasDataI18n: roleEl.hasAttribute('data-i18n'),
                                dataI18nValue: roleEl.getAttribute('data-i18n'),
                                currentText: roleEl.textContent
                            });

                            roleEl.textContent = testimonial.role;
                            roleEl.removeAttribute('data-i18n'); // Prevent overwrite by language manager

                            console.log(`✅ Testimonial ${i + 1} role updated (role):`, {
                                newText: testimonial.role,
                                hasDataI18nAfter: roleEl.hasAttribute('data-i18n')
                            });
                        }

                        console.log(`✅ Updated testimonial ${i + 1}: ${testimonial.name || 'Anonymous'}`);
                    }
                }
            }
        }

        console.log('✅ Testimonials section updated');

        // DUAL-SYSTEM ARCHITECTURE: System 2 (Dynamic Content)
        // Following WorkingLogic.md - testimonials are dynamic content from database
        // Keep data-i18n attributes for elements that should be translated by System 1
        // Only remove data-i18n from elements that have been updated with dynamic content
        console.log('✅ Testimonials populated following dual-system architecture')
    }

    // Populate FAQ Section
    function populateFAQSection(faqData) {
        console.log('❓ Updating FAQ section...');

        // Find FAQ section - it might be in a different location
        const faqSection = document.querySelector('.faq-section') ||
                         document.querySelector('[data-section="faq"]') ||
                         document.querySelector('.faq');

        if (faqSection && faqData) {
            // DUAL-SYSTEM: FAQ section title handled by unified-language-manager
            // Do NOT update section title here to avoid overriding translations
            console.log('🔄 Skipping FAQ section title - handled by language manager');

            // Update FAQ items if they exist
            if (faqData.items && Array.isArray(faqData.items)) {
                console.log(`📝 ${faqData.items.length} FAQ items available`);

                // Update each FAQ accordion item
                faqData.items.forEach((item, index) => {
                    // Find the tab for this FAQ (Tab 1, Tab 2, etc.)
                    const tabNumber = index + 1;
                    const faqTab = document.querySelector(`[data-w-tab="Tab ${tabNumber}"].single-faq-accordion-wrap`);

                    if (faqTab) {
                        // Update question
                        const questionEl = faqTab.querySelector('.faq-question');
                        if (questionEl && item.question) {
                            console.log(`🔍 FAQ ${tabNumber} question element before update:`, {
                                hasDataI18n: questionEl.hasAttribute('data-i18n'),
                                dataI18nValue: questionEl.getAttribute('data-i18n'),
                                currentText: questionEl.textContent
                            });

                            // Add "Q: " prefix if not already present
                            const questionText = item.question.startsWith('Q:') ? item.question : `Q: ${item.question}`;
                            questionEl.textContent = questionText;
                            // Keep data-i18n for fallback translations

                            console.log(`✅ FAQ ${tabNumber} question updated:`, {
                                newText: questionText,
                                hasDataI18nAfter: questionEl.hasAttribute('data-i18n'),
                                dataI18nAfter: questionEl.getAttribute('data-i18n')
                            });
                        }

                        // Update answer
                        const answerEl = faqTab.querySelector('.faq-answer');
                        if (answerEl && item.answer) {
                            console.log(`🔍 FAQ ${tabNumber} answer element before update:`, {
                                hasDataI18n: answerEl.hasAttribute('data-i18n'),
                                dataI18nValue: answerEl.getAttribute('data-i18n'),
                                currentText: answerEl.textContent
                            });

                            answerEl.textContent = item.answer;
                            // Keep data-i18n for fallback translations

                            console.log(`✅ FAQ ${tabNumber} answer updated:`, {
                                newText: item.answer,
                                hasDataI18nAfter: answerEl.hasAttribute('data-i18n'),
                                dataI18nAfter: answerEl.getAttribute('data-i18n')
                            });
                        }

                        console.log(`✅ Updated FAQ ${tabNumber}: ${item.question}`);
                    } else {
                        console.log(`⚠️ FAQ tab ${tabNumber} not found`);
                    }
                });
            }

            // Also handle nested content structure (for API compatibility)
            if (faqData.content && faqData.content.items && Array.isArray(faqData.content.items)) {
                console.log(`📝 ${faqData.content.items.length} FAQ items in nested structure`);

                faqData.content.items.forEach((item, index) => {
                    const tabNumber = index + 1;
                    const faqTab = document.querySelector(`[data-w-tab="Tab ${tabNumber}"].single-faq-accordion-wrap`);

                    if (faqTab) {
                        // Update question
                        const questionEl = faqTab.querySelector('.faq-question');
                        if (questionEl && item.question) {
                            console.log(`🔍 FAQ ${tabNumber} question element before update (nested):`, {
                                hasDataI18n: questionEl.hasAttribute('data-i18n'),
                                dataI18nValue: questionEl.getAttribute('data-i18n'),
                                currentText: questionEl.textContent
                            });

                            const questionText = item.question.startsWith('Q:') ? item.question : `Q: ${item.question}`;
                            questionEl.textContent = questionText;
                            questionEl.removeAttribute('data-i18n'); // Prevent overwrite by language manager

                            console.log(`✅ FAQ ${tabNumber} question updated (nested):`, {
                                newText: questionText,
                                hasDataI18nAfter: questionEl.hasAttribute('data-i18n'),
                                dataI18nAfter: questionEl.getAttribute('data-i18n')
                            });
                        }

                        // Update answer
                        const answerEl = faqTab.querySelector('.faq-answer');
                        if (answerEl && item.answer) {
                            console.log(`🔍 FAQ ${tabNumber} answer element before update (nested):`, {
                                hasDataI18n: answerEl.hasAttribute('data-i18n'),
                                dataI18nValue: answerEl.getAttribute('data-i18n'),
                                currentText: answerEl.textContent
                            });

                            answerEl.textContent = item.answer;
                            // Keep data-i18n for fallback translations

                            console.log(`✅ FAQ ${tabNumber} answer updated (nested):`, {
                                newText: item.answer,
                                hasDataI18nAfter: answerEl.hasAttribute('data-i18n'),
                                dataI18nAfter: answerEl.getAttribute('data-i18n')
                            });
                        }

                        console.log(`✅ Updated FAQ ${tabNumber} from nested structure`);
                    }
                });
            }
        }

        console.log('✅ FAQ section updated');

        // No delayed cleanup needed - let the dual-system work naturally
    }

    // DEPRECATED: populateProcessSection() - UI translation now handled by unified-language-manager
    // Process content is static UI that should use data-i18n attributes

    // DEPRECATED: populateCTASection() - UI translation now handled by unified-language-manager
    // CTA content is static UI that should use data-i18n attributes

    // Populate Statistics Section
    function populateStatisticsSection(statsData) {
        console.log('📊 Updating statistics...');

        if (statsData) {
            // Update course count
            if (statsData.total_courses) {
                const courseCounter = document.querySelector('[data-stat="courses"]');
                if (courseCounter) {
                    courseCounter.textContent = statsData.total_courses;
                }
            }

            // Update student count
            if (statsData.total_students) {
                const studentCounter = document.querySelector('[data-stat="students"]');
                if (studentCounter) {
                    studentCounter.textContent = statsData.total_students;
                }
            }

            // Update success rate
            if (statsData.success_rate) {
                const successRate = document.querySelector('[data-stat="success-rate"]');
                if (successRate) {
                    successRate.textContent = statsData.success_rate + '%';
                }
            }
        }

        console.log('✅ Statistics updated');
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

    // ==================== HELPER FUNCTIONS FOR DYNAMIC CONTENT ====================

    // Update only dynamic URLs in hero buttons (not text - that's handled by data-i18n)
    function updateHeroButtonURLs(buttons) {
        console.log('🔗 Updating hero button URLs only...');

        if (buttons && Array.isArray(buttons)) {
            const primaryButton = document.querySelector('.banner-button-wrapper .primary-button:first-child');
            if (primaryButton && buttons[0] && buttons[0].url) {
                let url = buttons[0].url;
                if (url && !url.startsWith('http') && !url.startsWith('#') && !url.includes('.html')) {
                    url = 'https://' + url;
                }
                primaryButton.href = url;
                console.log('✅ Updated primary button URL');
            }

            const secondaryButton = document.querySelector('.banner-button-wrapper .primary-button.secondary');
            if (secondaryButton && buttons[1] && buttons[1].url) {
                secondaryButton.href = buttons[1].url;
                console.log('✅ Updated secondary button URL');
            }
        }
    }

    // Update only dynamic statistics numbers (not labels - that's handled by data-i18n)
    function updateAboutStatistics(statistics) {
        console.log('📊 Updating about statistics numbers only...');

        if (statistics.courses) {
            const courseCounter = document.querySelector('.about-us-counter-single:nth-child(1) .about-us-counter-number');
            if (courseCounter) courseCounter.textContent = statistics.courses;
        }

        if (statistics.students) {
            const studentCounter = document.querySelector('.about-us-counter-single:nth-child(2) .about-us-counter-number');
            if (studentCounter) studentCounter.textContent = statistics.students;
        }

        if (statistics.experience) {
            const experienceCounter = document.querySelector('.about-us-counter-single:nth-child(3) .about-us-counter-number');
            if (experienceCounter) experienceCounter.textContent = statistics.experience;
        }

        console.log('✅ About statistics updated');
    }

    // Initialize when DOM is ready - with delay to let language manager run first
    function initializeWithDelay() {
        // Wait longer to ensure unified-language-manager.js has fully processed all translations
        setTimeout(() => {
            console.log('🚀 Starting home integration after language manager completes');
            console.log('⏰ Delayed start time:', new Date().toISOString());
            loadHomePageData();
        }, 2000); // 2 second delay to ensure language manager finishes completely
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWithDelay);
    } else {
        initializeWithDelay();
    }

    // ==================== FEATURED COURSES SECTION ====================

    // Load Featured Courses from separate API
    async function loadFeaturedCourses() {
        try {
            console.log('🎯 Loading featured courses from API...');

            const response = await fetch(`${API_BASE_URL}/api/nd/courses?featured=true&limit=8`);

            if (!response.ok) {
                throw new Error(`Failed to fetch featured courses: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Featured courses data loaded:', data);

            // Populate the featured courses section
            if (data.data && data.data.length > 0) {
                // Transform the API response to match expected format
                const transformedCourses = data.data.map(course => ({
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    price: course.price,
                    duration: course.duration,
                    lessons_count: course.lessons_count,
                    rating: course.rating,
                    image: course.image,
                    url: `detail_courses.html?id=${course.id}`
                }));

                await populateFeaturedCourses({ courses: transformedCourses });
                setupCourseTabFiltering(transformedCourses);
            } else {
                console.warn('⚠️ No featured courses data found');
            }

        } catch (error) {
            console.error('❌ Error loading featured courses:', error);
            // Don't break the page if courses can't load
        }
    }

    // Populate Featured Courses Section (async to handle shared card component)
    async function populateFeaturedCourses(coursesData) {
        console.log('🎯 Populating featured courses section...');

        const courses = coursesData.courses || [];
        console.log(`📚 ${courses.length} courses available`);

        // Find all tab content containers
        const tabContainers = document.querySelectorAll('.featured-courses-tab-pane .featured-courses-collection-list');

        for (const container of tabContainers) {
            // Clear existing placeholder content
            container.innerHTML = '';

            // Populate with actual courses (show all courses in each tab for now)
            for (const course of courses.slice(0, 6)) {
                const courseCard = await createFeaturedCourseCard(course);
                container.appendChild(courseCard);
            }

            // Hide the "No items found" message
            const emptyState = container.parentElement.querySelector('.w-dyn-empty');
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }

        console.log('✅ Featured courses section populated');
    }

    // Hide Featured Courses Section when toggle is off
    function hideFeaturedCoursesSection() {
        const featuredCoursesSection = document.querySelector('body > div > section.section.featured-courses');
        if (featuredCoursesSection) {
            featuredCoursesSection.style.display = 'none';
            console.log('🙈 Featured courses section hidden via admin toggle');
        }
    }

    // Show Featured Courses Section when toggle is on
    function showFeaturedCoursesSection() {
        const featuredCoursesSection = document.querySelector('body > div > section.section.featured-courses');
        if (featuredCoursesSection) {
            featuredCoursesSection.style.display = 'block';
            console.log('👁️ Featured courses section shown via admin toggle');
        }
    }

    // Create Featured Course Card using Shared Component
    async function createFeaturedCourseCard(course) {
        // Always try to use shared course card component first
        if (window.CourseCard && window.CourseCard.create) {
            try {
                console.log('🎯 Using shared course card component for:', course.title);
                const sharedCard = await window.CourseCard.create(course, {
                    customClass: 'featured-courses-collection-item'
                });
                console.log('✅ Shared card created successfully');
                return sharedCard;
            } catch (error) {
                console.error('❌ Shared card component failed for home:', error);
            }
        } else {
            console.warn('⚠️ Shared course card component not available on home page');
        }

        // Fallback to original implementation
        console.log('🔄 Using fallback card for home:', course.title);
        return createFallbackFeaturedCourseCard(course);
    }

    // Fallback Featured Course Card (original implementation)
    function createFallbackFeaturedCourseCard(course) {
        const courseItem = document.createElement('div');
        courseItem.className = 'featured-courses-collection-item w-dyn-item';
        courseItem.setAttribute('role', 'listitem');

        // Get category color based on course category
        const categoryColor = getCourseColorByCategory(course.category);

        courseItem.innerHTML = `
            <div class="featured-courses-single" style="background-color: rgb(4,25,63)">
                <a href="${course.url || '#'}" class="featured-courses-image-link w-inline-block">
                    <img loading="lazy"
                         src="${course.image || 'images/placeholder.jpg'}"
                         alt="${course.title}"
                         class="featured-courses-image">
                </a>
                <div class="featured-courses-typography">
                    <div class="featured-courses-name-wrap">
                        <a href="${course.url || '#'}" class="featured-courses-name course-title-overflow">
                            ${course.title}
                        </a>
                        <div class="featured-courses-rating">
                            <div class="featured-courses-rating-icon-wrapper">
                                ${generateStarRating(course.rating || 5)}
                            </div>
                            <div class="featured-courses-rating-text">
                                ${course.rating || '5.0'} (${course.reviews_count || 0})
                            </div>
                        </div>
                        <div class="courses-video-session-time-wrap">
                            <div class="courses-video-session-time">
                                <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                                <div class="courses-video-session-time-text">
                                    ${course.lessons_count || 0} Lessons
                                </div>
                            </div>
                            <div class="courses-video-session-time">
                                <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                                <div class="courses-video-session-time-text">
                                    ${course.duration || '8 weeks'}
                                </div>
                            </div>
                        </div>
                        <div class="featured-courses-button-wrapper">
                            <a href="${course.url || '#'}"
                               class="primary-button secondary w-inline-block"
                               style="background-color: rgba(255,255,255,0); color: rgb(255,255,255)">
                                <div class="primary-button-text-wrap">
                                    <div class="primary-button-text-block">Course Details</div>
                                    <div class="primary-button-text-block is-text-absolute">Course Details</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="featured-courses-categories-tag course-category-overflow"
                     style="background-color: ${categoryColor}; color: rgb(255,255,255)">
                    ${course.category}
                </div>
            </div>
        `;

        // Add text overflow handling
        setupTextOverflowForCard(courseItem);

        return courseItem;
    }

    // Text overflow handling for fallback cards
    function setupTextOverflowForCard(cardElement) {
        const titleElement = cardElement.querySelector('.course-title-overflow');
        if (titleElement && titleElement.textContent.length > 60) {
            titleElement.setAttribute('title', titleElement.textContent);
            titleElement.style.overflow = 'hidden';
            titleElement.style.textOverflow = 'ellipsis';
            titleElement.style.display = '-webkit-box';
            titleElement.style.webkitLineClamp = '2';
            titleElement.style.webkitBoxOrient = 'vertical';
        }

        const categoryElement = cardElement.querySelector('.course-category-overflow');
        if (categoryElement && categoryElement.textContent.length > 15) {
            categoryElement.setAttribute('title', categoryElement.textContent);
        }
    }

    // Setup Course Tab Filtering
    function setupCourseTabFiltering(allCourses) {
        console.log('⚙️ Setting up course tab filtering...');

        const tabLinks = document.querySelectorAll('.featured-courses-tab-link');
        const tabPanes = document.querySelectorAll('.featured-courses-tab-pane');

        tabLinks.forEach((tabLink, index) => {
            tabLink.addEventListener('click', async (e) => {
                e.preventDefault();

                // Get tab category
                let category = 'all';
                const tabText = tabLink.textContent.trim().toLowerCase();

                if (tabText.includes('web')) category = 'Web Development';
                else if (tabText.includes('app')) category = 'App Development';
                else if (tabText.includes('machine')) category = 'Machine Learning';
                else if (tabText.includes('cloud')) category = 'Cloud Computing';

                // Filter courses based on category
                let filteredCourses = allCourses || [];
                if (category !== 'all') {
                    filteredCourses = allCourses.filter(course =>
                        course.category && course.category.toLowerCase() === category.toLowerCase()
                    );
                }
                console.log(`🔍 Filtering to category "${category}": ${filteredCourses.length} courses`);

                // Find the corresponding tab pane
                const targetPane = tabPanes[index];
                if (targetPane) {
                    const container = targetPane.querySelector('.featured-courses-collection-list');
                    if (container) {
                        // Clear and repopulate (async)
                        container.innerHTML = '';

                        // Populate filtered courses
                        for (const course of filteredCourses.slice(0, 6)) {
                            const courseCard = await createFeaturedCourseCard(course);
                            container.appendChild(courseCard);
                        }

                        // Show empty state if no courses
                        const emptyState = targetPane.querySelector('.w-dyn-empty');
                        if (emptyState) {
                            emptyState.style.display = filteredCourses.length === 0 ? 'block' : 'none';
                        }
                    }
                }
            });
        });

        console.log('✅ Course tab filtering setup complete');
    }

    // Helper Functions
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        let starsHtml = '';

        for (let i = 0; i < 5; i++) {
            starsHtml += '<img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">';
        }

        return starsHtml;
    }

    function getCourseColorByCategory(category) {
        if (!category) return '#667eea';

        const cat = category.toLowerCase();
        if (cat.includes('web')) return '#667eea';
        if (cat.includes('app') || cat.includes('mobile')) return '#f093fb';
        if (cat.includes('machine') || cat.includes('ml') || cat.includes('ai')) return '#4facfe';
        if (cat.includes('cloud')) return '#43e97b';

        return '#667eea'; // default
    }

    // ==================== END FEATURED COURSES ====================

    // Expose function globally for debugging
    window.reloadHomePageData = loadHomePageData;
    window.loadFeaturedCourses = loadFeaturedCourses;

})();