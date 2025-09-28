/**
 * Pricing Table Mobile Fix
 * Dynamically creates feature lists for each pricing plan on mobile devices
 * Maps features from the first column to each plan column
 */

document.addEventListener('DOMContentLoaded', function() {

    function enhancePricingTableForMobile() {
        // Only run on mobile screens
        if (window.innerWidth > 480) return;

        // Get all pricing plan tabs (Monthly and Yearly)
        const pricingTabs = document.querySelectorAll('.pricing-plan-tab-pane');

        pricingTabs.forEach(tab => {
            // Get the feature names from the first column
            const featureNameWrapper = tab.querySelector('.pricing-plan-featured-name-wrapper');
            if (!featureNameWrapper) return;

            const featureElements = featureNameWrapper.querySelectorAll('.pricing-plan-featured-single.featured-name .pricing-plan-featured-name');
            const features = Array.from(featureElements).map(el => el.textContent.trim());

            // Get all pricing plan columns (excluding the first feature column)
            const pricingColumns = tab.querySelectorAll('.pricing-plan-featured-card-wrap');

            pricingColumns.forEach((column, columnIndex) => {
                // Find the feature wrapper for this column
                const featureWrapper = column.querySelector('.pricing-plan-featured-wrapper');
                if (!featureWrapper) return;

                // Get all feature icon wrappers
                const iconWrappers = featureWrapper.querySelectorAll('.pricing-plan-featured-single.featured-icon-wrapper');

                // Create a mobile-friendly feature list container
                let mobileFeatureList = column.querySelector('.mobile-feature-list');
                if (!mobileFeatureList) {
                    mobileFeatureList = document.createElement('div');
                    mobileFeatureList.className = 'mobile-feature-list';

                    // Insert after the pricing info but before the button
                    const buttonWrapper = column.querySelector('.pricing-plan-button-wrapper');
                    if (buttonWrapper) {
                        buttonWrapper.parentNode.insertBefore(mobileFeatureList, buttonWrapper);
                    } else {
                        // If no button, append to the pricing content
                        const pricingContent = column.querySelector('.pricing-plan-top-content');
                        if (pricingContent) {
                            pricingContent.appendChild(mobileFeatureList);
                        }
                    }
                }

                // Clear existing content
                mobileFeatureList.innerHTML = '';

                // Add title
                const listTitle = document.createElement('div');
                listTitle.className = 'mobile-feature-list-title';
                listTitle.textContent = getColumnTitle(columnIndex);
                mobileFeatureList.appendChild(listTitle);

                // Add recommended badge text for the highlighted plan
                if (column.classList.contains('bg')) {
                    column.setAttribute('data-recommended-text', getRecommendedText());
                }

                // Create feature list
                const featureUl = document.createElement('ul');
                featureUl.className = 'mobile-feature-ul';

                // Map features to their availability
                features.forEach((feature, featureIndex) => {
                    const li = document.createElement('li');
                    li.className = 'mobile-feature-item';

                    // Check if this feature is available (has an icon)
                    const iconWrapper = iconWrappers[featureIndex];
                    let hasFeature = false;

                    if (iconWrapper) {
                        const icon = iconWrapper.querySelector('.featured-icon');
                        // Check if icon exists and has a valid src (not empty)
                        hasFeature = icon && icon.src && !icon.src.endsWith('/') && icon.src !== window.location.href;
                    }

                    // For highlighted plan (bg class), assume all features are available
                    if (column.classList.contains('bg')) {
                        hasFeature = true;
                    }

                    if (hasFeature) {
                        li.innerHTML = `<span class="feature-check">✓</span> ${feature}`;
                        li.classList.add('feature-available');
                    } else {
                        li.innerHTML = `<span class="feature-cross">✗</span> ${feature}`;
                        li.classList.add('feature-unavailable');
                    }

                    featureUl.appendChild(li);
                });

                mobileFeatureList.appendChild(featureUl);

                // Hide the original feature wrapper on mobile
                if (featureWrapper) {
                    featureWrapper.style.display = 'none';
                }
            });
        });
    }

    function getColumnTitle(index) {
        // Get the current language from the body class or default to 'en'
        const currentLang = document.body.getAttribute('data-current-lang') ||
                           localStorage.getItem('selectedLanguage') || 'en';

        // Translation mappings for plan titles
        const titleTranslations = {
            en: ['Basic Plan', 'Pro Plan', 'Enterprise Plan'],
            ru: ['Базовый план', 'Про план', 'Корпоративный план'],
            he: ['תוכנית בסיסית', 'תוכנית פרו', 'תוכנית ארגונית']
        };

        const titles = titleTranslations[currentLang] || titleTranslations.en;
        return titles[index] || `Plan ${index + 1}`;
    }

    function getRecommendedText() {
        const currentLang = document.body.getAttribute('data-current-lang') ||
                           localStorage.getItem('selectedLanguage') || 'en';

        const recommendedTranslations = {
            en: 'Recommended',
            ru: 'Рекомендуется',
            he: 'מומלץ'
        };

        return recommendedTranslations[currentLang] || recommendedTranslations.en;
    }

    // Run on initial load
    enhancePricingTableForMobile();

    // Re-run on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset display on desktop
            if (window.innerWidth > 480) {
                document.querySelectorAll('.pricing-plan-featured-wrapper').forEach(wrapper => {
                    wrapper.style.display = '';
                });
                document.querySelectorAll('.mobile-feature-list').forEach(list => {
                    list.style.display = 'none';
                });
            } else {
                enhancePricingTableForMobile();
            }
        }, 250);
    });

    // Re-run when tabs are switched
    const tabLinks = document.querySelectorAll('.pricing-plan-tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(enhancePricingTableForMobile, 100);
        });
    });

    // Re-run when language changes
    document.addEventListener('languageChanged', function(event) {
        setTimeout(enhancePricingTableForMobile, 100);
    });

    // Watch for language pill clicks
    document.querySelectorAll('.lang-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            setTimeout(enhancePricingTableForMobile, 200);
        });
    });

    // Also listen for storage changes (in case language changes in another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'selectedLanguage') {
            setTimeout(enhancePricingTableForMobile, 100);
        }
    });
});