import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const START_URL = process.argv[2] || "https://teachmeskills.by";
const MAX_DEPTH = Number(process.argv[3] || 2);
const OUTPUT_DIR = "structure";

console.log(`🕷️ Starting simple crawl of ${START_URL} with max depth ${MAX_DEPTH}`);

async function simpleCrawl() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    const visited = new Set<string>();
    const siteStructure: any = {
      root: START_URL,
      pages: [],
      hierarchy: {}
    };
    
    async function crawlPage(url: string, depth: number) {
      if (depth > MAX_DEPTH || visited.has(url)) return;
      visited.add(url);
      
      console.log(`${' '.repeat(depth * 2)}→ Visiting: ${url}`);
      
      try {
        await page.goto(url, { 
          waitUntil: 'load',
          timeout: 30000 
        });
        
        await page.waitForTimeout(2000);
        
        // Extract basic page info
        const pageInfo = await page.evaluate(() => {
          const title = document.title || 'No title';
          const links: string[] = [];
          
          // Get all links
          document.querySelectorAll('a[href]').forEach(a => {
            const href = (a as HTMLAnchorElement).href;
            if (href && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
              links.push(href);
            }
          });
          
          // Detect sections safely
          const sections: string[] = [];
          
          // Check for common patterns
          if (document.querySelector('.hero, .banner, header')) sections.push('hero');
          if (document.querySelectorAll('[class*="course"], [class*="kurs"]').length > 2) sections.push('courses');
          if (document.querySelector('.testimonial, .review')) sections.push('testimonials');
          if (document.querySelector('.price, .pricing')) sections.push('pricing');
          if (document.querySelector('.faq, .questions')) sections.push('faq');
          if (document.querySelector('footer')) sections.push('footer');
          
          return { title, links, sections };
        });
        
        // Store page data
        siteStructure.pages.push({
          url,
          title: pageInfo.title,
          depth,
          sections: pageInfo.sections,
          linkCount: pageInfo.links.length
        });
        
        // Filter links to same domain
        const baseUrl = new URL(START_URL);
        const validLinks = pageInfo.links
          .filter(link => {
            try {
              const linkUrl = new URL(link);
              return linkUrl.hostname === baseUrl.hostname;
            } catch {
              return false;
            }
          })
          .slice(0, 10); // Limit to 10 links per page
        
        // Crawl child pages
        for (const link of validLinks) {
          await crawlPage(link, depth + 1);
        }
        
      } catch (error) {
        console.log(`${' '.repeat(depth * 2)}❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Start crawling
    await crawlPage(START_URL, 0);
    
    // Save results
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    const outputPath = path.join(OUTPUT_DIR, "simple-site-structure.json");
    await fs.writeFile(outputPath, JSON.stringify(siteStructure, null, 2));
    
    console.log(`\n✅ Crawl complete! Found ${siteStructure.pages.length} pages`);
    console.log(`📁 Results saved to: ${outputPath}`);
    
    // Print summary
    if (siteStructure.pages.length > 0) {
      console.log('\n📊 Page Summary:');
      siteStructure.pages.forEach((page: any) => {
        console.log(`${' '.repeat(page.depth * 2)}- ${page.title.substring(0, 50)}...`);
      });
    }
    
  } finally {
    await browser.close();
  }
}

simpleCrawl().catch(console.error);