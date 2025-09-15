// Simple test to debug Hebrew menu issue
const fs = require('fs');
const path = require('path');

console.log('Testing Hebrew menu integration...');

// Read the Hebrew courses file
const hebrewCoursesPath = path.join(__dirname, 'he', 'courses.html');
const content = fs.readFileSync(hebrewCoursesPath, 'utf8');

// Check if shared-menu-container exists
const hasMenuContainer = content.includes('id="shared-menu-container"');
console.log('Has menu container:', hasMenuContainer);

// Check if shared menu script is loaded
const hasSharedMenuScript = content.includes('shared-menu-component.js');
console.log('Has shared menu script:', hasSharedMenuScript);

// Check if there's any existing navbar
const hasExistingNavbar = content.includes('class="navbar"') || content.includes('class="w-nav"');
console.log('Has existing navbar:', hasExistingNavbar);

// Check script loading order
const scriptMatches = content.match(/<script[^>]*src="[^"]*"[^>]*>/g);
if (scriptMatches) {
    console.log('\nScript loading order:');
    scriptMatches.forEach((script, index) => {
        console.log(`${index + 1}. ${script}`);
    });
}