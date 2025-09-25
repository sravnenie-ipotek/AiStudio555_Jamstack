/**
 * ABOUT US PAGE DATABASE INTEGRATION
 * Fetches ALL content from about_pages table and populates the page
 * CRITICAL: No hardcoded content should remain in about-us.html
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

    // Main function to load about page data
    async function loadAboutPageData() {
        try {
            console.log('🔄 Loading about page data from database...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/about-page?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch about page data: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ About page data loaded:', data);

            // Populate the page with data
            if (data.data) {
                populateAboutPage(data.data);
            } else {
                console.warn('⚠️ No about page data found in database');
            }

        } catch (error) {
            console.error('❌ Error loading about page data:', error);
            console.log('⚠️ Using static content as fallback');
        }
    }

    // Populate all sections of the about page
    function populateAboutPage(data) {
        console.log('📝 Populating about page sections:', Object.keys(data));

        // 1. Hero Section
        if (data.hero && data.hero.content) {
            populateHeroSection(data.hero.content);
        }

        // 2. Company Story Section
        if (data.story && data.story.content) {
            populateStorySection(data.story.content);
        }

        // 3. Mission & Vision Section
        if (data.mission && data.mission.content) {
            populateMissionSection(data.mission.content);
        }

        // 4. Values Section
        if (data.values && data.values.content) {
            populateValuesSection(data.values.content);
        }

        // 5. Team Section
        if (data.team && data.team.content) {
            populateTeamSection(data.team.content);
        }

        // 6. Statistics Section
        if (data.statistics && data.statistics.content) {
            populateStatisticsSection(data.statistics.content);
        }

        // 7. Achievements Section
        if (data.achievements && data.achievements.content) {
            populateAchievementsSection(data.achievements.content);
        }

        // 8. CTA Section
        if (data.cta && data.cta.content) {
            populateCTASection(data.cta.content);
        }
    }

    // Populate Hero Section
    function populateHeroSection(heroData) {
        console.log('🎯 Updating about hero section with:', heroData);

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

        // Update hero image
        if (heroData.hero_image) {
            const heroImages = document.querySelectorAll('.banner-image, .about-hero-image');
            heroImages.forEach(img => {
                img.src = heroData.hero_image;
                img.alt = heroData.title || 'About Us';
            });
        }

        console.log('✅ About hero section updated');
    }

    // Populate Company Story Section
    function populateStorySection(storyData) {
        console.log('📖 Updating company story section...');

        // Update section title
        if (storyData.title) {
            updateTextContent('.story-section .section-title', storyData.title);
        }

        // Update section subtitle
        if (storyData.subtitle) {
            updateTextContent('.story-section .section-subtitle', storyData.subtitle);
        }

        // Update story content
        if (storyData.content) {
            updateTextContent('.story-content', storyData.content);
        }

        // Update story description/paragraphs
        if (storyData.description) {
            updateTextContent('.story-description', storyData.description);
        }

        // Update story image
        if (storyData.image) {
            const storyImages = document.querySelectorAll('.story-image');
            storyImages.forEach(img => {
                img.src = storyData.image;
                img.alt = storyData.title || 'Our Story';
            });
        }

        console.log('✅ Company story section updated');
    }

    // Populate Mission & Vision Section
    function populateMissionSection(missionData) {
        console.log('🎯 Updating mission & vision section...');

        // Update section title
        if (missionData.title) {
            updateTextContent('.mission-section .section-title', missionData.title);
        }

        // Update mission content
        if (missionData.mission) {
            updateTextContent('.mission-content', missionData.mission);
            updateTextContent('.mission-text', missionData.mission);
        }

        // Update vision content
        if (missionData.vision) {
            updateTextContent('.vision-content', missionData.vision);
            updateTextContent('.vision-text', missionData.vision);
        }

        // Update mission title specifically
        if (missionData.mission_title) {
            updateTextContent('.mission-title', missionData.mission_title);
        }

        // Update vision title specifically
        if (missionData.vision_title) {
            updateTextContent('.vision-title', missionData.vision_title);
        }

        console.log('✅ Mission & vision section updated');
    }

    // Populate Values Section
    function populateValuesSection(valuesData) {
        console.log('💎 Updating values section...');

        // Update section title
        if (valuesData.title) {
            updateTextContent('.values-section .section-title', valuesData.title);
        }

        // Update section subtitle
        if (valuesData.subtitle) {
            updateTextContent('.values-section .section-subtitle', valuesData.subtitle);
        }

        // Update individual values
        if (valuesData.values && Array.isArray(valuesData.values)) {
            const valuesContainer = document.querySelector('.values-grid') ||
                                  document.querySelector('.values-list');

            if (valuesContainer) {
                // Clear existing values
                valuesContainer.innerHTML = '';

                // Create value items
                valuesData.values.forEach((value, index) => {
                    const valueItem = createValueItem(value, index);
                    valuesContainer.appendChild(valueItem);
                });
            }
        }

        console.log('✅ Values section updated');
    }

    // Create Value Item
    function createValueItem(value, index) {
        const valueItem = document.createElement('div');
        valueItem.className = 'value-item';

        valueItem.innerHTML = `
            <div class="value-card">
                ${value.icon ? `
                <div class="value-icon">
                    <img src="${value.icon}" alt="${value.title}" class="value-icon-image">
                </div>
                ` : ''}

                <div class="value-content">
                    <h3 class="value-title">${value.title || value.name}</h3>
                    <div class="value-description">${value.description}</div>
                </div>
            </div>
        `;

        return valueItem;
    }

    // Populate Team Section
    function populateTeamSection(teamData) {
        console.log('👥 Updating team section...');

        // Update section title
        if (teamData.title) {
            updateTextContent('.team-section .section-title', teamData.title);
        }

        // Update section subtitle
        if (teamData.subtitle) {
            updateTextContent('.team-section .section-subtitle', teamData.subtitle);
        }

        // Update team description
        if (teamData.description) {
            updateTextContent('.team-section .section-description-text', teamData.description);
        }

        // Update team members
        if (teamData.members && Array.isArray(teamData.members)) {
            const teamContainer = document.querySelector('.team-grid') ||
                                document.querySelector('.team-members');

            if (teamContainer) {
                // Clear existing team members
                teamContainer.innerHTML = '';

                // Create team member items
                teamData.members.forEach((member, index) => {
                    const memberItem = createTeamMemberItem(member, index);
                    teamContainer.appendChild(memberItem);
                });
            }
        }

        console.log('✅ Team section updated');
    }

    // Create Team Member Item
    function createTeamMemberItem(member, index) {
        const memberItem = document.createElement('div');
        memberItem.className = 'team-member-item';

        memberItem.innerHTML = `
            <div class="team-member-card">
                <div class="team-member-image-container">
                    <img src="${member.image || 'images/placeholder-team.jpg'}"
                         alt="${member.name}"
                         class="team-member-image">
                </div>

                <div class="team-member-content">
                    <h3 class="team-member-name">${member.name}</h3>
                    <div class="team-member-role">${member.role || member.position}</div>

                    ${member.bio ? `
                    <div class="team-member-bio">${member.bio}</div>
                    ` : ''}

                    ${member.social_links ? `
                    <div class="team-member-social">
                        ${member.social_links.linkedin ? `
                        <a href="${member.social_links.linkedin}" class="social-link" target="_blank">
                            <div class="social-icon">💼</div>
                        </a>
                        ` : ''}

                        ${member.social_links.twitter ? `
                        <a href="${member.social_links.twitter}" class="social-link" target="_blank">
                            <div class="social-icon">🐦</div>
                        </a>
                        ` : ''}

                        ${member.email ? `
                        <a href="mailto:${member.email}" class="social-link">
                            <div class="social-icon">📧</div>
                        </a>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        return memberItem;
    }

    // Populate Statistics Section
    function populateStatisticsSection(statsData) {
        console.log('📊 Updating statistics section...');

        // Update section title
        if (statsData.title) {
            updateTextContent('.stats-section .section-title', statsData.title);
        }

        // Update individual statistics
        if (statsData.stats && Array.isArray(statsData.stats)) {
            statsData.stats.forEach((stat, index) => {
                const statElement = document.querySelector(`.stat-item:nth-child(${index + 1})`) ||
                                  document.querySelector(`[data-stat="${stat.key}"]`);

                if (statElement) {
                    const numberElement = statElement.querySelector('.stat-number');
                    const labelElement = statElement.querySelector('.stat-label');

                    if (numberElement && stat.number) {
                        numberElement.textContent = stat.number;
                        // Add counter animation if needed
                        animateCounter(numberElement, stat.number);
                    }
                    if (labelElement && stat.label) {
                        labelElement.textContent = stat.label;
                    }
                }
            });
        }

        console.log('✅ Statistics section updated');
    }

    // Animate counter numbers
    function animateCounter(element, targetNumber) {
        const number = parseInt(targetNumber.replace(/[^\d]/g, ''));
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = number / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + targetNumber.replace(/[\d,]/g, '');
        }, duration / steps);
    }

    // Populate Achievements Section
    function populateAchievementsSection(achievementsData) {
        console.log('🏆 Updating achievements section...');

        // Update section title
        if (achievementsData.title) {
            updateTextContent('.achievements-section .section-title', achievementsData.title);
        }

        // Update achievements list
        if (achievementsData.achievements && Array.isArray(achievementsData.achievements)) {
            const achievementsContainer = document.querySelector('.achievements-grid') ||
                                        document.querySelector('.achievements-list');

            if (achievementsContainer) {
                // Clear existing achievements
                achievementsContainer.innerHTML = '';

                // Create achievement items
                achievementsData.achievements.forEach((achievement, index) => {
                    const achievementItem = createAchievementItem(achievement, index);
                    achievementsContainer.appendChild(achievementItem);
                });
            }
        }

        console.log('✅ Achievements section updated');
    }

    // Create Achievement Item
    function createAchievementItem(achievement, index) {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';

        achievementItem.innerHTML = `
            <div class="achievement-card">
                ${achievement.icon ? `
                <div class="achievement-icon">
                    <img src="${achievement.icon}" alt="${achievement.title}" class="achievement-icon-image">
                </div>
                ` : ''}

                <div class="achievement-content">
                    <h3 class="achievement-title">${achievement.title}</h3>

                    ${achievement.description ? `
                    <div class="achievement-description">${achievement.description}</div>
                    ` : ''}

                    ${achievement.year ? `
                    <div class="achievement-year">${achievement.year}</div>
                    ` : ''}
                </div>
            </div>
        `;

        return achievementItem;
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
        document.addEventListener('DOMContentLoaded', loadAboutPageData);
    } else {
        loadAboutPageData();
    }

    // Expose function globally for debugging
    window.reloadAboutPageData = loadAboutPageData;

})();