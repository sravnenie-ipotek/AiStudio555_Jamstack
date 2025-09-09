const fs = require('fs');
const path = require('path');

// List of main pages to fix
const pagesToFix = [
  'about-us.html',
  'blog.html',
  'career-orientation.html',
  'contact-us.html',
  'courses.html',
  'pricing.html',
  'teachers.html',
  'index.html',
  'home.html'
];

// CSS to add for hiding unwanted elements and fixing dropdown
const additionalCSS = `
    /* Hide unwanted elements */
    .w-commerce-commercecartwrapper,
    .navbar-cart,
    .pages-dropdown,
    .navbar-menu-button-cart-quantity,
    .navbar-menu-button-cart-wrapper {
      display: none !important;
    }
    
    /* Fix dropdown styling */
    .w-dropdown {
      position: relative;
    }
    
    .w-dropdown-list {
      position: absolute;
      top: 100%;
      left: 0;
      background: rgba(5, 5, 26, 0.98);
      border: 1px solid rgba(0, 128, 255, 0.2);
      border-radius: 12px;
      padding: 10px 0;
      min-width: 200px;
      z-index: 1000;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      margin-top: 10px;
    }
    
    .w-dropdown-list a {
      display: block;
      padding: 12px 20px;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .w-dropdown-list a:hover,
    .w-dropdown-list a.w--current {
      background: rgba(0, 128, 255, 0.1);
      color: #ffd659;
    }
    
    .dropdown-toggle-arrow-2 {
      margin-left: 5px;
      transition: transform 0.3s ease;
      font-size: 12px;
    }
    
    .w-dropdown.w--open .dropdown-toggle-arrow-2 {
      transform: rotate(180deg);
    }
  </style>`;

// JavaScript to add for dropdown functionality
const dropdownJS = `
  <script>
    // Fix Career Services dropdown
    document.addEventListener('DOMContentLoaded', function() {
      const dropdown = document.querySelector('.w-dropdown');
      const dropdownToggle = document.querySelector('.w-dropdown-toggle');
      const dropdownList = document.querySelector('.w-dropdown-list');
      
      if (dropdown && dropdownToggle && dropdownList) {
        // Add hover functionality
        dropdown.addEventListener('mouseenter', function() {
          dropdownList.style.display = 'block';
          dropdown.classList.add('w--open');
          dropdownToggle.classList.add('w--open');
        });
        
        dropdown.addEventListener('mouseleave', function() {
          dropdownList.style.display = 'none';
          dropdown.classList.remove('w--open');
          dropdownToggle.classList.remove('w--open');
        });
        
        // Add click functionality as backup
        dropdownToggle.addEventListener('click', function(e) {
          e.preventDefault();
          const isOpen = dropdownList.style.display === 'block';
          dropdownList.style.display = isOpen ? 'none' : 'block';
          dropdown.classList.toggle('w--open');
          dropdownToggle.classList.toggle('w--open');
        });
      }
    });
  </script>`;

function fixPage(filePath) {
  console.log(`Fixing ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // 1. Add CSS if not already present
  if (!content.includes('Hide unwanted elements')) {
    content = content.replace('</style>', additionalCSS);
    modified = true;
    console.log('  ✅ Added CSS for hiding unwanted elements');
  }
  
  // 2. Add dropdown JS if not already present
  if (!content.includes('Fix Career Services dropdown')) {
    // Add before closing body tag
    content = content.replace('</body>', dropdownJS + '\n</body>');
    modified = true;
    console.log('  ✅ Added dropdown JavaScript');
  }
  
  // 3. Fix dropdown arrow if needed
  if (content.includes('dropdown-toggle-arrow-2"></div>')) {
    content = content.replace(
      'dropdown-toggle-arrow-2"></div>',
      'dropdown-toggle-arrow-2">▼</div>'
    );
    modified = true;
    console.log('  ✅ Fixed dropdown arrow');
  }
  
  // 4. Fix webflow.js path
  if (content.includes('src="js/webflow.js"')) {
    // Already correct
  } else if (content.includes('src="../js/webflow.js"') || content.includes('src="./js/webflow.js"')) {
    content = content.replace(/src="[\.\/]*js\/webflow\.js"/g, 'src="js/webflow.js"');
    modified = true;
    console.log('  ✅ Fixed webflow.js path');
  }
  
  // 5. Remove Pages dropdown (if exists)
  const pagesRegex = /<div class="menu-dropdown-wrapper[^>]*>[\s\S]*?Pages[\s\S]*?<\/nav>\s*<\/div>/gi;
  if (pagesRegex.test(content)) {
    content = content.replace(pagesRegex, '');
    modified = true;
    console.log('  ✅ Removed Pages dropdown');
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ ${filePath} fixed successfully!\n`);
  } else {
    console.log(`  ℹ️  ${filePath} already up to date\n`);
  }
}

// Fix all pages
console.log('🔧 Starting to fix all pages...\n');
pagesToFix.forEach(page => {
  const filePath = path.join(__dirname, page);
  fixPage(filePath);
});

console.log('✅ All pages processed!');