/**
 * UNIVERSAL BLOG DETAILS COMPONENT
 * Following Universal Shared Component Architecture
 * Extends UniversalDetailsComponent pattern
 */

class UniversalDetailsComponent {
    constructor(entityType, apiNamespace = 'api') {
        this.entityType = entityType;
        this.apiNamespace = apiNamespace;
        this.entityData = null;
        this.entityId = null;
        this.previewMode = false;
        this.API_BASE = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://aistudio555jamstack-production.up.railway.app';
    }

    async init() {
        console.log(`📦 Loading ${this.entityType} Details Component...`);

        // Extract entity ID from URL
        const params = this.getUrlParams();
        this.entityId = params.id;
        this.previewMode = params.preview === 'true';

        if (!this.entityId) {
            this.showError(`No ${this.entityType} ID provided in URL`);
            return;
        }

        // Load and populate ALL content from database
        await this.loadEntityData();
    }

    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id'),
            preview: params.get('preview')
        };
    }

    async fetchEntityData(entityId, preview = false) {
        try {
            const url = `${this.API_BASE}/${this.apiNamespace}/${this.entityType}/${entityId}${preview ? '?preview=true' : ''}`;
            console.log(`📡 Fetching ${this.entityType}:`, url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${this.entityType}: ${response.status}`);
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

            this.entityData = await this.fetchEntityData(this.entityId, this.previewMode);

            if (!this.entityData) {
                throw new Error(`No ${this.entityType} data received`);
            }

            await this.populatePageContent();
            this.setupEventHandlers();

            console.log(`✅ ${this.entityType} details page populated successfully`);

        } catch (error) {
            console.error(`❌ Error loading ${this.entityType} data:`, error);
            this.showError(`Failed to load ${this.entityType} details. Please try again.`);
        } finally {
            this.showLoading(false);
        }
    }

    async populatePageContent() {
        const entity = this.entityData;

        // Page title
        document.title = `${entity.title || this.entityType} - AI Studio`;

        // Hero section - ALL from database
        this.setText('.entity-details-hero-title', entity.title);
        this.setText('.entity-details-hero-description', entity.short_description || entity.excerpt);
        this.setText('.entity-breadcrumb-title', entity.title);
        this.setText('.entity-author', entity.author || 'Author');
        this.setText('.entity-date', this.formatDate(entity.created_at || entity.published_at));
        this.setText('.entity-reading-time', `${entity.reading_time || 5} min read`);

        // Content sections - ALL from database
        this.setHTML('.entity-full-description', entity.content || entity.description);
        await this.populateEntityContent(entity);
        await this.populateEntityFeatures(entity);

        // Sidebar - ALL from database
        this.populateEntityPricing(entity);
        this.populateEntityStats(entity);
        this.populateEntityAuthor(entity);
        this.setEntityCategoryColor(entity.category);
    }

    // Blog-specific content population
    async populateEntityContent(entity) {
        // Content sections
        if (entity.content_sections && entity.content_sections.length > 0) {
            await this.populateBlogSections(entity.content_sections);
        }

        // Tags
        if (entity.tags && entity.tags.length > 0) {
            await this.populateBlogTags(entity.tags);
        }

        // Featured image
        if (entity.featured_image_url) {
            this.showFeaturedImage(entity.featured_image_url, entity.title);
        }

        // Gallery
        if (entity.gallery_images && entity.gallery_images.length > 0) {
            await this.populateBlogGallery(entity.gallery_images);
        }

        // Video
        if (entity.video_url) {
            this.showVideo(entity.video_url);
        }

        // External URL
        if (entity.url) {
            this.showExternalLink(entity.url);
        }

        // Featured badge
        if (entity.is_featured) {
            this.showFeaturedBadge();
        }
    }

    async populateBlogSections(sections) {
        const container = document.querySelector('.entity-content-container');
        if (!container) return;

        const sectionsList = this.parseContentArray(sections);

        if (sectionsList.length > 0) {
            container.innerHTML = sectionsList.map((section, index) =>
                `<div class="entity-content-item">
                    <div class="entity-content-title">${section.title || `Section ${index + 1}`}</div>
                    ${section.content ? `<div class="entity-content-description">${section.content}</div>` : ''}
                </div>`
            ).join('');

            document.querySelector('.entity-content-section').style.display = 'block';
        }
    }

    async populateBlogTags(tags) {
        const container = document.querySelector('.entity-tags-list');
        if (!container) return;

        const tagsList = Array.isArray(tags) ? tags : this.parseContentArray(tags);

        if (tagsList.length > 0) {
            container.innerHTML = tagsList.map(tag =>
                `<span class="entity-tag-item">${tag}</span>`
            ).join('');

            document.querySelector('.entity-tags-section').style.display = 'block';
        }
    }

    showFeaturedImage(imageUrl, altText) {
        const imageSection = document.querySelector('.entity-featured-image-section');
        const imageElement = document.querySelector('.entity-featured-image');

        if (imageSection && imageElement && imageUrl) {
            imageElement.src = imageUrl;
            imageElement.alt = altText || 'Featured image';
            imageSection.style.display = 'block';
        }
    }

    async populateBlogGallery(images) {
        const container = document.querySelector('.entity-gallery-container');
        if (!container) return;

        const imagesList = Array.isArray(images) ? images : this.parseContentArray(images);

        if (imagesList.length > 0) {
            container.innerHTML = imagesList.map(image =>
                `<div class="entity-gallery-item">
                    <img src="${typeof image === 'string' ? image : image.url}"
                         alt="${typeof image === 'string' ? 'Gallery image' : image.alt || 'Gallery image'}" />
                </div>`
            ).join('');

            document.querySelector('.entity-gallery-section').style.display = 'block';
        }
    }

    showVideo(videoUrl) {
        const videoSection = document.querySelector('.entity-video-section');
        const videoContainer = document.querySelector('.entity-video-container');

        if (videoSection && videoContainer && videoUrl) {
            videoContainer.innerHTML = `
                <iframe src="${videoUrl}"
                        allowfullscreen
                        frameborder="0">
                </iframe>
            `;
            videoSection.style.display = 'block';
        }
    }

    showExternalLink(url) {
        const linkSection = document.querySelector('.entity-external-link');
        const linkElement = document.querySelector('.entity-external-url');

        if (linkSection && linkElement && url) {
            linkElement.href = url;
            linkSection.style.display = 'block';
        }
    }

    showFeaturedBadge() {
        const badge = document.querySelector('.entity-featured-badge');
        if (badge) {
            badge.style.display = 'block';
        }
    }

    async populateEntityFeatures(entity) {
        // This method can be extended for blog-specific features
    }

    populateEntityPricing(entity) {
        // Not applicable for blogs, but maintained for consistency
    }

    populateEntityStats(entity) {
        this.setText('.entity-views-count', entity.views_count || 0);
        this.setText('.entity-likes-count', entity.likes_count || 0);
        this.setText('.entity-shares-count', entity.shares_count || 0);
        this.setText('.entity-publish-date', this.formatDate(entity.published_at));
    }

    populateEntityAuthor(entity) {
        this.setText('.author-name', entity.author || 'Anonymous');
        this.setText('.author-bio', entity.author_bio || 'No bio available');

        if (entity.author_image_url) {
            this.setImage('.author-image', entity.author_image_url, entity.author);
        }

        // Author social links
        if (entity.author_social_links) {
            this.populateAuthorSocialLinks(entity.author_social_links);
        }
    }

    populateAuthorSocialLinks(socialLinks) {
        const container = document.querySelector('.author-social-links');
        if (!container || !socialLinks) return;

        const links = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
        const socialIcons = {
            twitter: '🐦',
            linkedin: '💼',
            github: '🐱',
            facebook: '📘',
            instagram: '📷',
            website: '🌐'
        };

        const linksHTML = Object.entries(links)
            .filter(([platform, url]) => url)
            .map(([platform, url]) =>
                `<a href="${url}" class="author-social-link" target="_blank" rel="noopener">
                    ${socialIcons[platform] || '🔗'}
                </a>`
            ).join('');

        container.innerHTML = linksHTML;
    }

    setEntityCategoryColor(category) {
        const categoryElement = document.querySelector('.entity-category');
        if (categoryElement && category) {
            categoryElement.textContent = category;
        }
    }

    parseContentArray(content) {
        if (!content) return [];

        try {
            return typeof content === 'string' ? JSON.parse(content) : content;
        } catch (e) {
            console.warn('Could not parse content:', e);
            return typeof content === 'string'
                ? content.split(',').map(item => ({ title: item.trim() }))
                : [];
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    setupEventHandlers() {
        // Like button
        const likeButton = document.querySelector('.entity-like-button');
        if (likeButton) {
            likeButton.addEventListener('click', () => this.handleLike());
        }

        // Share button
        const shareButton = document.querySelector('.entity-share-button');
        if (shareButton) {
            shareButton.addEventListener('click', () => this.handleShare());
        }
    }

    async handleLike() {
        try {
            const response = await fetch(`${this.API_BASE}/${this.apiNamespace}/${this.entityType}/${this.entityId}/like`, {
                method: 'POST'
            });

            if (response.ok) {
                const likesElement = document.querySelector('.entity-likes-count');
                if (likesElement) {
                    const currentLikes = parseInt(likesElement.textContent) || 0;
                    likesElement.textContent = currentLikes + 1;
                }
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    }

    handleShare() {
        if (navigator.share) {
            navigator.share({
                title: this.entityData.title,
                text: this.entityData.excerpt || this.entityData.short_description,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Link copied to clipboard!'))
                .catch(() => console.error('Could not copy link'));
        }
    }

    // Universal utility methods
    setText(selector, text) {
        const element = document.querySelector(selector);
        if (element && text) {
            element.textContent = text;
        }
    }

    setHTML(selector, html) {
        const element = document.querySelector(selector);
        if (element && html) {
            element.innerHTML = html;
        }
    }

    setImage(selector, src, alt = '') {
        const element = document.querySelector(selector);
        if (element && src) {
            element.src = src;
            element.alt = alt;
        }
    }

    showLoading(show) {
        let loader = document.querySelector('.entity-loading-overlay');

        if (show && !loader) {
            loader = document.createElement('div');
            loader.className = 'entity-loading-overlay';
            loader.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading ${this.entityType} details...</div>
            `;
            document.body.appendChild(loader);
        } else if (!show && loader) {
            loader.remove();
        }
    }

    showError(message) {
        console.error(`❌ ${this.entityType} Error:`, message);

        const heroTitle = document.querySelector('.entity-details-hero-title');
        const heroDescription = document.querySelector('.entity-details-hero-description');

        if (heroTitle) {
            heroTitle.textContent = 'Error Loading Content';
        }

        if (heroDescription) {
            heroDescription.innerHTML = `
                <div style="background: rgba(220, 53, 69, 0.1); padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545;">
                    <strong>⚠️ Error:</strong> ${message}<br>
                    <a href="${this.entityType}.html" style="color: #dc3545; text-decoration: underline;">
                        ← Back to ${this.entityType}
                    </a>
                </div>
            `;
        }
    }
}

class BlogDetailsComponent extends UniversalDetailsComponent {
    constructor() {
        super('blog-posts', 'api');
    }
}

// Auto-initialize
function initBlogDetailsComponent() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🚀 Initializing Blog Details Component...');
            const component = new BlogDetailsComponent();
            component.init();
        });
    } else {
        console.log('🚀 Initializing Blog Details Component (immediate)...');
        const component = new BlogDetailsComponent();
        component.init();
    }
}

initBlogDetailsComponent();