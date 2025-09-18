/*
 * Uniform Card Generator - Creates standardized cards
 * Ensures all cards have identical dimensions and layout
 * Usage: UniformCard.create(cardData) or UniformCard.createMultiple([cardData])
 */

class UniformCardGenerator {
  constructor() {
    this.template = null;
    this.loadTemplate();
  }

  // Load the HTML template
  async loadTemplate() {
    try {
      const response = await fetch('shared/components/sharedCard/uniform-card-template.html');
      this.template = await response.text();
    } catch (error) {
      console.error('Failed to load uniform card template:', error);
      // Fallback inline template
      this.template = this.getInlineTemplate();
    }
  }

  // Fallback inline template
  getInlineTemplate() {
    return `
      <div role="listitem" class="uniform-card-item">
        <div class="uniform-card">
          <a href="{{PROFILE_LINK}}" class="uniform-card-image-link">
            <img src="{{IMAGE_URL}}" loading="lazy" alt="{{IMAGE_ALT}}" class="uniform-card-image">
          </a>
          <div class="uniform-card-content">
            <div class="uniform-card-header">
              <div class="uniform-card-category">
                <div class="uniform-card-category-flex">
                  <div class="uniform-card-category-dot"></div>
                  <div class="uniform-card-category-text">{{CATEGORY}}</div>
                </div>
              </div>
              <div class="uniform-card-author">
                <img src="images/Blog-Card-Author-Icon.svg" loading="lazy" alt="Author" class="uniform-card-author-icon">
                <div class="uniform-card-author-name">{{AUTHOR_NAME}}</div>
              </div>
            </div>
            <a href="{{PROFILE_LINK}}" class="uniform-card-title">{{TITLE}}</a>
            <div class="uniform-card-divider"></div>
            <p class="uniform-card-description">{{DESCRIPTION}}</p>
            <div class="uniform-card-action">
              <a href="{{PROFILE_LINK}}" class="uniform-card-button">
                <div class="uniform-card-button-text">{{BUTTON_TEXT}}</div>
                <div class="uniform-card-button-arrow"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Create a single uniform card
  create(cardData) {
    if (!this.template) {
      this.template = this.getInlineTemplate();
    }

    // Validate required fields
    const required = ['title', 'category', 'authorName', 'description', 'imageUrl'];
    for (const field of required) {
      if (!cardData[field]) {
        console.warn(`Missing required field: ${field}`);
      }
    }

    // Set defaults
    const data = {
      profileLink: cardData.profileLink || '#',
      imageUrl: cardData.imageUrl || 'images/placeholder.jpg',
      imageAlt: cardData.imageAlt || cardData.title || 'Profile Image',
      category: cardData.category || 'Professional',
      authorName: cardData.authorName || 'Unknown',
      title: cardData.title || 'Professional Profile',
      description: this.truncateDescription(cardData.description || 'Professional with extensive experience in their field.'),
      buttonText: cardData.buttonText || 'View Profile'
    };

    // Replace template placeholders
    let html = this.template;
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key.toUpperCase()}}}`;
      html = html.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), data[key]);
    });

    // Ensure all common placeholders are replaced
    html = html.replace(/\{\{BUTTON_TEXT\}\}/g, data.buttonText || 'View Profile');
    html = html.replace(/\{\{PROFILE_LINK\}\}/g, data.profileLink || '#');
    html = html.replace(/\{\{CATEGORY\}\}/g, data.category || 'Professional');
    html = html.replace(/\{\{AUTHOR_NAME\}\}/g, data.authorName || 'Unknown');
    html = html.replace(/\{\{TITLE\}\}/g, data.title || 'Professional Profile');
    html = html.replace(/\{\{DESCRIPTION\}\}/g, data.description || 'Professional profile.');
    html = html.replace(/\{\{IMAGE_URL\}\}/g, data.imageUrl || 'images/placeholder.jpg');
    html = html.replace(/\{\{IMAGE_ALT\}\}/g, data.imageAlt || 'Profile Image');

    return html;
  }

  // Create multiple uniform cards
  createMultiple(cardsData) {
    return cardsData.map(cardData => this.create(cardData)).join('\n');
  }

  // Truncate description to fit fixed height
  truncateDescription(text, maxLength = 200) {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  // Convert existing cards to uniform cards
  convertExistingCards(containerSelector = '.main-blog-collection-list') {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('Container not found:', containerSelector);
      return;
    }

    // Extract data from existing cards
    const existingCards = container.querySelectorAll('.main-blog-collection-list-item');
    const cardsData = [];

    existingCards.forEach(card => {
      const data = this.extractCardData(card);
      if (data) {
        cardsData.push(data);
      }
    });

    // Generate uniform cards
    if (cardsData.length > 0) {
      const uniformCardsHTML = this.createMultiple(cardsData);
      container.innerHTML = uniformCardsHTML;
      container.classList.add('use-uniform-cards');
    }
  }

  // Extract data from existing card HTML
  extractCardData(cardElement) {
    try {
      const img = cardElement.querySelector('.main-blog-image, .uniform-card-image');
      const categoryEl = cardElement.querySelector('.blog-card-categories-name, .uniform-card-category-text');
      const authorEl = cardElement.querySelector('.blog-card-author-name, .uniform-card-author-name');
      const titleEl = cardElement.querySelector('.blog-post-name, .uniform-card-title');
      const descEl = cardElement.querySelector('.main-blog-description-text, .uniform-card-description');
      const buttonEl = cardElement.querySelector('.blog-card-link-text, .uniform-card-button-text');

      // Extract profile link from existing links
      let profileLink = '#';
      const titleLink = cardElement.querySelector('.blog-post-name[href], .uniform-card-title[href]');
      const buttonLink = cardElement.querySelector('.blog-card-link[href], .uniform-card-button[href]');
      const imageLink = cardElement.querySelector('.main-blog-image-link[href], .uniform-card-image-link[href]');

      if (titleLink && titleLink.href) {
        profileLink = titleLink.href;
      } else if (buttonLink && buttonLink.href) {
        profileLink = buttonLink.href;
      } else if (imageLink && imageLink.href) {
        profileLink = imageLink.href;
      }

      // Convert absolute URLs to relative if they're on the same domain
      if (profileLink.includes(window.location.origin)) {
        profileLink = profileLink.replace(window.location.origin, '');
        if (profileLink.startsWith('/backups/newDesign/')) {
          profileLink = profileLink.substring('/backups/newDesign/'.length);
        }
      }

      // Ensure button text is always valid
      let buttonText = 'View Profile';
      if (buttonEl && buttonEl.textContent.trim()) {
        const text = buttonEl.textContent.trim();
        // Don't use placeholder text
        if (text !== '{{BUTTON_TEXT}}' && text !== '{BUTTON_TEXT}' && !text.includes('{{')) {
          buttonText = text;
        }
      }

      return {
        imageUrl: img ? img.src : 'images/placeholder.jpg',
        imageAlt: img ? img.alt : 'Profile Image',
        category: categoryEl ? categoryEl.textContent.trim() : 'Professional',
        authorName: authorEl ? authorEl.textContent.trim() : 'Unknown',
        title: titleEl ? titleEl.textContent.trim() : 'Professional Profile',
        description: this.truncateDescription(descEl ? descEl.textContent.trim() : 'Professional profile.'),
        buttonText: buttonText,
        profileLink: profileLink
      };
    } catch (error) {
      console.error('Error extracting card data:', error);
      return null;
    }
  }

  // Initialize uniform cards with teacher data
  initializeTeacherCards() {
    const teachersData = [
      {
        imageUrl: 'images/CTA-Section-Bg.jpg',
        imageAlt: 'Sarah Chen AI Instructor',
        category: 'AI & Machine Learning',
        authorName: 'Sarah Chen',
        title: 'Sarah Chen - AI & Machine Learning Instructor',
        description: 'Co-founder & AI Lead at TechEd Solutions. 8+ years of commercial AI development experience. Expert in teaching complex machine learning concepts through practical, hands-on projects. Mentored 300+ students in AI fundamentals.',
        buttonText: 'View Profile',
        profileLink: 'detail_teacher.html?id=1'
      },
      {
        imageUrl: 'images/Course-Categories-Content-Bg.jpg',
        imageAlt: 'Mike Johnson Full-Stack Instructor',
        category: 'Web Development',
        authorName: 'Mike Johnson',
        title: 'Mike Johnson - Full-Stack Development Instructor',
        description: 'Frontend Lead at WebCraft Studios. 10+ years of commercial development experience. Specializes in teaching modern JavaScript, React, and full-stack development through real-world projects and industry best practices.',
        buttonText: 'View Profile',
        profileLink: 'detail_teacher.html?id=2'
      },
      {
        imageUrl: 'images/About-Me-Image.jpg',
        imageAlt: 'Emily Rodriguez Career Coach',
        category: 'Career Development',
        authorName: 'Emily Rodriguez',
        title: 'Emily Rodriguez - Career Transition Coach',
        description: 'Software Engineer & Career Mentor. 7+ years of commercial development experience. Expert in guiding career changers through structured learning paths and practical skill development for successful tech transitions.',
        buttonText: 'View Profile',
        profileLink: 'detail_teacher.html?id=3'
      },
      {
        imageUrl: 'images/About-Us-Image.png',
        imageAlt: 'David Park Data Science Instructor',
        category: 'Data Science',
        authorName: 'David Park',
        title: 'David Park - Data Science Instructor',
        description: 'Senior Data Scientist & Educator. 9+ years of commercial analytics experience. Passionate about teaching data science fundamentals through interactive workshops and real business case studies.',
        buttonText: 'View Profile',
        profileLink: 'detail_teacher.html?id=4'
      }
    ];

    return this.createMultiple(teachersData);
  }
}

// Create global instance
const UniformCard = new UniformCardGenerator();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load CSS if not already loaded
  if (!document.querySelector('link[href*="uniform-card-styles.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'shared/components/sharedCard/uniform-card-styles.css';
    document.head.appendChild(link);
  }

  // Auto-convert existing cards if container exists
  const container = document.querySelector('.main-blog-collection-list');
  if (container && container.children.length > 0) {
    // Only convert if not already using uniform cards AND not on blog page
    // Blog integration handles its own uniform card sizing
    const isBlogPage = document.title.includes('Blog') || window.location.pathname.includes('blog');
    if (!container.classList.contains('use-uniform-cards') && !isBlogPage) {
      setTimeout(() => UniformCard.convertExistingCards(), 100);
    }
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniformCardGenerator;
}