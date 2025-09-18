/**
 * BLOG DETAIL INTEGRATION
 * Following the course pattern - loads individual blog post data
 * URL Pattern: detail_blog.html?id={blog_id}
 */

class BlogDetailIntegration {
    constructor() {
        this.blogId = this.getBlogIdFromURL();
        this.apiBase = this.getApiBase();

        console.log('🎯 Blog Detail Integration initialized');
        console.log('📝 Blog ID:', this.blogId);
        console.log('🌐 API Base:', this.apiBase);

        if (this.blogId) {
            this.loadBlogDetails();
        } else {
            this.showError('No blog ID provided in URL');
        }
    }

    getBlogIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    getApiBase() {
        // Auto-detect API base following course pattern
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        } else if (hostname.includes('railway')) {
            return 'https://aistudio555jamstack-production.up.railway.app';
        } else {
            return 'https://aistudio555jamstack-production.up.railway.app';
        }
    }

    async loadBlogDetails() {
        try {
            console.log(`📡 Fetching blog post ${this.blogId}...`);

            const response = await fetch(`${this.apiBase}/api/blog-posts/${this.blogId}`);

            if (!response.ok) {
                if (response.status === 404) {
                    this.showError('Blog post not found');
                } else {
                    this.showError(`Failed to load blog post: ${response.status}`);
                }
                return;
            }

            const result = await response.json();

            if (result.success && result.data) {
                console.log('✅ Blog post loaded:', result.data.title);
                this.populateBlogDetails(result.data);
            } else {
                this.showError('Invalid blog post data received');
            }

        } catch (error) {
            console.error('❌ Error loading blog post:', error);
            this.showError('Failed to load blog post. Please try again.');
        }
    }

    populateBlogDetails(blog) {
        try {
            // Update page title
            document.title = `${blog.title} - Zohacous`;

            // Update meta tags
            this.updateMetaTags(blog);

            // Populate main content
            this.populateBasicInfo(blog);
            this.populateAuthorInfo(blog);
            this.populateContent(blog);
            this.populateMedia(blog);
            this.populateTags(blog);
            this.populateStats(blog);

            // Update breadcrumb if exists
            this.updateBreadcrumb(blog);

            console.log('✅ Blog details populated successfully');

        } catch (error) {
            console.error('❌ Error populating blog details:', error);
            this.showError('Error displaying blog post content');
        }
    }

    populateBasicInfo(blog) {
        // Title
        const titleElement = document.querySelector('.blog-details-name');
        if (titleElement) {
            titleElement.textContent = blog.title || 'Untitled';
        }

        // Reading time
        const readingTimeElement = document.getElementById('reading-time');
        if (readingTimeElement) {
            readingTimeElement.textContent = `${blog.reading_time || 5} Min. Read`;
        }

        // Publish date
        const publishDateElement = document.getElementById('publish-date');
        if (publishDateElement && blog.published_at) {
            const date = new Date(blog.published_at);
            publishDateElement.textContent = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    populateAuthorInfo(blog) {
        // Author name
        const authorNameElement = document.querySelector('.blog-details-author-name');
        if (authorNameElement) {
            authorNameElement.textContent = blog.author || 'Anonymous';
        }

        // Author bio
        const authorBioElement = document.querySelector('.blog-details-author-bio-text');
        if (authorBioElement) {
            authorBioElement.textContent = blog.author_bio || 'No bio available';
        }

        // Author image
        const authorImageElement = document.querySelector('.blog-details-author-image');
        if (authorImageElement && blog.author_image_url) {
            authorImageElement.src = blog.author_image_url;
            authorImageElement.alt = `${blog.author} profile picture`;
        }
    }

    populateContent(blog) {
        const contentElement = document.getElementById('blog-content');
        if (!contentElement) return;

        let content = '';

        // Use content_sections if available (structured content)
        if (blog.content_sections && blog.content_sections.length > 0) {
            content = blog.content_sections.map(section => {
                return `
                    <h3>${section.title || ''}</h3>
                    <p>${section.content || ''}</p>
                `;
            }).join('');
        } else if (blog.content) {
            // Use main content field
            content = blog.content;
        } else {
            content = '<p>No content available.</p>';
        }

        contentElement.innerHTML = content;
    }

    populateMedia(blog) {
        // Featured image
        const featuredImageWrapper = document.querySelector('.blog-details-featured-image-wrapper');
        const featuredImageElement = document.getElementById('featured-image');

        if (blog.featured_image_url && featuredImageElement && featuredImageWrapper) {
            featuredImageElement.src = blog.featured_image_url;
            featuredImageElement.alt = blog.title;
            featuredImageWrapper.style.display = 'block';
        }

        // Video (if exists)
        if (blog.video_url) {
            this.addVideoPlayer(blog.video_url);
        }
    }

    populateTags(blog) {
        const tagsWrapper = document.querySelector('.blog-details-tags-wrapper');
        const tagsContainer = document.getElementById('blog-tags');

        if (blog.tags && blog.tags.length > 0 && tagsContainer && tagsWrapper) {
            tagsContainer.innerHTML = blog.tags.map(tag =>
                `<span style="background: #667eea; color: white; padding: 6px 12px; border-radius: 16px; font-size: 14px;">${tag}</span>`
            ).join('');
            tagsWrapper.style.display = 'block';
        }
    }

    populateStats(blog) {
        const statsWrapper = document.querySelector('.blog-details-stats-wrapper');

        // Only show stats if any are greater than 0
        const hasStats = (blog.views_count > 0) || (blog.likes_count > 0) || (blog.shares_count > 0);

        if (hasStats && statsWrapper) {
            const viewsElement = document.getElementById('views-count');
            const likesElement = document.getElementById('likes-count');
            const sharesElement = document.getElementById('shares-count');

            if (viewsElement) viewsElement.textContent = blog.views_count || 0;
            if (likesElement) likesElement.textContent = blog.likes_count || 0;
            if (sharesElement) sharesElement.textContent = blog.shares_count || 0;

            statsWrapper.style.display = 'block';
        }
    }

    updateMetaTags(blog) {
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = blog.meta_description || blog.excerpt || '';
        }

        // Update Open Graph tags
        this.updateOrCreateMetaTag('property', 'og:title', blog.title);
        this.updateOrCreateMetaTag('property', 'og:description', blog.meta_description || blog.excerpt);
        this.updateOrCreateMetaTag('property', 'og:image', blog.featured_image_url);
        this.updateOrCreateMetaTag('property', 'og:url', window.location.href);

        // Update Twitter tags
        this.updateOrCreateMetaTag('name', 'twitter:title', blog.title);
        this.updateOrCreateMetaTag('name', 'twitter:description', blog.meta_description || blog.excerpt);
        this.updateOrCreateMetaTag('name', 'twitter:image', blog.featured_image_url);
    }

    updateOrCreateMetaTag(attribute, value, content) {
        if (!content) return;

        let meta = document.querySelector(`meta[${attribute}="${value}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attribute, value);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    updateBreadcrumb(blog) {
        // Update breadcrumb if exists
        const breadcrumbBlog = document.querySelector('.inner-banner-text-link[href*="blog"]');
        if (breadcrumbBlog) {
            const breadcrumbTitle = document.querySelector('.inner-banner-title');
            if (breadcrumbTitle) {
                breadcrumbTitle.textContent = blog.title;
            }
        }
    }

    addVideoPlayer(videoUrl) {
        const contentElement = document.getElementById('blog-content');
        if (!contentElement) return;

        const videoHtml = `
            <div style="margin: 30px 0;">
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                    <iframe src="${videoUrl}"
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;

        contentElement.insertAdjacentHTML('afterbegin', videoHtml);
    }

    showError(message) {
        console.error('❌ Blog Detail Error:', message);

        const titleElement = document.querySelector('.blog-details-name');
        if (titleElement) {
            titleElement.textContent = 'Error Loading Blog Post';
        }

        const contentElement = document.getElementById('blog-content');
        if (contentElement) {
            contentElement.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #dc3545;">
                    <h3 style="color: #dc3545; margin-bottom: 15px;">⚠️ Error</h3>
                    <p style="color: #6c757d;">${message}</p>
                    <a href="blog.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">
                        ← Back to Blog
                    </a>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Blog Detail Integration...');
    window.blogDetail = new BlogDetailIntegration();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded
    console.log('🚀 Initializing Blog Detail Integration (immediate)...');
    window.blogDetail = new BlogDetailIntegration();
}