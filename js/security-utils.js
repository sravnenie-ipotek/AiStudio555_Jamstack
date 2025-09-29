/**
 * 🔒 SECURITY UTILITIES
 * Provides secure alternatives to dangerous DOM operations
 * Prevents XSS attacks through proper HTML sanitization
 */

// Load DOMPurify for client-side HTML sanitization
// This script should be loaded via CDN in HTML files

(function() {
    'use strict';

    // 🛡️ SECURE HTML UTILITIES
    window.SecurityUtils = {
        /**
         * Safely set innerHTML with DOMPurify sanitization
         * @param {HTMLElement} element - Target element
         * @param {string} html - HTML content to sanitize and inject
         * @param {object} options - DOMPurify options
         */
        safeSetHTML: function(element, html, options = {}) {
            if (!element) {
                console.error('🚨 [SecurityUtils] safeSetHTML: Invalid element provided');
                return false;
            }

            if (typeof html !== 'string') {
                console.error('🚨 [SecurityUtils] safeSetHTML: HTML content must be a string');
                return false;
            }

            try {
                // Ensure DOMPurify is available
                if (typeof DOMPurify === 'undefined') {
                    console.error('🚨 [SecurityUtils] DOMPurify not loaded! Falling back to textContent.');
                    element.textContent = html;
                    return false;
                }

                // Default security options
                const defaultOptions = {
                    ALLOWED_TAGS: [
                        'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'strong', 'em', 'u', 'b', 'i', 'br', 'ul', 'ol', 'li',
                        'table', 'tr', 'td', 'th', 'thead', 'tbody',
                        'button', 'input', 'select', 'option', 'textarea', 'label',
                        'img', 'a', 'small', 'pre', 'code', 'blockquote'
                    ],
                    ALLOWED_ATTR: [
                        'class', 'id', 'style', 'data-*', 'href', 'src', 'alt',
                        'title', 'type', 'value', 'placeholder', 'disabled',
                        'readonly', 'checked', 'selected', 'onclick', 'onchange'
                    ],
                    ALLOW_DATA_ATTR: true,
                    SANITIZE_DOM: true,
                    KEEP_CONTENT: true,
                    FORBID_TAGS: [],
                    FORBID_ATTR: []
                };

                // Merge provided options with defaults
                const sanitizeOptions = { ...defaultOptions, ...options };

                // Sanitize and inject HTML
                const sanitizedHTML = DOMPurify.sanitize(html, sanitizeOptions);
                element.innerHTML = sanitizedHTML;

                console.log('✅ [SecurityUtils] HTML safely sanitized and injected');
                return true;

            } catch (error) {
                console.error('🚨 [SecurityUtils] Error sanitizing HTML:', error);
                // Fallback to safe text content
                element.textContent = html.replace(/<[^>]*>/g, '');
                return false;
            }
        },

        /**
         * Safely append HTML content to an element
         * @param {HTMLElement} element - Target element
         * @param {string} html - HTML content to sanitize and append
         * @param {object} options - DOMPurify options
         */
        safeAppendHTML: function(element, html, options = {}) {
            if (!element) {
                console.error('🚨 [SecurityUtils] safeAppendHTML: Invalid element provided');
                return false;
            }

            const tempDiv = document.createElement('div');
            const success = this.safeSetHTML(tempDiv, html, options);

            if (success) {
                // Move sanitized content from temp div to target element
                while (tempDiv.firstChild) {
                    element.appendChild(tempDiv.firstChild);
                }
                return true;
            }

            return false;
        },

        /**
         * Safely set text content (XSS-proof alternative to innerHTML for text)
         * @param {HTMLElement} element - Target element
         * @param {string} text - Text content
         */
        safeSetText: function(element, text) {
            if (!element) {
                console.error('🚨 [SecurityUtils] safeSetText: Invalid element provided');
                return false;
            }

            element.textContent = String(text || '');
            return true;
        },

        /**
         * Validate and sanitize URLs to prevent javascript: and data: URL attacks
         * @param {string} url - URL to validate
         * @returns {string|null} - Sanitized URL or null if invalid
         */
        sanitizeURL: function(url) {
            if (!url || typeof url !== 'string') {
                return null;
            }

            url = url.trim();

            // Block dangerous protocol schemes
            const dangerousProtocols = [
                'javascript:', 'data:', 'vbscript:', 'file:', 'about:'
            ];

            const lowerURL = url.toLowerCase();
            for (const protocol of dangerousProtocols) {
                if (lowerURL.startsWith(protocol)) {
                    console.warn('🚨 [SecurityUtils] Blocked dangerous URL protocol:', protocol);
                    return null;
                }
            }

            // Allow safe protocols
            const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
            const isAbsolute = url.includes('://');

            if (isAbsolute) {
                const hasValidProtocol = safeProtocols.some(protocol =>
                    lowerURL.startsWith(protocol)
                );

                if (!hasValidProtocol) {
                    console.warn('🚨 [SecurityUtils] Blocked unknown URL protocol');
                    return null;
                }
            }

            return url;
        },

        /**
         * Check if DOMPurify is properly loaded
         * @returns {boolean} - True if DOMPurify is available
         */
        isDOMPurifyLoaded: function() {
            return typeof DOMPurify !== 'undefined' && typeof DOMPurify.sanitize === 'function';
        },

        /**
         * Get security status report
         * @returns {object} - Security utilities status
         */
        getSecurityStatus: function() {
            return {
                domPurifyLoaded: this.isDOMPurifyLoaded(),
                securityUtilsVersion: '1.0.0',
                timestamp: new Date().toISOString()
            };
        }
    };

    console.log('✅ [SecurityUtils] Security utilities loaded');

})();
