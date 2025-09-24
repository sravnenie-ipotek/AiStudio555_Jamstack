/**
 * Simple Language Manager - Debug Version
 * Shows clear feedback when language switching works
 */

console.log('🌐 Simple Language Manager Loading...');

// Simple language switching function that provides immediate feedback
window.setActivePill = function(element) {
    console.log('🔄 Language switching triggered:', element.textContent);

    const lang = element.textContent.toLowerCase();

    // 1. Update visual state of all pills
    document.querySelectorAll('.lang-pill, .mobile-lang-pill').forEach(pill => {
        pill.classList.remove('active');
    });

    // Find all pills with the same text and activate them
    document.querySelectorAll('.lang-pill, .mobile-lang-pill').forEach(pill => {
        if (pill.textContent === element.textContent) {
            pill.classList.add('active');
        }
    });

    // 2. Update HTML attributes immediately for visible feedback
    document.documentElement.setAttribute('lang', lang);

    if (lang === 'he') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.style.direction = 'rtl';
        console.log('🔄 Switched to Hebrew RTL');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.style.direction = 'ltr';
        console.log('🔄 Switched to', lang.toUpperCase(), 'LTR');
    }

    // 3. Update URL with locale parameter
    const url = new URL(window.location);
    url.searchParams.set('locale', lang);
    window.history.pushState({locale: lang}, '', url);
    console.log('🔗 URL updated:', url.toString());

    // 4. Save preference
    localStorage.setItem('preferred_locale', lang);
    console.log('💾 Language preference saved:', lang);

    // 5. Show visible feedback to user
    showLanguageSwitch(lang);

    // 6. Load content from API
    loadLanguageContent(lang);
};

function showLanguageSwitch(lang) {
    // Remove existing notification
    const existingNotification = document.getElementById('language-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.id = 'language-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${lang === 'he' ? '#007bff' : lang === 'ru' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(300px);
        transition: transform 0.3s ease;
    `;

    const flags = {en: '🇺🇸', ru: '🇷🇺', he: '🇮🇱'};
    notification.innerHTML = `${flags[lang]} Language switched to ${lang.toUpperCase()}!`;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

async function loadLanguageContent(lang) {
    console.log('📡 Loading content for', lang.toUpperCase());

    try {
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://aistudio555jamstack-production.up.railway.app';

        const endpoint = `${apiUrl}/api/nd/home-page?locale=${lang}`;
        console.log('📡 Fetching:', endpoint);

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Content loaded:', data);

        // Update page title with sample content
        updatePageContent(data, lang);

    } catch (error) {
        console.error('❌ Failed to load content:', error);

        // Show error notification
        const errorNotification = document.createElement('div');
        errorNotification.style.cssText = `
            position: fixed;
            top: 140px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorNotification.textContent = `❌ API Error: ${error.message}`;
        document.body.appendChild(errorNotification);

        setTimeout(() => errorNotification.remove(), 5000);
    }
}

function updatePageContent(data, lang) {
    console.log('🎨 Updating page content for', lang.toUpperCase());

    // Update document title with language indicator
    const originalTitle = document.title.replace(/ - \[.*\]$/, '');
    document.title = `${originalTitle} - [${lang.toUpperCase()}]`;

    // If there are any elements with data-i18n, update them
    const i18nElements = document.querySelectorAll('[data-i18n]');
    console.log('🏷️ Found', i18nElements.length, 'i18n elements to update');

    i18nElements.forEach(element => {
        const key = element.dataset.i18n;
        console.log('🏷️ Updating element with key:', key);

        // Try to find the content in the API response
        const content = getNestedValue(data, key);
        if (content) {
            element.textContent = content;
        }
    });

    // Update any dynamic content containers
    const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
    console.log('📦 Found', dynamicContainers.length, 'dynamic content containers');
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((curr, prop) => {
        return curr && curr[prop];
    }, obj);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Simple Language Manager Initialized');

    // Check for locale in URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlLocale = urlParams.get('locale');

    if (urlLocale && ['en', 'ru', 'he'].includes(urlLocale)) {
        console.log('🔗 URL locale detected:', urlLocale);

        // Find and activate the correct pill
        const targetPill = document.querySelector(`.lang-pill:contains('${urlLocale.toUpperCase()}'), .mobile-lang-pill:contains('${urlLocale.toUpperCase()}')`);

        if (!targetPill) {
            // Manual search since :contains is not standard CSS
            document.querySelectorAll('.lang-pill, .mobile-lang-pill').forEach(pill => {
                if (pill.textContent.toLowerCase() === urlLocale) {
                    setTimeout(() => setActivePill(pill), 500);
                }
            });
        }
    }

    // Check saved preference
    const savedLocale = localStorage.getItem('preferred_locale');
    if (savedLocale && ['en', 'ru', 'he'].includes(savedLocale)) {
        console.log('💾 Saved locale detected:', savedLocale);
    }
});

console.log('✅ Simple Language Manager Loaded');