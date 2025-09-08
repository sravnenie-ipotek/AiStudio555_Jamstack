import fs from "fs/promises";
import path from "path";
import { chromium, Browser, BrowserContext, Page } from "playwright";

type PageNode = {
  url: string;
  title: string;
  depth: number;
  links: string[];
  section_signature: string[];
  metadata?: {
    language?: string;
    pageType?: string;
    courseCount?: number;
  };
};

type SiteMap = {
  root: string;
  maxDepth: number;
  pages: PageNode[];
  edges: Array<[string, string]>;
  crawledAt: string;
};

type HomeLayout = {
  page: string;
  sections: Array<{
    type: string;
    props: Record<string, any>;
  }>;
};

// Configuration
const START_URL = process.argv[2] || "https://teachmeskills.by";
const MAX_DEPTH = Number(process.argv[3] ?? 2);
const OUTPUT_DIR = process.argv[4] || "structure";

console.log(`🕷️ Starting crawl of ${START_URL} with max depth ${MAX_DEPTH}`);

// Utility functions
const sameOrigin = (a: URL, b: URL) => a.origin === b.origin;
const normalize = (u: string) => {
  try {
    const url = new URL(u);
    // Remove fragment and trailing slashes
    return url.origin + url.pathname.replace(/\/+$/, "") + url.search;
  } catch {
    return u.split("#")[0].replace(/\/+$/, "");
  }
};

// Enhanced section detection for educational sites
async function detectSections(page: Page): Promise<string[]> {
  const result = await page.evaluate(() => {
    const sig: string[] = [];
    const $ = (sel: string) => Array.from(document.querySelectorAll(sel));
    
    // Helper to check for text content
    const hasText = (els: Element[], patterns: RegExp[]) => 
      els.some((el: any) => patterns.some(p => p.test(el.textContent || "")));
    
    // 1. Hero/Banner detection
    if ($("header, [role='banner'], .hero, .banner, .jumbotron, section:first-of-type").length) {
      sig.push("hero_banner");
    }
    
    // 2. Course-related sections (prioritized for educational sites)
    const courseSelectors = [
      "[class*='course']", "[class*='kurs']", "[id*='course']", 
      "[data-type='course']", ".courses", "[data-courses]",
      ".program", ".curriculum", "[class*='program']"
    ];
    if ($(courseSelectors.join(",")).length > 2) {
      sig.push("course_list");
    }
    
    // 3. Feature/Benefits grid
    const featureElements = $(".features, .benefits, [class*='advantage'], [class*='benefit'], .grid:has(.icon), .services");
    if (featureElements.length) {
      sig.push("features_grid");
    }
    
    // 4. Testimonials/Reviews
    if ($(".testimonials, .reviews, [class*='testimonial'], [class*='review'], .feedback, blockquote.cite").length) {
      sig.push("testimonials");
    }
    
    // 5. Teachers/Instructors
    if ($("[class*='teacher'], [class*='instructor'], [class*='mentor'], .team, .staff").length) {
      sig.push("instructors");
    }
    
    // 6. Statistics/Numbers
    if ($(".statistics, .stats, .numbers, [class*='counter'], [data-counter]").length) {
      sig.push("statistics");
    }
    
    // 7. Process/Steps
    if ($(".process, .steps, .timeline, .roadmap, [class*='step-']").length) {
      sig.push("process_steps");
    }
    
    // 8. Promo/Announcement banners
    if ($(".promo, .announcement, .alert, .notice, [class*='discount'], [class*='sale']").length) {
      sig.push("promo_banner");
    }
    
    // 9. Video content
    if ($("iframe[src*='youtube'], iframe[src*='vimeo'], video, .video-player, [class*='video']").length) {
      sig.push("video_content");
    }
    
    // 10. FAQ section
    if ($(".faq, .questions, [class*='faq'], [aria-controls*='faq'], details summary, .accordion").length) {
      sig.push("faq");
    }
    
    // 11. CTA sections
    const ctaElements = $("a,button");
    if (hasText(ctaElements, [
      /enroll|записаться|регистр/i,
      /start|начать|старт/i,
      /apply|подать|заявк/i,
      /join|присоед/i,
      /sign\s?up|запис/i
    ])) {
      sig.push("cta");
    }
    
    // 12. Pricing/Cost information
    if ($(".pricing, .price, .cost, [class*='price'], [class*='tarif'], table.pricing").length) {
      sig.push("pricing_table");
    }
    
    // 13. Partners/Logos
    if ($(".partners, .clients, .logos, [class*='partner'], [class*='client']").length) {
      sig.push("partners_logos");
    }
    
    // 14. Blog/News
    if ($(".blog, .news, .articles, [class*='blog'], [class*='article'], .posts").length) {
      sig.push("blog_preview");
    }
    
    // 15. Contact/Location
    if ($(".contact, .location, .address, [class*='contact'], .map, iframe[src*='maps']").length) {
      sig.push("contact_info");
    }
    
    // 16. Footer
    if ($("footer, [role='contentinfo'], .footer").length) {
      sig.push("footer");
    }
    
    // Fallback: Generic section detection
    if (sig.length < 3) {
      const mainSections = $("main section, main > div, .section, [class*='section']");
      mainSections.slice(0, 8).forEach((_, i) => {
        if (!sig.includes(`section_${i + 1}`)) {
          sig.push(`section_${i + 1}`);
        }
      });
    }
    
    return sig;
  });
  
  return result;
}

// Extract page metadata
async function extractMetadata(page: Page): Promise<PageNode['metadata']> {
  return await page.evaluate(() => {
    const metadata: any = {};
    
    // Detect language
    const lang = document.documentElement.lang || 
                 document.querySelector('meta[http-equiv="content-language"]')?.getAttribute('content') ||
                 'ru'; // Default to Russian for TeachMeSkills
    metadata.language = lang;
    
    // Detect page type
    const url = window.location.pathname;
    if (url === '/' || url === '') metadata.pageType = 'home';
    else if (url.includes('course') || url.includes('kurs')) metadata.pageType = 'course';
    else if (url.includes('blog')) metadata.pageType = 'blog';
    else if (url.includes('about')) metadata.pageType = 'about';
    else if (url.includes('contact')) metadata.pageType = 'contact';
    else metadata.pageType = 'other';
    
    // Count course elements if present
    const courseElements = document.querySelectorAll('[class*="course"], [class*="kurs"]');
    if (courseElements.length > 0) {
      metadata.courseCount = courseElements.length;
    }
    
    return metadata;
  });
}

// Main crawler function
async function crawl() {
  let browser: Browser | null = null;
  
  try {
    // Launch browser
    browser = await chromium.launch({
      headless: false, // Changed to false to debug issues
      timeout: 60000,
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'ru-RU'
    });
    
    const page = await context.newPage();
    
    // Setup request interception to skip unnecessary resources
    // Commented out for now as it might cause issues with some sites
    // await page.route('**/*', (route) => {
    //   const resourceType = route.request().resourceType();
    //   if (['image', 'media', 'font'].includes(resourceType)) {
    //     route.abort();
    //   } else {
    //     route.continue();
    //   }
    // });
    
    const root = new URL(START_URL);
    const queue: Array<{ url: string; depth: number }> = [
      { url: normalize(START_URL), depth: 0 }
    ];
    const seen = new Set<string>();
    const graph: Record<string, PageNode> = {};
    
    console.log(`📊 Starting crawl from ${root.origin}`);
    
    while (queue.length > 0) {
      const { url, depth } = queue.shift()!;
      
      if (seen.has(url) || depth > MAX_DEPTH) continue;
      seen.add(url);
      
      console.log(`  ${' '.repeat(depth * 2)}→ Crawling: ${url} (depth: ${depth})`);
      
      try {
        // Navigate to page
        await page.goto(url, { 
          waitUntil: 'domcontentloaded', // Changed from networkidle to domcontentloaded
          timeout: 60000 
        });
        
        // Wait for content to load
        await page.waitForTimeout(1500);
        
        // Try to handle cookie consent or popups
        const popupSelectors = [
          'button:has-text("Accept")',
          'button:has-text("Принять")',
          '[class*="cookie"] button',
          '[class*="popup"] .close',
          '[aria-label="Close"]'
        ];
        
        for (const selector of popupSelectors) {
          const elem = await page.$(selector);
          if (elem) {
            await elem.click().catch(() => {});
            await page.waitForTimeout(500);
          }
        }
        
        // Try to expand "Load more" buttons
        const loadMoreSelectors = [
          'button:has-text("Load more")',
          'button:has-text("Показать еще")',
          'button:has-text("More")',
          '[data-load-more]'
        ];
        
        for (const selector of loadMoreSelectors) {
          const elem = await page.$(selector);
          if (elem) {
            await elem.click().catch(() => {});
            await page.waitForTimeout(1000);
          }
        }
        
        // Extract title
        const title = await page.title();
        
        // Extract all links
        const links = await page.evaluate((origin) => {
          const anchors = Array.from(document.querySelectorAll('a[href]'));
          return Array.from(new Set(
            anchors
              .map(a => a.getAttribute('href') || '')
              .filter(href => {
                if (!href) return false;
                if (href.startsWith('mailto:')) return false;
                if (href.startsWith('tel:')) return false;
                if (href.startsWith('#')) return false;
                if (href.startsWith('javascript:')) return false;
                if (href.startsWith('whatsapp:')) return false;
                if (href.startsWith('viber:')) return false;
                if (href.startsWith('telegram:')) return false;
                return true;
              })
              .map(href => {
                try {
                  return new URL(href, origin).toString();
                } catch {
                  return null;
                }
              })
              .filter((url): url is string => url !== null)
          ));
        }, root.origin);
        
        // Filter links to same origin
        const sameOriginLinks = links
          .filter(link => {
            try {
              return sameOrigin(new URL(link), root);
            } catch {
              return false;
            }
          })
          .map(normalize);
        
        // Detect sections
        const section_signature = await detectSections(page);
        
        // Extract metadata
        const metadata = await extractMetadata(page);
        
        // Store page data
        graph[url] = {
          url,
          title,
          depth,
          links: sameOriginLinks,
          section_signature,
          metadata
        };
        
        // Prioritize important links for educational sites
        const prioritizedLinks = sameOriginLinks.sort((a, b) => {
          const getPriority = (u: string): number => {
            const lower = u.toLowerCase();
            if (lower.includes('course') || lower.includes('kurs')) return -3;
            if (lower.includes('program')) return -2;
            if (lower.includes('catalog') || lower.includes('katalog')) return -2;
            if (lower.includes('about') || lower.includes('teacher')) return -1;
            if (lower.includes('pricing') || lower.includes('price')) return -1;
            if (lower.includes('faq') || lower.includes('contact')) return 0;
            if (lower.includes('blog') || lower.includes('news')) return 1;
            return 2;
          };
          return getPriority(a) - getPriority(b);
        });
        
        // Add new links to queue
        for (const link of prioritizedLinks) {
          if (!seen.has(link) && depth < MAX_DEPTH) {
            queue.push({ url: link, depth: depth + 1 });
          }
        }
        
      } catch (error) {
        console.error(`  ❌ Error crawling ${url}:`, error instanceof Error ? error.message : error);
      }
    }
    
    console.log(`\n✅ Crawling complete! Found ${Object.keys(graph).length} pages\n`);
    
    // Build output artifacts
    const siteMap: SiteMap = {
      root: normalize(START_URL),
      maxDepth: MAX_DEPTH,
      pages: Object.values(graph),
      edges: Object.values(graph).flatMap(node => 
        node.links.map(link => [node.url, link] as [string, string])
      ),
      crawledAt: new Date().toISOString()
    };
    
    // Generate home layout from root page
    const homeUrl = normalize(START_URL);
    const homePage = graph[homeUrl];
    const homeLayout: HomeLayout = {
      page: "home",
      sections: (homePage?.section_signature ?? []).map(type => ({
        type,
        props: {
          originalUrl: homeUrl,
          language: homePage?.metadata?.language || 'ru'
        }
      }))
    };
    
    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Write output files
    const siteMapPath = path.join(OUTPUT_DIR, "site.map.json");
    const homeLayoutPath = path.join(OUTPUT_DIR, "home.layout.json");
    
    await fs.writeFile(siteMapPath, JSON.stringify(siteMap, null, 2));
    await fs.writeFile(homeLayoutPath, JSON.stringify(homeLayout, null, 2));
    
    // Generate summary report
    const summary = {
      totalPages: siteMap.pages.length,
      pageTypes: {} as Record<string, number>,
      sectionTypes: {} as Record<string, number>,
      maxDepthReached: Math.max(...siteMap.pages.map(p => p.depth)),
      languages: Array.from(new Set(siteMap.pages.map(p => p.metadata?.language).filter(Boolean)))
    };
    
    // Count page types
    siteMap.pages.forEach(page => {
      const type = page.metadata?.pageType || 'unknown';
      summary.pageTypes[type] = (summary.pageTypes[type] || 0) + 1;
    });
    
    // Count section types
    siteMap.pages.forEach(page => {
      page.section_signature.forEach(section => {
        summary.sectionTypes[section] = (summary.sectionTypes[section] || 0) + 1;
      });
    });
    
    const summaryPath = path.join(OUTPUT_DIR, "crawl.summary.json");
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log(`📁 Output files created:`);
    console.log(`   - ${siteMapPath}`);
    console.log(`   - ${homeLayoutPath}`);
    console.log(`   - ${summaryPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Total pages: ${summary.totalPages}`);
    console.log(`   - Max depth: ${summary.maxDepthReached}`);
    console.log(`   - Languages: ${summary.languages.join(', ')}`);
    console.log(`   - Page types:`, summary.pageTypes);
    console.log(`   - Top sections:`, Object.entries(summary.sectionTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => `${type} (${count})`)
      .join(', '));
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run crawler
crawl().catch(console.error);