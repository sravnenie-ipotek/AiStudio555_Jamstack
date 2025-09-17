// New Design API Integration
class NDPageLoader {
    constructor() {
        this.apiBase = window.location.hostname === 'localhost'
            ? 'http://localhost:3000/api/nd'
            : '/api/nd';
        this.locale = this.detectLocale();
        this.cache = new LocalStorageCache('nd_cache', 3600000); // 1 hour cache
    }

    detectLocale() {
        const path = window.location.pathname;
        if (path.includes('/ru/')) return 'ru';
        if (path.includes('/he/')) return 'he';
        return 'en';
    }

    async loadPage() {
        const pageName = document.documentElement.dataset.page || 'home';
        const isPreview = new URLSearchParams(location.search).get('preview') === 'true';

        try {
            // Check cache first (unless in preview mode)
            const cacheKey = `${pageName}_${this.locale}`;
            if (!isPreview) {
                const cached = this.cache.get(cacheKey);
                if (cached) {
                    console.log('📦 Loading from cache:', cacheKey);
                    this.renderPage(cached);
                    return;
                }
            }

            // Show loading state
            this.showLoading();

            // Fetch from API
            console.log('🔄 Fetching from API:', `${this.apiBase}/${pageName}-page`);
            const response = await fetch(
                `${this.apiBase}/${pageName}-page?locale=${this.locale}&preview=${isPreview}`
            );

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Cache the data (unless in preview mode)
                if (!isPreview) {
                    this.cache.set(cacheKey, data.data);
                }

                // Render the page
                this.renderPage(data.data);

                // Load and render shared components (menu, footer)
                await this.loadSharedComponents();

                // Update meta tags
                if (data.meta) {
                    this.updateMeta(data.meta);
                }
            } else {
                throw new Error(data.error || 'Failed to load content');
            }
        } catch (error) {
            console.error('❌ Error loading page:', error);
            this.showError('Unable to load content. Please refresh the page.');
        }
    }

    renderPage(data) {
        // Check animations preference
        this.checkAnimationsPreference();

        // Handle section visibility
        document.querySelectorAll('[data-section]').forEach(section => {
            const key = section.dataset.section;
            const sectionData = data[key];

            if (sectionData) {
                // Check visibility
                if (!sectionData.visible) {
                    section.remove();
                    return;
                }

                // Render content
                this.renderSection(section, sectionData);

                // Handle animations
                if (!sectionData.animations_enabled) {
                    section.classList.add('no-animations');
                }
            }
        });

        // Hide loading state
        this.hideLoading();
    }

    // Animation toggle methods
    toggleAnimations() {
        const isDisabled = this.getAnimationsDisabled();
        this.setAnimationsDisabled(!isDisabled);
        return !isDisabled;
    }

    getAnimationsDisabled() {
        return localStorage.getItem('nd_animations_disabled') === 'true';
    }

    setAnimationsDisabled(disabled) {
        localStorage.setItem('nd_animations_disabled', disabled.toString());
        this.applyAnimationsPreference();

        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('nd:animationsToggled', {
            detail: { disabled }
        }));
    }

    applyAnimationsPreference() {
        const disabled = this.getAnimationsDisabled();

        if (disabled) {
            document.documentElement.classList.add('no-animations');
        } else {
            document.documentElement.classList.remove('no-animations');
        }

        // Update any existing toggle buttons
        this.updateAnimationToggleButtons(disabled);
    }

    updateAnimationToggleButtons(disabled) {
        document.querySelectorAll('.nd-animation-toggle').forEach(button => {
            button.classList.toggle('disabled', disabled);
            const icon = button.querySelector('.toggle-icon');
            const text = button.querySelector('.toggle-text');

            if (icon) {
                icon.textContent = disabled ? '⏸️' : '🎬';
            }
            if (text) {
                text.textContent = disabled ? 'Animations OFF' : 'Animations ON';
            }
        });
    }

    renderSection(section, data) {
        const content = data.content || {};
        const sectionKey = section.dataset.section;

        // Render simple fields
        section.querySelectorAll('[data-field]').forEach(element => {
            const field = element.dataset.field;

            // Strip section prefix if present (e.g., "hero.title" -> "title")
            let fieldPath = field;
            if (field.startsWith(sectionKey + '.')) {
                fieldPath = field.substring(sectionKey.length + 1);
            }

            const value = this.getNestedValue(content, fieldPath);

            if (value !== undefined && value !== null && value !== '') {
                if (element.tagName === 'IMG') {
                    element.src = value;
                } else if (element.tagName === 'A') {
                    element.href = value;
                } else {
                    element.innerHTML = value;
                }
            }
        });

        // Render repeaters (dynamic lists)
        section.querySelectorAll('[data-repeater]').forEach(repeater => {
            const field = repeater.dataset.repeater;

            // Strip section prefix if present
            let fieldPath = field;
            if (field.startsWith(sectionKey + '.')) {
                fieldPath = field.substring(sectionKey.length + 1);
            }

            const items = this.getNestedValue(content, fieldPath);

            if (items && Array.isArray(items)) {
                this.renderRepeater(repeater, items.filter(item => item.visible !== false));
            }
        });

        // Render buttons
        section.querySelectorAll('[data-button]').forEach(button => {
            const field = button.dataset.button;

            // Strip section prefix if present
            let fieldPath = field;
            if (field.startsWith(sectionKey + '.')) {
                fieldPath = field.substring(sectionKey.length + 1);
            }

            const buttonData = this.getNestedValue(content, fieldPath);

            if (buttonData) {
                if (buttonData.text) button.textContent = buttonData.text;
                if (buttonData.url) button.href = buttonData.url;
                if (buttonData.style) {
                    button.className = button.className.replace(/primary|secondary/, buttonData.style);
                }
            }
        });
    }

    renderRepeater(container, items) {
        // Get template
        const template = container.querySelector('[data-template]') || container.firstElementChild;
        if (!template) return;

        // Clone template
        const templateClone = template.cloneNode(true);
        templateClone.removeAttribute('data-template');

        // Clear container
        container.innerHTML = '';

        // Render each item
        items.forEach(item => {
            const element = templateClone.cloneNode(true);

            // Render item fields
            element.querySelectorAll('[data-item]').forEach(field => {
                const prop = field.dataset.item;
                const value = this.getNestedValue(item, prop);

                if (value !== undefined && value !== null && value !== '') {
                    if (field.tagName === 'IMG') {
                        field.src = value;
                    } else if (field.tagName === 'A') {
                        field.href = value;
                    } else {
                        field.innerHTML = value;
                    }
                }
            });

            container.appendChild(element);
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    checkAnimationsPreference() {
        this.applyAnimationsPreference();
    }

    updateMeta(meta) {
        if (meta.title) {
            document.title = meta.title;
        }
        if (meta.description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = meta.description;
            }
        }
    }

    async loadSharedComponents() {
        try {
            // Load menu
            const menuResponse = await fetch(`${this.apiBase}/menu?locale=${this.locale}`);
            if (menuResponse.ok) {
                const menuData = await menuResponse.json();
                if (menuData.success) {
                    this.renderMenu(menuData.data);
                }
            }

            // Load footer
            const footerResponse = await fetch(`${this.apiBase}/footer?locale=${this.locale}`);
            if (footerResponse.ok) {
                const footerData = await footerResponse.json();
                if (footerData.success) {
                    this.renderFooter(footerData.data);
                }
            }
        } catch (error) {
            console.error('❌ Error loading shared components:', error);
            // Continue without shared components rather than failing completely
        }
    }

    renderMenu(menuItems) {
        const menuContainer = document.querySelector('[data-component="menu"]');
        if (!menuContainer || !menuItems || menuItems.length === 0) return;

        // Clear existing items
        menuContainer.innerHTML = '';

        // Create menu items
        menuItems.forEach((item, index) => {
            const link = document.createElement('a');
            link.className = 'nav-link w-nav-link';
            link.href = item.url;
            link.textContent = item.label;

            // Mark current page
            if (window.location.pathname.includes(item.url) ||
                (item.url === '/nd/index.html' && window.location.pathname.includes('/nd/index.html'))) {
                link.classList.add('w--current');
                link.setAttribute('aria-current', 'page');
            }

            menuContainer.appendChild(link);
        });
    }

    renderFooter(footerData) {
        const footerContainer = document.querySelector('[data-component="footer"]');
        if (!footerContainer || !footerData) return;

        // Basic footer rendering - can be enhanced later
        let footerHTML = '<div class="footer-content">';

        // Render columns
        if (footerData.columns) {
            Object.entries(footerData.columns).forEach(([colNum, column]) => {
                footerHTML += `<div class="footer-column">`;
                if (column.heading) {
                    footerHTML += `<h4>${column.heading}</h4>`;
                }
                if (column.items) {
                    footerHTML += '<ul>';
                    column.items.forEach(item => {
                        footerHTML += `<li><a href="${item.url || '#'}">${item.content}</a></li>`;
                    });
                    footerHTML += '</ul>';
                }
                footerHTML += `</div>`;
            });
        }

        // Add copyright
        if (footerData.copyright) {
            footerHTML += `<div class="footer-copyright"><p>${footerData.copyright}</p></div>`;
        }

        footerHTML += '</div>';
        footerContainer.innerHTML = footerHTML;
    }

    showLoading() {
        // Add loading class to body
        document.body.classList.add('nd-loading');

        // Show skeleton loaders if they exist
        document.querySelectorAll('.skeleton-loader').forEach(el => {
            el.style.display = 'block';
        });
    }

    hideLoading() {
        document.body.classList.remove('nd-loading');
        document.querySelectorAll('.skeleton-loader').forEach(el => {
            el.style.display = 'none';
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'nd-error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <p>${message}</p>
                <button onclick="location.reload()">Reload Page</button>
            </div>
        `;
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
}

// LocalStorage Cache Helper
class LocalStorageCache {
    constructor(prefix, ttl) {
        this.prefix = prefix;
        this.ttl = ttl; // Time to live in milliseconds
    }

    get(key) {
        try {
            const item = localStorage.getItem(`${this.prefix}_${key}`);
            if (!item) return null;

            const data = JSON.parse(item);
            const now = Date.now();

            if (now - data.timestamp > this.ttl) {
                localStorage.removeItem(`${this.prefix}_${key}`);
                return null;
            }

            return data.value;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    set(key, value) {
        try {
            const data = {
                value: value,
                timestamp: Date.now()
            };
            localStorage.setItem(`${this.prefix}_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('Cache set error:', error);
            // Clear old cache if storage is full
            this.clearOldCache();
        }
    }

    clearOldCache() {
        const keys = Object.keys(localStorage);
        const now = Date.now();

        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (now - data.timestamp > this.ttl) {
                        localStorage.removeItem(key);
                    }
                } catch {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Enhanced Animation Toggle Control
class AnimationToggle {
    constructor(options = {}) {
        this.options = {
            showInPreview: true,
            showInProduction: false,
            position: 'bottom-left',
            autoShow: true,
            ...options
        };
        this.loader = null;
        this.init();
    }

    init() {
        // Get reference to NDPageLoader if available
        this.loader = window.NDPageLoader ? new window.NDPageLoader() : null;

        // Determine if we should show the toggle button
        const shouldShow = this.shouldShowToggle();

        if (shouldShow && this.options.autoShow) {
            this.createToggleButton();
        }

        // Listen for animation toggle events
        window.addEventListener('nd:animationsToggled', (e) => {
            this.handleAnimationToggle(e.detail.disabled);
        });

        // Apply saved preference on init
        this.applyPreference();
    }

    shouldShowToggle() {
        const isPreview = window.location.search.includes('preview=true');
        const isProduction = !window.location.hostname.includes('localhost');

        return (isPreview && this.options.showInPreview) ||
               (isProduction && this.options.showInProduction) ||
               (window.location.hostname.includes('localhost'));
    }

    createToggleButton() {
        // Remove existing button if present
        const existingButton = document.getElementById('nd-animation-toggle');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.id = 'nd-animation-toggle';
        button.className = 'nd-animation-toggle';

        const isDisabled = this.getAnimationsDisabled();

        button.innerHTML = `
            <span class="toggle-icon">${isDisabled ? '⏸️' : '🎬'}</span>
            <span class="toggle-text">${isDisabled ? 'Animations OFF' : 'Animations ON'}</span>
        `;

        this.styleButton(button, isDisabled);
        button.onclick = () => this.toggle();

        // Add tooltip
        button.title = 'Toggle page animations on/off';

        document.body.appendChild(button);
    }

    styleButton(button, isDisabled = false) {
        const positions = {
            'bottom-left': 'bottom: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'top-right': 'top: 20px; right: 20px;'
        };

        button.style.cssText = `
            position: fixed;
            ${positions[this.options.position] || positions['bottom-left']}
            z-index: 10000;
            padding: 12px 16px;
            background: ${isDisabled ? '#6c757d' : '#667eea'};
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(10px);
            user-select: none;
        `;

        // Add hover effects
        button.onmouseenter = () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 25px rgba(0,0,0,0.2)';
        };

        button.onmouseleave = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        };
    }

    toggle() {
        const wasDisabled = this.getAnimationsDisabled();
        const newState = !wasDisabled;

        // Update localStorage
        localStorage.setItem('nd_animations_disabled', newState.toString());

        // Apply the preference
        this.applyPreference();

        // Notify other components
        window.dispatchEvent(new CustomEvent('nd:animationsToggled', {
            detail: { disabled: newState }
        }));

        // Save to server if in admin mode
        if (window.location.search.includes('preview=true')) {
            this.saveToServer(newState);
        }

        // Show feedback
        this.showToggleFeedback(newState);

        return newState;
    }

    getAnimationsDisabled() {
        return localStorage.getItem('nd_animations_disabled') === 'true';
    }

    applyPreference() {
        const isDisabled = this.getAnimationsDisabled();

        if (isDisabled) {
            document.documentElement.classList.add('no-animations');
        } else {
            document.documentElement.classList.remove('no-animations');
        }

        this.updateButtonState(!isDisabled);
    }

    updateButtonState(enabled) {
        const button = document.getElementById('nd-animation-toggle');
        if (!button) return;

        const icon = button.querySelector('.toggle-icon');
        const text = button.querySelector('.toggle-text');

        if (icon) {
            icon.textContent = enabled ? '🎬' : '⏸️';
        }
        if (text) {
            text.textContent = enabled ? 'Animations ON' : 'Animations OFF';
        }

        // Update button styling
        button.style.background = enabled ? '#667eea' : '#6c757d';
        button.classList.toggle('disabled', !enabled);
    }

    handleAnimationToggle(disabled) {
        // Handle any additional logic when animations are toggled
        console.log(`🎬 Animations ${disabled ? 'disabled' : 'enabled'}`);
    }

    showToggleFeedback(disabled) {
        // Create temporary feedback message
        const feedback = document.createElement('div');
        feedback.className = 'nd-toggle-feedback';
        feedback.textContent = disabled ? 'Animations disabled' : 'Animations enabled';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${disabled ? '#6c757d' : '#667eea'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(feedback);

        // Animate in
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
        });

        // Remove after 2 seconds
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }

    async saveToServer(disabled) {
        if (!this.loader) return;

        try {
            const apiBase = this.loader.apiBase || '/api/nd';
            await fetch(`${apiBase}/settings/animations`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: document.documentElement.dataset.page || 'home',
                    enabled: !disabled,
                    timestamp: Date.now()
                })
            });
            console.log('✅ Animation preference saved to server');
        } catch (error) {
            console.warn('⚠️ Failed to save animation preference to server:', error);
        }
    }

    // Public methods for external control
    show() {
        if (!document.getElementById('nd-animation-toggle')) {
            this.createToggleButton();
        }
    }

    hide() {
        const button = document.getElementById('nd-animation-toggle');
        if (button) {
            button.remove();
        }
    }

    enable() {
        localStorage.setItem('nd_animations_disabled', 'false');
        this.applyPreference();
    }

    disable() {
        localStorage.setItem('nd_animations_disabled', 'true');
        this.applyPreference();
    }

    destroy() {
        this.hide();
        window.removeEventListener('nd:animationsToggled', this.handleAnimationToggle);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const loader = new NDPageLoader();
    loader.loadPage();

    // Initialize animation toggle with options
    const animationToggle = new AnimationToggle({
        showInPreview: true,
        showInProduction: false, // Set to true if you want it in production
        position: 'bottom-left',
        autoShow: true
    });

    // Make it globally available
    window.ndAnimationToggle = animationToggle;
});

// Export for use in other scripts
window.NDPageLoader = NDPageLoader;
window.AnimationToggle = AnimationToggle;