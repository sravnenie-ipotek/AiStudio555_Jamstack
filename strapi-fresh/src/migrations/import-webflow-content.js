'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const pageMapping = {
  'home.html': 'home',
  'how-it-works.html': 'how_it_works',
  'who-we-are.html': 'who_we_are',
  'for-whom.html': 'for_whom',
  'what-you-get.html': 'what_you_get',
  'pricing.html': 'pricing',
  'security.html': 'security',
  'contact.html': 'contact',
  '404.html': '404',
  'faq.html': 'faq',
  'terms-and-conditions.html': 'terms_and_conditions',
  'privacy-policy.html': 'privacy_policy',
  'thank-you.html': 'thank_you',
  'disclaimer.html': 'disclaimer',
  'accessibility.html': 'accessibility',
  'ai.html': 'ai',
  'blog.html': 'blog',
  'career.html': 'career',
  'case-studies.html': 'case_studies',
  'certification.html': 'certification',
  'company.html': 'company',
  'features.html': 'features',
  'integrations.html': 'integrations',
  'partners.html': 'partners',
  'resources.html': 'resources',
  'testimonials.html': 'testimonials',
};

module.exports = {
  async importWebflowContent(strapi) {
    const webflowPath = path.join(process.cwd(), '..');
    const sections = [];
    
    // Process each HTML file
    for (const [fileName, pageName] of Object.entries(pageMapping)) {
      const filePath = path.join(webflowPath, fileName);
      
      if (fs.existsSync(filePath)) {
        const html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);
        
        // Extract sections based on common patterns
        const pageSections = this.extractSections($, pageName);
        sections.push(...pageSections);
      }
    }
    
    // Import sections to Strapi
    for (const section of sections) {
      await this.createOrUpdateSection(strapi, section);
    }
    
    return sections.length;
  },
  
  extractSections($, pageName) {
    const sections = [];
    let sectionOrder = 0;
    
    // Common section patterns
    const sectionSelectors = [
      '.section',
      '[data-section]',
      '.hero-section',
      '.content-section',
      '.features-section',
      '.testimonials-section',
      '.cta-section',
      '.footer-section',
      'section',
      '[class*="section"]',
    ];
    
    sectionSelectors.forEach(selector => {
      $(selector).each((index, element) => {
        const $section = $(element);
        const sectionId = $section.attr('id') || $section.attr('data-section-id') || `${pageName}-section-${sectionOrder}`;
        
        // Extract section content
        const sectionData = {
          pageName,
          sectionId,
          sectionName: this.extractSectionName($section, sectionId),
          content: this.extractContent($section),
          heading: this.extractHeading($section),
          subheading: this.extractSubheading($section),
          buttonText: this.extractButtonText($section),
          buttonUrl: this.extractButtonUrl($section),
          imageUrl: this.extractImageUrl($section),
          isVisible: true,
          order: sectionOrder++,
          metadata: {
            originalClasses: $section.attr('class') || '',
            originalId: $section.attr('id') || '',
            extractedAt: new Date().toISOString(),
          },
        };
        
        // Only add if has meaningful content
        if (sectionData.content || sectionData.heading) {
          sections.push(sectionData);
        }
      });
    });
    
    return sections;
  },
  
  extractSectionName($section, sectionId) {
    // Try to find a meaningful name
    const heading = $section.find('h1, h2').first().text().trim();
    if (heading) return heading.substring(0, 50);
    
    const className = $section.attr('class') || '';
    if (className.includes('hero')) return 'Hero Section';
    if (className.includes('features')) return 'Features Section';
    if (className.includes('testimonials')) return 'Testimonials Section';
    if (className.includes('cta')) return 'Call to Action';
    if (className.includes('footer')) return 'Footer Section';
    
    return sectionId.replace(/-/g, ' ').replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  },
  
  extractContent($section) {
    // Remove scripts and styles
    $section.find('script, style').remove();
    
    // Get all text content
    const paragraphs = $section.find('p').map((i, el) => $(el).text().trim()).get();
    const listItems = $section.find('li').map((i, el) => $(el).text().trim()).get();
    
    return [...paragraphs, ...listItems].join('\\n\\n');
  },
  
  extractHeading($section) {
    const h1 = $section.find('h1').first().text().trim();
    if (h1) return h1;
    
    const h2 = $section.find('h2').first().text().trim();
    if (h2) return h2;
    
    const h3 = $section.find('h3').first().text().trim();
    return h3 || '';
  },
  
  extractSubheading($section) {
    const h2 = $section.find('h2').eq(1).text().trim();
    if (h2) return h2;
    
    const h3 = $section.find('h3').first().text().trim();
    if (h3) return h3;
    
    const subtitle = $section.find('.subtitle, .subheading, [class*="subtitle"]').first().text().trim();
    return subtitle || '';
  },
  
  extractButtonText($section) {
    const button = $section.find('button, .button, a.btn, [class*="button"]').first();
    return button.text().trim() || '';
  },
  
  extractButtonUrl($section) {
    const button = $section.find('a.button, a.btn, a[class*="button"]').first();
    return button.attr('href') || '';
  },
  
  extractImageUrl($section) {
    const img = $section.find('img').first();
    return img.attr('src') || img.attr('data-src') || '';
  },
  
  async createOrUpdateSection(strapi, sectionData) {
    try {
      // Check if section exists
      const existing = await strapi.db.query('api::page-section.page-section').findOne({
        where: {
          pageName: sectionData.pageName,
          sectionId: sectionData.sectionId,
        },
      });
      
      if (existing) {
        // Update existing
        await strapi.entityService.update('api::page-section.page-section', existing.id, {
          data: sectionData,
        });
      } else {
        // Create new
        await strapi.entityService.create('api::page-section.page-section', {
          data: {
            ...sectionData,
            publishedAt: new Date(), // Auto-publish imported content
          },
        });
      }
    } catch (error) {
      strapi.log.error(`Failed to import section ${sectionData.sectionId}: ${error.message}`);
    }
  },
};