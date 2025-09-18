# 🃏 Shared Card Components

A standardized card system for the AI Studio platform ensuring consistent UI/UX across all pages.

## 📁 Files in This Directory

### Core Files
- **`uniform-card-generator.js`** - Main JavaScript component generator
- **`uniform-card-styles.css`** - Complete CSS styling for shared cards
- **`uniform-card-template.html`** - HTML template structure

## 🚀 Quick Start

### 1. Include Required Files

```html
<!-- In your HTML head -->
<link href="shared/components/sharedCard/uniform-card-styles.css" rel="stylesheet" type="text/css">

<!-- Before closing body tag -->
<script src="shared/components/sharedCard/uniform-card-generator.js" type="text/javascript"></script>
```

### 2. Basic HTML Structure

```html
<div class="uniform-card-grid">
  <div class="uniform-card-item">
    <div class="uniform-card">
      <a href="https://example.com" class="uniform-card-image-link">
        <img src="image.jpg" alt="Description" class="uniform-card-image">
      </a>
      <div class="uniform-card-content">
        <div class="uniform-card-header">
          <div class="uniform-card-category">
            <div class="uniform-card-category-flex">
              <div class="uniform-card-category-dot"></div>
              <div class="uniform-card-category-text">Category</div>
            </div>
          </div>
          <div class="uniform-card-author">
            <img src="author-icon.svg" class="uniform-card-author-icon">
            <div class="uniform-card-author-name">Author Name</div>
          </div>
        </div>
        <a href="https://example.com" class="uniform-card-title">Card Title</a>
        <div class="uniform-card-divider"></div>
        <p class="uniform-card-description">Description text here...</p>
        <div class="uniform-card-action">
          <a href="https://example.com" class="uniform-card-button">
            <div class="uniform-card-button-text">Read More</div>
            <div class="uniform-card-button-arrow"></div>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 3. JavaScript Generation

```javascript
// Create single card
const cardHtml = UniformCard.create({
  title: "Your Card Title",
  category: "AI & Machine Learning",
  authorName: "John Doe",
  description: "Card description text...",
  imageUrl: "path/to/image.jpg",
  url: "https://example.com",
  buttonText: "Read More"
});

// Create multiple cards
const cardsData = [
  { title: "Card 1", category: "Tech", authorName: "Alice", description: "..." },
  { title: "Card 2", category: "Design", authorName: "Bob", description: "..." }
];
const cardsHtml = UniformCard.createMultiple(cardsData);

// Insert into container
document.querySelector('.container').innerHTML = cardsHtml;
```

## 🎨 CSS Classes Reference

### Container Classes
- `.uniform-card-grid` - Main grid container (3→2→1 column responsive)
- `.uniform-card-item` - Individual card wrapper

### Card Structure
- `.uniform-card` - Main card container (600px height)
- `.uniform-card-content` - Content area (340px height)
- `.uniform-card-header` - Top section with category and author

### Image Section
- `.uniform-card-image-link` - Image wrapper link (260px height)
- `.uniform-card-image` - Image element (cover fit)

### Content Elements
- `.uniform-card-category-text` - Category chip (12px, styled pill)
- `.uniform-card-category-dot` - Category indicator dot (6px)
- `.uniform-card-author-name` - Author name
- `.uniform-card-title` - Title link (66px height, 2 lines max)
- `.uniform-card-divider` - Visual separator line
- `.uniform-card-description` - Description text (120px height, 5 lines max)

### Action Elements
- `.uniform-card-action` - Button container (pushed to bottom)
- `.uniform-card-button` - Action button
- `.uniform-card-button-text` - Button text
- `.uniform-card-button-arrow` - Button arrow icon

## 🗄️ Database Integration

### Required Database Fields

When using shared cards with database content, ensure your table has these fields:

```sql
-- Core fields
title VARCHAR(255) NOT NULL
author VARCHAR(255)
category VARCHAR(100)
excerpt TEXT -- Used as description
url VARCHAR(500) -- For button links

-- Optional fields
content TEXT
image_url VARCHAR(500)
published_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP
locale VARCHAR(5) DEFAULT 'en'
```

### API Response Format

Your API should return data in this format:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Card Title",
        "author": "Author Name",
        "category": "ai",
        "excerpt": "Description text...",
        "url": "https://example.com/article",
        "publishedAt": "2025-01-15T10:00:00Z"
      }
    }
  ]
}
```

## ⚙️ Admin Panel Integration

### Admin Form Fields

Include these fields in your admin panel for full card management:

```html
<!-- Basic Info -->
<input type="text" id="title" placeholder="Card Title" required>
<input type="text" id="author" placeholder="Author Name" required>

<!-- Category Selection -->
<select id="category">
  <option value="ai">AI & Machine Learning</option>
  <option value="web">Web Development</option>
  <option value="career">Career Development</option>
  <option value="data">Data Science</option>
  <option value="security">Cybersecurity</option>
  <option value="design">UI/UX Design</option>
  <option value="cloud">Cloud Computing</option>
  <option value="mobile">Mobile Development</option>
  <option value="devops">DevOps</option>
</select>

<!-- Content -->
<textarea id="excerpt" placeholder="Brief description" required></textarea>
<textarea id="content" placeholder="Full content (optional)"></textarea>

<!-- Links -->
<input type="url" id="url" placeholder="https://example.com/article">
<input type="url" id="image_url" placeholder="https://example.com/image.jpg">
```

### Admin JavaScript Functions

```javascript
// Load cards for admin display
async function loadCards() {
  const response = await fetch('/api/your-cards-endpoint');
  const result = await response.json();
  const cards = result.data || [];

  // Display in admin interface
  displayCardsInAdmin(cards);
}

// Add new card
async function addCard() {
  const cardData = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    category: document.getElementById('category').value,
    excerpt: document.getElementById('excerpt').value,
    content: document.getElementById('content').value,
    url: document.getElementById('url').value,
    image_url: document.getElementById('image_url').value,
    published_at: new Date().toISOString(),
    locale: 'en'
  };

  const response = await fetch('/api/your-cards-endpoint', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData)
  });

  if (response.ok) {
    alert('Card added successfully!');
    loadCards(); // Refresh display
  }
}
```

## 📱 Responsive Behavior

### Breakpoints
- **Desktop (1200px+)**: 3 columns
- **Tablet (768px-1199px)**: 2 columns
- **Mobile (< 768px)**: 1 column

### Card Dimensions
- **Desktop**: 600px height
- **Tablet**: 580px height
- **Mobile**: 560px height

## 🎯 Use Cases

### 1. Blog Posts
```javascript
// Blog integration example
const blogCard = UniformCard.create({
  title: post.title,
  category: post.category,
  authorName: post.author,
  description: post.excerpt,
  imageUrl: post.featured_image,
  url: post.url,
  buttonText: "Read Full Article"
});
```

### 2. Course Cards
```javascript
// Course integration example
const courseCard = UniformCard.create({
  title: course.title,
  category: course.difficulty,
  authorName: course.instructor,
  description: course.description,
  imageUrl: course.thumbnail,
  url: `/courses/${course.slug}`,
  buttonText: "Enroll Now"
});
```

### 3. Teacher Profiles
```javascript
// Teacher profile example
const teacherCard = UniformCard.create({
  title: teacher.name,
  category: teacher.expertise,
  authorName: teacher.company,
  description: teacher.bio,
  imageUrl: teacher.photo,
  url: teacher.profile_link,
  buttonText: "View Profile"
});
```

## 🔧 Customization

### Category Colors
Edit the CSS to customize category chip colors:

```css
.uniform-card .uniform-card-category-text {
  background: rgba(255, 214, 89, 0.1) !important; /* Change background */
  border: 1px solid rgba(255, 214, 89, 0.3) !important; /* Change border */
  color: #ffd659 !important; /* Change text color */
}
```

### Card Heights
Modify card dimensions in CSS:

```css
.uniform-card {
  height: 600px; /* Change card height */
}

.uniform-card-content {
  height: 340px; /* Adjust content area */
}
```

## ⚠️ Important Notes

1. **Fixed Dimensions**: Cards use fixed heights for consistency
2. **Text Truncation**: Long text is automatically truncated with ellipsis
3. **Image Fallbacks**: Always provide fallback images for missing URLs
4. **URL Validation**: Ensure URLs are properly formatted in admin
5. **Performance**: Limit to 20-30 cards per page for optimal performance

## 🐛 Troubleshooting

### Cards Not Displaying
- Check if CSS file is loaded correctly
- Verify container has `uniform-card-grid` class
- Ensure JavaScript file is loaded after DOM

### Styling Issues
- Check for CSS conflicts with existing styles
- Use `!important` flags if needed
- Verify responsive breakpoints are working

### API Integration
- Confirm API returns data in expected format
- Check for CORS issues in browser console
- Validate database field names match expected structure

## 📞 Support

For questions or issues with shared cards:
1. Check this README first
2. Verify your implementation matches the examples
3. Test with sample data before using real API data
4. Check browser console for JavaScript errors

---

**Last Updated**: January 2025
**Version**: 2.0
**Compatible With**: AI Studio NewDesign v2.0+