import fs from "fs/promises";
import path from "path";
import { chromium, Page } from "playwright";

const START_URL = "https://teachmeskills.by";
const OUTPUT_DIR = "structure";

console.log(`🎯 Enhanced crawl of TeachMeSkills.by\n`);

interface SectionInfo {
  type: string;
  content?: string;
  count?: number;
  items?: string[];
}

interface PageStructure {
  url: string;
  title: string;
  sections: SectionInfo[];
  courses?: string[];
  navigation?: string[];
}

async function detectDetailedSections(page: Page): Promise<SectionInfo[]> {
  return await page.evaluate(() => {
    const sections: SectionInfo[] = [];
    const $ = (sel: string) => Array.from(document.querySelectorAll(sel));
    
    // Hero/Header section
    const heroText = document.querySelector('h1')?.textContent?.trim() || 
                     document.querySelector('.hero h2')?.textContent?.trim();
    if (heroText) {
      sections.push({
        type: 'hero_banner',
        content: heroText
      });
    }
    
    // Course cards/listings
    const courseElements = $('[class*="course"], [class*="kurs"], .card, .program-card');
    if (courseElements.length > 0) {
      const courseNames: string[] = [];
      courseElements.forEach((el: any) => {
        const title = el.querySelector('h3, h4, .title, .name')?.textContent?.trim();
        if (title) courseNames.push(title);
      });
      
      sections.push({
        type: 'course_grid',
        count: courseElements.length,
        items: courseNames.slice(0, 10) // First 10 courses
      });
    }
    
    // Features/Benefits
    const features = $('.feature, .benefit, [class*="advantage"]');
    if (features.length > 0) {
      sections.push({
        type: 'features',
        count: features.length
      });
    }
    
    // Statistics
    const stats = $('[class*="statistic"], [class*="number"], .counter');
    if (stats.length > 0) {
      sections.push({
        type: 'statistics',
        count: stats.length
      });
    }
    
    // Testimonials
    const testimonials = $('.testimonial, .review, [class*="feedback"]');
    if (testimonials.length > 0) {
      sections.push({
        type: 'testimonials',
        count: testimonials.length
      });
    }
    
    // Teachers/Mentors
    const teachers = $('.teacher, .mentor, [class*="instructor"]');
    if (teachers.length > 0) {
      sections.push({
        type: 'instructors',
        count: teachers.length
      });
    }
    
    // FAQ
    const faq = $('.faq, .question, .accordion');
    if (faq.length > 0) {
      sections.push({
        type: 'faq',
        count: faq.length
      });
    }
    
    // CTA buttons
    const ctaButtons = $('a.btn, button.btn, [class*="cta"], [class*="button"]').filter((el: any) => 
      /записаться|регистр|начать|подробнее|enroll|start|register/i.test(el.textContent || '')
    );
    if (ctaButtons.length > 0) {
      sections.push({
        type: 'cta_buttons',
        count: ctaButtons.length
      });
    }
    
    // Forms
    const forms = $('form');
    if (forms.length > 0) {
      sections.push({
        type: 'forms',
        count: forms.length
      });
    }
    
    // Footer
    if (document.querySelector('footer')) {
      sections.push({ type: 'footer' });
    }
    
    return sections;
  });
}

async function extractNavigation(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const navLinks: string[] = [];
    const navElements = document.querySelectorAll('nav a, header a, .menu a, .navbar a');
    navElements.forEach((a: any) => {
      const text = a.textContent?.trim();
      const href = a.getAttribute('href');
      if (text && href && !href.startsWith('#')) {
        navLinks.push(`${text} (${href})`);
      }
    });
    return navLinks;
  });
}

async function crawlMainPages() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    const results: Record<string, PageStructure> = {};
    
    // Define key pages to analyze
    const pagesToCrawl = [
      { url: START_URL, name: 'home' },
      { url: `${START_URL}/kursy`, name: 'courses' },
      { url: `${START_URL}/teachers`, name: 'teachers' },
      { url: `${START_URL}/blog`, name: 'blog' },
      { url: `${START_URL}/career-center`, name: 'career' },
      { url: `${START_URL}/proforientation`, name: 'orientation' }
    ];
    
    for (const pageInfo of pagesToCrawl) {
      console.log(`📄 Analyzing ${pageInfo.name} page...`);
      
      try {
        await page.goto(pageInfo.url, { 
          waitUntil: 'load',
          timeout: 30000 
        });
        
        await page.waitForTimeout(2000);
        
        const title = await page.title();
        const sections = await detectDetailedSections(page);
        const navigation = pageInfo.name === 'home' ? await extractNavigation(page) : [];
        
        results[pageInfo.name] = {
          url: pageInfo.url,
          title,
          sections,
          navigation: navigation.length > 0 ? navigation : undefined
        };
        
        console.log(`   ✓ Found ${sections.length} sections`);
        
      } catch (error) {
        console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }
    
    // Create output
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // 1. Site hierarchy
    const hierarchy = {
      root: START_URL,
      structure: {
        home: '/',
        courses: '/kursy',
        teachers: '/teachers', 
        blog: '/blog',
        career: '/career-center',
        orientation: '/proforientation'
      },
      navigation: results.home?.navigation || [],
      timestamp: new Date().toISOString()
    };
    
    // 2. Section templates for each page
    const templates = Object.entries(results).reduce((acc, [page, data]) => {
      acc[page] = {
        sections: data.sections.map(s => ({
          type: s.type,
          props: {
            count: s.count,
            hasItems: s.items ? true : false
          }
        }))
      };
      return acc;
    }, {} as any);
    
    // 3. Full detailed data
    const fullData = {
      site: 'TeachMeSkills.by',
      pages: results,
      summary: {
        totalPages: Object.keys(results).length,
        commonSections: findCommonSections(results),
        coursesFound: results.courses?.sections.find(s => s.type === 'course_grid')?.count || 0
      }
    };
    
    // Save files
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'hierarchy.json'),
      JSON.stringify(hierarchy, null, 2)
    );
    
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'page-templates.json'),
      JSON.stringify(templates, null, 2)
    );
    
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'full-analysis.json'),
      JSON.stringify(fullData, null, 2)
    );
    
    // Generate implementation guide
    const guide = generateImplementationGuide(results);
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'implementation-guide.md'),
      guide
    );
    
    console.log('\n✅ Analysis complete!\n');
    console.log('📁 Generated files:');
    console.log('   - structure/hierarchy.json');
    console.log('   - structure/page-templates.json');
    console.log('   - structure/full-analysis.json');
    console.log('   - structure/implementation-guide.md');
    
  } finally {
    await browser.close();
  }
}

function findCommonSections(results: Record<string, PageStructure>): string[] {
  const sectionCounts: Record<string, number> = {};
  
  Object.values(results).forEach(page => {
    page.sections.forEach(section => {
      sectionCounts[section.type] = (sectionCounts[section.type] || 0) + 1;
    });
  });
  
  return Object.entries(sectionCounts)
    .filter(([_, count]) => count >= 3)
    .map(([type]) => type);
}

function generateImplementationGuide(results: Record<string, PageStructure>): string {
  const home = results.home;
  const courses = results.courses;
  
  return `# TeachMeSkills.by Implementation Guide

## Site Structure

### Navigation Hierarchy
${home?.navigation?.map(nav => `- ${nav}`).join('\n') || 'Navigation not detected'}

## Key Pages to Implement

### 1. Homepage (/)
Sections to implement:
${home?.sections.map(s => `- ${s.type}${s.count ? ` (${s.count} items)` : ''}`).join('\n')}

### 2. Courses Page (/kursy)
Sections to implement:
${courses?.sections.map(s => `- ${s.type}${s.count ? ` (${s.count} items)` : ''}`).join('\n')}

## Implementation Steps

1. **Setup Routes**
   - / → home.html
   - /courses → courses.html  
   - /teachers → teachers.html
   - /blog → blog.html
   - /career → career.html

2. **Common Components**
   ${findCommonSections(results).map(s => `- ${s}`).join('\n   ')}

3. **Dynamic Content**
   - Course cards from Strapi
   - Teacher profiles from Strapi
   - Blog posts from Strapi

4. **Key Features**
   - Course filtering/search
   - Enrollment forms
   - Student testimonials
   - Career center resources

## Mapping to Your Templates

- TeachMeSkills /kursy → Your courses.html
- TeachMeSkills course cards → Your detail_courses.html template
- TeachMeSkills forms → Your authentication-pages/ templates

## Next Steps

1. Update your courses.html to match the section order found
2. Create career-center.html based on their structure
3. Add teacher listing page
4. Implement course filtering similar to their approach
`;
}

// Run the enhanced crawler
crawlMainPages().catch(console.error);