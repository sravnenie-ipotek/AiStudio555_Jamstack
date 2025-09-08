#!/usr/bin/env node
/**
 * JAMstack Build Script - FREE GitHub Pages + Strapi Cloud
 * Builds 3 static sites (EN/RU/HE) with real Strapi Cloud URLs
 */

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');

// Production Strapi Cloud URLs (from .strapi-cloud.json)
// Note: Using HTTP temporarily until SSL certificate propagates
const STRAPI_URL = 'https://aistudio555-7dd54e37f0-sublime-basket-82bd4586b5.strapiapp.com';
const STRAPI_URL_FALLBACK = 'http://aistudio555-7dd54e37f0-sublime-basket-82bd4586b5.strapiapp.com';
const API_BASE = `${STRAPI_URL}/api`;

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
    console.log('\n🌐 Strapi Admin: https://aistudio555-7dd54e37f0-sublime-basket-82bd4586b5.strapiapp.com/admin');
    
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
  
  // Process HTML files - map home.html to index.html
  const htmlFiles = [
    { source: 'home.html', target: 'index.html' },
    { source: 'courses.html', target: 'courses.html' },
    { source: 'detail_courses.html', target: 'detail_courses.html' }
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
  
  // Update form action URLs to point to Strapi Cloud
  $('form[data-name="lead-form"], form[id*="lead"], form[action*="submit"]').each((i, form) => {
    $(form).attr('action', `${API_BASE}/leads`);
    $(form).attr('method', 'POST');
  });
  
  // Add language switcher
  addLanguageSwitcher($, langCode);
  
  // Add form submission handler
  addFormHandler($);
  
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
              let response = await fetch('${API_BASE}/leads', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              });
              
              // If HTTPS fails, try HTTP fallback
              if (!response.ok && response.status === 0) {
                console.log('HTTPS failed, trying HTTP fallback...');
                response = await fetch('${STRAPI_URL_FALLBACK}/api/leads', {
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