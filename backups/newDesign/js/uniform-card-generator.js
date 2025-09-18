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
      html = html.replace(new RegExp(placeholder, 'g'), data[key]);
    });

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

      return {
        imageUrl: img ? img.src : 'images/placeholder.jpg',
        imageAlt: img ? img.alt : 'Profile Image',
        category: categoryEl ? categoryEl.textContent.trim() : 'Professional',
        authorName: authorEl ? authorEl.textContent.trim() : 'Unknown',
        title: titleEl ? titleEl.textContent.trim() : 'Professional Profile',
        description: descEl ? descEl.textContent.trim() : 'Professional profile.',
        buttonText: buttonEl ? buttonEl.textContent.trim() : 'View Profile',
        profileLink: '#'
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
        imageAlt: 'Sarah Chen AI Expert',
        category: 'AI & Machine Learning Expert',
        authorName: 'Sarah Chen',
        title: 'Sarah Chen - Senior AI Engineer',
        description: '8+ years of experience in machine learning and artificial intelligence. Sarah has worked at leading tech companies like Google AI and Meta, specializing in deep learning, neural networks, natural language processing, and AI ethics.',
        buttonText: 'View Profile',
        profileLink: '#sarah-chen'
      },
      {
        imageUrl: 'images/Course-Categories-Content-Bg.jpg',
        imageAlt: 'Mike Johnson Web Developer',
        category: 'Full-Stack Developer',
        authorName: 'Mike Johnson',
        title: 'Mike Johnson - Lead Web Developer',
        description: '10+ years building scalable web applications. Mike has expertise in React, Node.js, Python, and cloud architecture. Former lead developer at Netflix and Spotify, shipping products used by millions of users worldwide.',
        buttonText: 'View Profile',
        profileLink: '#mike-johnson'
      },
      {
        imageUrl: 'images/About-Me-Image.jpg',
        imageAlt: 'Emily Rodriguez Career Coach',
        category: 'Career Coach & Mentor',
        authorName: 'Emily Rodriguez',
        title: 'Emily Rodriguez - Career Transition Coach',
        description: '12+ years helping professionals transition into tech careers. Former tech recruiter turned career coach, Emily has successfully guided over 500 career changers through their journey into the technology industry.',
        buttonText: 'View Profile',
        profileLink: '#emily-rodriguez'
      },
      {
        imageUrl: 'images/About-Us-Image.png',
        imageAlt: 'David Park Data Scientist',
        category: 'Data Science Expert',
        authorName: 'David Park',
        title: 'David Park - Senior Data Scientist',
        description: 'PhD in Computer Science from Stanford University. 9+ years of experience in machine learning and data analytics. Former Principal Data Scientist at Uber and Airbnb, specializing in predictive modeling and big data systems.',
        buttonText: 'View Profile',
        profileLink: '#david-park'
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
    // Only convert if not already using uniform cards
    if (!container.classList.contains('use-uniform-cards')) {
      setTimeout(() => UniformCard.convertExistingCards(), 100);
    }
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniformCardGenerator;
}