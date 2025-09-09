const config = {
  head: {
    favicon: "/favicon.ico",
  },
  auth: {
    logo: "/logo.png",
  },
  menu: {
    logo: "/logo-menu.png",
  },
  theme: {
    colors: {
      primary100: '#f0f8ff',
      primary200: '#d4edda', 
      primary500: '#28a745',
      primary600: '#218838',
      primary700: '#1e7e34',
      danger700: '#dc3545'
    }
  },
  tutorials: false,
  notifications: { 
    releases: false 
  },
  translations: {
    en: {
      "app.components.HomePage.welcome": "Welcome to AI Studio Career Orientation CMS! 🚀",
      "app.components.HomePage.welcome.again": "Manage your career orientation content with ease.",
      "HomePage.helmet.title": "AI Studio Career Orientation Admin",
      
      // Career Orientation Content Type Labels
      "content-type-builder.modalForm.contentType.displayName.placeholder": "Career Orientation Page",
      "api::career-orientation-page.career-orientation-page": "Career Orientation Pages",
      "api::career-orientation-assessment-response.career-orientation-assessment-response": "Assessment Responses",
      
      // Component Labels  
      "career-orientation.hero": "🎯 Hero Section",
      "career-orientation.problems-section": "⚠️ Problems Section",
      "career-orientation.solutions-section": "✅ Solutions Section", 
      "career-orientation.process-section": "📋 Process Section",
      "career-orientation.career-paths-section": "🛤️ Career Paths Section",
      "career-orientation.expert-section": "👨‍💼 Expert Section",
      "career-orientation.partners-section": "🤝 Partners Section",
      "career-orientation.assessment-section": "📊 Assessment Section",
      "career-orientation.footer-section": "🔗 Footer Section",
      
      // Field Labels
      "pageTitle": "📄 Page Title",
      "metaDescription": "🔍 Meta Description", 
      "metaKeywords": "🏷️ Meta Keywords",
      "mainTitle": "🎯 Main Title",
      "subtitle": "📝 Subtitle",
      "description": "📖 Description",
      "sectionTitle": "🏷️ Section Title",
      "sectionSubtitle": "📝 Section Subtitle",
      "sectionDescription": "📖 Section Description",
      "ctaText": "🔘 Call to Action Text",
      "ctaUrl": "🔗 Call to Action URL",
      
      // Success Messages
      "notification.success.saved": "✅ Career orientation content saved successfully!",
      "notification.success.published": "🚀 Page published and live!",
      "notification.success.deleted": "🗑️ Content deleted successfully.",
    }
  }
};

const bootstrap = (app) => {
  // Custom styling for admin interface
  const style = document.createElement('style');
  style.textContent = `
    /* Career Orientation Content Management Styling */
    
    /* Header customization */
    [data-strapi-header] {
      background: linear-gradient(90deg, #28a745 0%, #20c997 100%) !important;
      color: white !important;
    }
    
    /* Content Type Icons */
    [aria-label*="Career Orientation"] .sc-dlfnuX {
      background: linear-gradient(45deg, #28a745, #20c997) !important;
      color: white !important;
    }
    
    /* Component sections styling */
    .components-Input-wrapper[data-testid*="hero"] {
      border-left: 4px solid #ff6b6b !important;
      padding-left: 12px !important;
    }
    
    .components-Input-wrapper[data-testid*="problems"] {
      border-left: 4px solid #ffa502 !important;
      padding-left: 12px !important;
    }
    
    .components-Input-wrapper[data-testid*="solutions"] {
      border-left: 4px solid #3742fa !important; 
      padding-left: 12px !important;
    }
    
    .components-Input-wrapper[data-testid*="process"] {
      border-left: 4px solid #2ed573 !important;
      padding-left: 12px !important;
    }
    
    .components-Input-wrapper[data-testid*="career-paths"] {
      border-left: 4px solid #a55eea !important;
      padding-left: 12px !important;
    }
    
    .components-Input-wrapper[data-testid*="expert"] {
      border-left: 4px solid #26de81 !important;
      padding-left: 12px !important;
    }
    
    .components-Input-wrapper[data-testid*="partners"] {
      border-left: 4px solid #fd79a8 !important;
      padding-left: 12px !important;
    }
    
    .components-Input-wrapper[data-testid*="assessment"] {
      border-left: 4px solid #fdcb6e !important;
      padding-left: 12px !important;
    }
    
    .components-Input-wrapper[data-testid*="footer"] {
      border-left: 4px solid #6c5ce7 !important;
      padding-left: 12px !important;
    }
    
    /* Success indicators */
    .success-indicator {
      background: linear-gradient(45deg, #28a745, #20c997) !important;
      color: white !important;
      padding: 8px 16px !important;
      border-radius: 4px !important;
      margin: 8px 0 !important;
    }
    
    /* Component cards */
    .component-card {
      border: 1px solid #e9ecef !important;
      border-radius: 8px !important;
      padding: 16px !important;
      margin: 8px 0 !important;
      background: #f8f9fa !important;
    }
    
    /* Quick action buttons */
    .quick-actions {
      display: flex !important;
      gap: 8px !important;
      margin: 16px 0 !important;
    }
    
    .quick-action-btn {
      background: #28a745 !important;
      color: white !important;
      border: none !important;
      padding: 8px 16px !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      font-size: 12px !important;
    }
    
    .quick-action-btn:hover {
      background: #218838 !important;
    }
    
    /* Progress indicators */
    .content-progress {
      background: linear-gradient(to right, #28a745 var(--progress, 0%), #e9ecef var(--progress, 0%)) !important;
      height: 4px !important;
      border-radius: 2px !important;
      margin: 8px 0 !important;
    }
    
    /* Field completion status */
    .field-complete {
      position: relative !important;
    }
    
    .field-complete::after {
      content: "✓" !important;
      position: absolute !important;
      top: -8px !important;
      right: -8px !important;
      background: #28a745 !important;
      color: white !important;
      border-radius: 50% !important;
      width: 16px !important;
      height: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 10px !important;
    }
  `;
  document.head.appendChild(style);
  
  // Add welcome message for career orientation CMS
  console.log('🚀 AI Studio Career Orientation CMS loaded successfully!');
  console.log('📊 Content Management Features:');
  console.log('   • 163+ field comprehensive content management');
  console.log('   • Multi-language support (EN/HE/RU)'); 
  console.log('   • Dynamic assessment forms');
  console.log('   • Career path recommendations');
  console.log('   • Partner company management');
  console.log('   • Expert profile showcase');
  console.log('   • Real-time response analytics');
};

export default {
  config,
  bootstrap,
};

// Additional admin customizations
export const AdminConfiguration = {
  // Content Type Display Names
  contentTypes: {
    'api::career-orientation-page.career-orientation-page': {
      displayName: '🎯 Career Orientation Pages',
      description: 'Comprehensive career orientation page management',
      settings: {
        searchable: true,
        filterable: true,
        bulkable: true,
        pageSize: 10,
        defaultSortBy: 'updatedAt',
        defaultSortOrder: 'DESC'
      }
    },
    'api::career-orientation-assessment-response.career-orientation-assessment-response': {
      displayName: '📊 Assessment Responses', 
      description: 'User assessment responses and analytics',
      settings: {
        searchable: true,
        filterable: true, 
        bulkable: false,
        pageSize: 25,
        defaultSortBy: 'createdAt',
        defaultSortOrder: 'DESC'
      }
    }
  },
  
  // Custom field configurations
  fieldConfigurations: {
    // Rich text editors for detailed descriptions
    richTextFields: [
      'detailedDescription',
      'expertBio',
      'longDescription'
    ],
    
    // Color picker fields  
    colorFields: [
      'highlightColor',
      'colorTheme',
      'logoBackgroundColor'
    ],
    
    // URL validation fields
    urlFields: [
      'ctaUrl',
      'canonicalUrl', 
      'companyWebsite',
      'expertLinkedin',
      'expertTwitter',
      'expertWebsite'
    ]
  }
};

// Helper functions for admin interface
export const AdminHelpers = {
  // Calculate content completion percentage
  calculateContentCompletion: (pageData) => {
    const requiredFields = [
      'pageTitle', 'hero', 'problemsSection', 'solutionsSection', 
      'processSection', 'careerPathsSection', 'expertSection',
      'partnersSection', 'assessmentSection', 'footerSection'
    ];
    
    const completedFields = requiredFields.filter(field => 
      pageData[field] && Object.keys(pageData[field]).length > 0
    );
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  },
  
  // Validate required components
  validatePageContent: (pageData) => {
    const errors = [];
    
    if (!pageData.hero?.mainTitle) {
      errors.push('Hero section requires a main title');
    }
    
    if (!pageData.expertSection?.expertName) {
      errors.push('Expert section requires expert name');
    }
    
    if (!pageData.assessmentSection?.assessmentQuestions?.length) {
      errors.push('Assessment section requires at least one question');
    }
    
    return errors;
  }
};