#!/usr/bin/env node
/**
 * JAMstack Build Script - FREE GitHub Pages + Strapi Cloud
 * Builds 3 static sites (EN/RU/HE) with real Strapi Cloud URLs
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');

// Production Custom API URLs (Railway deployment)
const CUSTOM_API_URL = 'https://aistudio555jamstack-production.up.railway.app';
const CUSTOM_API_LOCAL = 'http://localhost:3000';
const API_BASE = `${CUSTOM_API_URL}/api`;

// Languages configuration
const LANGUAGES = {
  'en': { name: 'English', dir: 'ltr', locale: 'en' },
  'ru': { name: 'Russian', dir: 'ltr', locale: 'ru' },
  'he': { name: 'Hebrew', dir: 'rtl', locale: 'he' }
};

// Output directories
const DIST_DIR = 'dist';
const BACKUP_DIR = 'backup';

console.log('🚀 Building JAMstack Sites with Strapi Cloud...\n');

async function main() {
  try {
    // Create output directories
    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);
    
    // Build each language site
    for (const [langCode, langConfig] of Object.entries(LANGUAGES)) {
      console.log(`📄 Building ${langConfig.name} site...`);
      await buildLanguageSite(langCode, langConfig);
    }
    
    // Create root index.html (redirects to /en/)
    createRootRedirect();
    
    console.log('\n✅ JAMstack build complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Test locally: python3 -m http.server 8000 --directory dist');
    console.log('   2. Visit: http://localhost:8000');
    console.log('   3. Push to GitHub for Pages deployment');
    console.log('\n🌐 Custom API Admin: https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

async function buildLanguageSite(langCode, langConfig) {
  const langDir = path.join(DIST_DIR, langCode);
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir);
  
  // Copy static assets
  copyDirectory('css', path.join(langDir, 'css'));
  copyDirectory('js', path.join(langDir, 'js'));
  copyDirectory('images', path.join(langDir, 'images'));
  copyDirectory('fonts', path.join(langDir, 'fonts'));
  
  // Process HTML files - map home.html to index.html
  const htmlFiles = [
    { source: 'home.html', target: 'index.html' },
    { source: 'courses.html', target: 'courses.html' },
    { source: 'detail_courses.html', target: 'detail_courses.html' },
    { source: 'career-orientation.html', target: 'career-orientation.html' },
    { source: 'career-center.html', target: 'career-center.html' }
  ];
  
  for (const fileMap of htmlFiles) {
    if (fs.existsSync(fileMap.source)) {
      await processHtmlFile(fileMap.source, langCode, langConfig, langDir, fileMap.target);
    }
  }
  
  // Copy authentication pages
  if (fs.existsSync('authentication-pages')) {
    copyDirectory('authentication-pages', path.join(langDir, 'authentication-pages'));
  }
  
  console.log(`   ✅ ${langConfig.name} site built in /${langCode}/`);
}

async function processHtmlFile(filename, langCode, langConfig, outputDir, targetName = filename) {
  const html = fs.readFileSync(filename, 'utf8');
  const $ = cheerio.load(html);
  
  // Set language attributes
  $('html').attr('lang', langCode);
  $('html').attr('dir', langConfig.dir);
  
  // Update page title and meta tags
  if (langCode === 'ru') {
    $('title').text($('title').text().replace(/AI Studio/g, 'AI Студия'));
    $('meta[name="description"]').attr('content', 
      $('meta[name="description"]').attr('content')?.replace(/AI Studio/g, 'AI Студия') || '');
  } else if (langCode === 'he') {
    $('title').text($('title').text().replace(/AI Studio/g, 'סטודיו AI'));
    $('meta[name="description"]').attr('content', 
      $('meta[name="description"]').attr('content')?.replace(/AI Studio/g, 'סטודיו AI') || '');
  }
  
  // Update form action URLs to point to Custom API
  $('form[data-name="lead-form"], form[id*="lead"], form[action*="submit"]').each((i, form) => {
    $(form).attr('action', `${API_BASE}/nd/leads`);
    $(form).attr('method', 'POST');
  });
  
  // Add language switcher
  addLanguageSwitcher($, langCode);
  
  // Add form submission handler
  addFormHandler($);
  
  // Add language-specific database integration scripts
  if (langCode === 'he') {
    addHebrewIntegration($, filename);
  }
  
  // Update navigation links for multi-language
  updateNavigationLinks($, langCode);
  
  // Save processed HTML with target filename
  const outputPath = path.join(outputDir, targetName);
  fs.writeFileSync(outputPath, $.html());
}

function addLanguageSwitcher($, currentLang) {
  const languageOptions = Object.entries(LANGUAGES).map(([code, config]) => {
    const isActive = code === currentLang;
    return `<option value="${code}" ${isActive ? 'selected' : ''}>${config.name}</option>`;
  }).join('');
  
  const switcher = `
    <div class="language-switcher" style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
      <select onchange="switchLanguage(this.value)" style="padding: 8px; border-radius: 4px;">
        ${languageOptions}
      </select>
    </div>
    <script>
      function switchLanguage(lang) {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(p => p);
        
        // Remove current language from path
        if (['en', 'ru', 'he'].includes(pathParts[0])) {
          pathParts.shift();
        }
        
        // Navigate to new language
        const newPath = '/' + lang + '/' + pathParts.join('/');
        window.location.href = newPath;
      }
    </script>
  `;
  
  $('body').prepend(switcher);
}

function addFormHandler($) {
  const formScript = `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        // Handle all lead forms
        const forms = document.querySelectorAll('form[data-name="lead-form"], form[id*="lead"], form[action*="leads"]');
        
        forms.forEach(form => {
          form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
              data: {
                name: formData.get('name') || formData.get('Name'),
                email: formData.get('email') || formData.get('Email'),
                phone: formData.get('phone') || formData.get('Phone'),
                message: formData.get('message') || formData.get('Message'),
                language: document.documentElement.lang,
                source: window.location.pathname
              }
            };
            
            try {
              // Try HTTPS first, fallback to HTTP if SSL issues
              let response = await fetch('${API_BASE}/nd/leads', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });
              
              // If HTTPS fails, try local fallback
              if (!response.ok && response.status === 0) {
                console.log('HTTPS failed, trying local fallback...');
                response = await fetch('${CUSTOM_API_LOCAL}/api/nd/leads', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
                });
              }
              
              if (response.ok) {
                // Show success message
                alert('Thank you! We will contact you soon.');
                form.reset();
                
                // Optional: redirect to thank you page
                // window.location.href = '/thank-you.html';
              } else {
                throw new Error('Submission failed');
              }
            } catch (error) {
              console.error('Form submission error:', error);
              alert('Sorry, there was an error. Please try again or contact us directly.');
            }
          });
        });
      });
    </script>
  `;
  
  $('body').append(formScript);
}

function updateNavigationLinks($, langCode) {
  // Update internal links to include language prefix
  $('a[href^="/"], a[href^="./"], a[href^="../"]').each((i, link) => {
    const href = $(link).attr('href');
    if (href && !href.startsWith(`/${langCode}/`) && href !== '/') {
      const newHref = href.startsWith('/') ? `/${langCode}${href}` : `/${langCode}/${href}`;
      $(link).attr('href', newHref);
    }
  });
}

function addHebrewIntegration($, filename) {
  // Only add Hebrew integration for career pages
  if (filename.includes('career-orientation.html')) {
    const hebrewScript = `
      <!-- Hebrew Database Integration Script -->
      <script>
        (async function loadHebrewCareerOrientationContent() {
          console.log('Loading Hebrew Career Orientation content...');
          
          const API_BASE = '${API_BASE}';
          
          try {
            const response = await fetch(\`\${API_BASE}/nd/career-orientation-page?locale=he\`);
            console.log('Hebrew API response status:', response.status);
            
            if (!response.ok) {
              throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            
            const data = await response.json();
            console.log('Hebrew Career Orientation data received:', data);
            
            if (data && data.data && data.data.attributes) {
              const content = data.data.attributes;
              updateCareerOrientationContent(content);
            } else {
              console.log('Hebrew content structure not as expected:', data);
            }
          } catch (error) {
            console.error('Error loading Hebrew career orientation content:', error);
          }
          
          function updateCareerOrientationContent(content) {
            console.log('Updating Hebrew Career Orientation content...');
            
            // Update main hero title - multiple selectors for robustness
            const heroTitle = document.querySelector('.section-title.featured-courses, .hero-heading, h1, .career-orientation-title');
            if (heroTitle && content.title) {
              console.log('Updating hero title to:', content.title);
              heroTitle.textContent = content.title;
            }
            
            // Update hero subtitle
            const heroSubtitle = document.querySelector('.section-subtitle, .hero-subtitle, .subtitle');
            if (heroSubtitle && content.subtitle) {
              console.log('Updating hero subtitle to:', content.subtitle);
              heroSubtitle.textContent = content.subtitle;
            }
            
            // Update hero description
            const heroDesc = document.querySelector('.section-description-text.featured-courses, .hero-description, .description, .career-orientation-description');
            if (heroDesc && content.description) {
              console.log('Updating hero description to:', content.description);
              heroDesc.innerHTML = content.description;
            }
            
            // Update services if available
            if (content.services && Array.isArray(content.services)) {
              console.log('Updating services section...');
              content.services.forEach((service, index) => {
                const serviceTitle = document.querySelector(\`.service-item:nth-child(\${index + 1}) .service-title, .feature-item:nth-child(\${index + 1}) .feature-title\`);
                const serviceDesc = document.querySelector(\`.service-item:nth-child(\${index + 1}) .service-description, .feature-item:nth-child(\${index + 1}) .feature-description\`);
                
                if (serviceTitle && service.title) {
                  serviceTitle.textContent = service.title;
                }
                if (serviceDesc && service.description) {
                  serviceDesc.textContent = service.description;
                }
              });
            }
            
            console.log('Hebrew Career Orientation content update completed');
          }
        })();
      </script>
    `;
    $('body').append(hebrewScript);
  } else if (filename.includes('career-center.html')) {
    const hebrewScript = `
      <!-- Hebrew Database Integration Script -->
      <script>
        (async function loadHebrewCareerCenterContent() {
          console.log('Loading Hebrew Career Center content...');
          
          const API_BASE = '${API_BASE}';
          
          try {
            const response = await fetch(\`\${API_BASE}/nd/career-center-page?locale=he\`);
            console.log('Hebrew API response status:', response.status);
            
            if (!response.ok) {
              throw new Error(\`HTTP error! status: \${response.status}\`);
            }
            
            const data = await response.json();
            console.log('Hebrew Career Center data received:', data);
            
            if (data && data.data && data.data.attributes) {
              const content = data.data.attributes;
              updateCareerCenterContent(content);
            } else {
              console.log('Hebrew content structure not as expected:', data);
            }
          } catch (error) {
            console.error('Error loading Hebrew career center content:', error);
          }
          
          function updateCareerCenterContent(content) {
            console.log('Updating Hebrew Career Center content...');
            
            // Update main hero title - multiple selectors for robustness
            const heroTitle = document.querySelector('.section-title.featured-courses, .hero-heading, h1, .career-hero-title');
            if (heroTitle && content.title) {
              console.log('Updating hero title to:', content.title);
              heroTitle.textContent = content.title;
            }
            
            // Update hero subtitle
            const heroSubtitle = document.querySelector('.section-subtitle, .hero-subtitle, .subtitle');
            if (heroSubtitle && content.subtitle) {
              console.log('Updating hero subtitle to:', content.subtitle);
              heroSubtitle.textContent = content.subtitle;
            }
            
            // Update hero description
            const heroDesc = document.querySelector('.section-description-text.featured-courses, .hero-description, .description, .career-hero-description');
            if (heroDesc && content.description) {
              console.log('Updating hero description to:', content.description);
              heroDesc.innerHTML = content.description;
            }
            
            // Update stats if available
            if (content.stats && Array.isArray(content.stats)) {
              console.log('Updating stats section...');
              content.stats.forEach((stat, index) => {
                const statValue = document.querySelector(\`.stat-item:nth-child(\${index + 1}) .stat-value, .metric-item:nth-child(\${index + 1}) .metric-value\`);
                const statLabel = document.querySelector(\`.stat-item:nth-child(\${index + 1}) .stat-label, .metric-item:nth-child(\${index + 1}) .metric-label\`);
                
                if (statValue && stat.value) {
                  statValue.textContent = stat.value;
                }
                if (statLabel && stat.label) {
                  statLabel.textContent = stat.label;
                }
              });
            }
            
            // Update services if available
            if (content.services && Array.isArray(content.services)) {
              console.log('Updating services section...');
              content.services.forEach((service, index) => {
                const serviceTitle = document.querySelector(\`.service-item:nth-child(\${index + 1}) .service-title, .feature-item:nth-child(\${index + 1}) .feature-title\`);
                const serviceDesc = document.querySelector(\`.service-item:nth-child(\${index + 1}) .service-description, .feature-item:nth-child(\${index + 1}) .feature-description\`);
                
                if (serviceTitle && service.title) {
                  serviceTitle.textContent = service.title;
                }
                if (serviceDesc && service.description) {
                  serviceDesc.textContent = service.description;
                }
              });
            }
            
            console.log('Hebrew Career Center content update completed');
          }
        })();
      </script>
    `;
    $('body').append(hebrewScript);
  }
}

function createRootRedirect() {
  const redirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AI Studio - Redirecting...</title>
  <script>
    // Detect browser language and redirect
    const userLang = navigator.language.slice(0, 2);
    const supportedLangs = ['en', 'ru', 'he'];
    const defaultLang = 'en';
    
    const redirectLang = supportedLangs.includes(userLang) ? userLang : defaultLang;
    window.location.replace('/' + redirectLang + '/');
  </script>
  <noscript>
    <meta http-equiv="refresh" content="0; url=/en/">
  </noscript>
</head>
<body>
  <p>Redirecting to <a href="/en/">AI Studio</a>...</p>
</body>
</html>`;
  
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), redirectHtml);
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Run the build
if (require.main === module) {
  main();
}

module.exports = { buildLanguageSite, processHtmlFile };