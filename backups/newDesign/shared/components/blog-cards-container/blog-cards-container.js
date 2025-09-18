/**
 * Blog Cards Container Shared Component
 * Following the same pattern as featured-courses JavaScript component
 */
class BlogCardsContainer {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.currentTab = 'Tab 1';
    this.blogPosts = [];
    this.categories = ['All', 'Development', 'Design', 'AI & ML', 'Career'];

    // API configuration
    this.apiBase = 'http://localhost:3000';

    this.init();
  }

  async init() {
    await this.loadBlogPosts();
    this.setupTabMenu();
    this.render();
    this.bindEvents();
  }

  async loadBlogPosts() {
    try {
      const response = await fetch('/api/blog-posts');
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        this.blogPosts = result.data;
      } else {
        console.error('Failed to load blog posts:', result);
        this.blogPosts = [];
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      this.blogPosts = [];
    }
  }

  setupTabMenu() {
    if (!this.container) return;

    // Check if tab menu already exists
    let tabMenu = this.container.querySelector('.main-blog-tab-menu');

    if (!tabMenu) {
      // Create tab menu structure matching courses pattern
      const tabsContainer = document.createElement('div');
      tabsContainer.className = 'main-blog-tabs w-tabs';
      tabsContainer.setAttribute('data-current', 'Tab 1');
      tabsContainer.setAttribute('data-easing', 'ease');
      tabsContainer.setAttribute('data-duration-in', '300');
      tabsContainer.setAttribute('data-duration-out', '100');

      tabMenu = document.createElement('div');
      tabMenu.className = 'main-blog-tab-menu w-tab-menu';

      // Create tab links for each category
      this.categories.forEach((category, index) => {
        const tabLink = document.createElement('a');
        tabLink.setAttribute('data-w-tab', `Tab ${index + 1}`);
        tabLink.className = `main-blog-tab-link w-inline-block w-tab-link${index === 0 ? ' w--current' : ''}`;
        tabLink.innerHTML = `<div>${category}</div>`;

        tabMenu.appendChild(tabLink);
      });

      tabsContainer.appendChild(tabMenu);

      // Insert tab menu before the tab content
      const tabContent = this.container.querySelector('.main-blog-tab-content');
      if (tabContent) {
        this.container.insertBefore(tabsContainer, tabContent);
      }
    }
  }

  render() {
    if (!this.container) return;

    const tabPanes = this.container.querySelectorAll('.main-blog-tab-pane');

    tabPanes.forEach((pane, index) => {
      const tabId = pane.getAttribute('data-w-tab') || `Tab ${index + 1}`;
      const categoryIndex = parseInt(tabId.replace('Tab ', '')) - 1;
      const category = this.categories[categoryIndex] || 'All';

      // Filter posts by category
      let filteredPosts = this.blogPosts;
      if (category !== 'All') {
        filteredPosts = this.blogPosts.filter(post =>
          post.category && post.category.toLowerCase().includes(category.toLowerCase())
        );
      }

      const collectionList = pane.querySelector('.main-blog-collection-list');
      if (collectionList) {
        this.renderBlogPosts(collectionList, filteredPosts);
      }
    });
  }

  renderBlogPosts(container, posts) {
    container.innerHTML = '';

    if (!posts || posts.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'w-dyn-empty';
      emptyMessage.innerHTML = '<div>No blog posts found.</div>';
      container.appendChild(emptyMessage);
      return;
    }

    posts.forEach(post => {
      const postItem = this.createBlogPostItem(post);
      container.appendChild(postItem);
    });
  }

  createBlogPostItem(post) {
    const item = document.createElement('div');
    item.setAttribute('role', 'listitem');
    item.className = 'main-blog-collection-item w-dyn-item';

    // Use the existing uniform card structure
    item.innerHTML = `
      <div class="uniform-card-wrapper">
        <div class="uniform-card-image-wrapper">
          <a href="detail_blog.html?id=${post.id}" class="uniform-card-image-link">
            <img src="${post.featured_image_url || 'images/blog-placeholder.jpg'}"
                 alt="${post.title || 'Blog post'}"
                 class="uniform-card-image"
                 loading="lazy">
          </a>
        </div>
        <div class="uniform-card-content">
          <div class="uniform-card-category-tag">
            ${post.category || 'Blog'}
          </div>
          <h3 class="uniform-card-title">
            <a href="detail_blog.html?id=${post.id}" class="uniform-card-title-link">
              ${post.title || 'Untitled Post'}
            </a>
          </h3>
          <p class="uniform-card-excerpt">
            ${post.excerpt || post.content?.substring(0, 150) + '...' || 'No excerpt available'}
          </p>
          <div class="uniform-card-meta">
            <div class="uniform-card-author">
              ${post.author || 'Anonymous'}
            </div>
            <div class="uniform-card-date">
              ${this.formatDate(post.published_at || post.created_at)}
            </div>
          </div>
          <div class="uniform-card-button-wrapper">
            <a href="detail_blog.html?id=${post.id}" class="uniform-card-button">
              Read More
            </a>
          </div>
        </div>
      </div>
    `;

    return item;
  }

  formatDate(dateString) {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  }

  bindEvents() {
    if (!this.container) return;

    // Handle tab clicks
    const tabLinks = this.container.querySelectorAll('.main-blog-tab-link');
    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-w-tab');
        this.switchTab(tabId);
      });
    });
  }

  switchTab(tabId) {
    if (!this.container) return;

    // Update current tab
    this.currentTab = tabId;

    // Update tab link states
    const tabLinks = this.container.querySelectorAll('.main-blog-tab-link');
    tabLinks.forEach(link => {
      if (link.getAttribute('data-w-tab') === tabId) {
        link.classList.add('w--current');
      } else {
        link.classList.remove('w--current');
      }
    });

    // Update tab pane states
    const tabPanes = this.container.querySelectorAll('.main-blog-tab-pane');
    tabPanes.forEach(pane => {
      if (pane.getAttribute('data-w-tab') === tabId) {
        pane.classList.add('w--tab-active');
        pane.style.display = 'block';
      } else {
        pane.classList.remove('w--tab-active');
        pane.style.display = 'none';
      }
    });

    // Update tabs container current attribute
    const tabsContainer = this.container.querySelector('.main-blog-tabs');
    if (tabsContainer) {
      tabsContainer.setAttribute('data-current', tabId);
    }
  }

  // Public methods for external control
  async refresh() {
    await this.loadBlogPosts();
    this.render();
  }

  filterByCategory(category) {
    const categoryIndex = this.categories.indexOf(category);
    if (categoryIndex !== -1) {
      this.switchTab(`Tab ${categoryIndex + 1}`);
    }
  }

  getCurrentCategory() {
    const tabIndex = parseInt(this.currentTab.replace('Tab ', '')) - 1;
    return this.categories[tabIndex] || 'All';
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Look for blog cards container in the page
  const blogContainer = document.querySelector('.main-blog-content');
  if (blogContainer) {
    // Add an ID if it doesn't have one
    if (!blogContainer.id) {
      blogContainer.id = 'main-blog-container';
    }

    // Initialize the component
    window.blogCardsContainer = new BlogCardsContainer(blogContainer.id);
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlogCardsContainer;
}