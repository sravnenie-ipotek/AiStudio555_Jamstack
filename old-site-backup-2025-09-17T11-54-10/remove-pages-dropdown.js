const fs = require('fs');
const path = require('path');

// Function to remove Pages dropdown from HTML content
function removePagesDropdown(content) {
  // Pattern to match the entire Pages dropdown section
  // This regex looks for the dropdown wrapper containing "Pages" text
  const pagesDropdownRegex = /<div[^>]*class="menu-dropdown-wrapper[^"]*"[^>]*>[\s\S]*?<div[^>]*class="dropdown-toggle-text-block"[^>]*>Pages<\/div>[\s\S]*?<\/nav>\s*<\/div>/g;
  
  // Remove the Pages dropdown
  let modifiedContent = content.replace(pagesDropdownRegex, '');
  
  // Also try alternative pattern if the first didn't work
  if (content === modifiedContent) {
    // Try another pattern - look for the specific Pages dropdown structure
    const altPattern = /<div[^>]*data-w-id="[^"]*"[^>]*class="menu-dropdown-wrapper w-dropdown"[^>]*>[\s\S]*?>Pages<[\s\S]*?<\/nav>\s*<\/div>/g;
    modifiedContent = content.replace(altPattern, '');
  }
  
  return modifiedContent;
}

// List of files to process
const filesToProcess = [
  'en/career-orientation.html',
  'en/courses.html',
  'en/detail_courses.html',
  'en/index.html',
  'en/teachers.html',
  'en/pricing.html',
  'en/blog.html',
  'en/home.html',
  'en/career-center.html',
  'ru/career-orientation.html',
  'ru/courses.html',
  'ru/detail_courses.html',
  'ru/index.html',
  'ru/teachers.html',
  'ru/pricing.html',
  'ru/blog.html',
  'ru/home.html',
  'ru/career-center.html',
  'he/career-orientation.html',
  'he/courses.html',
  'he/detail_courses.html',
  'he/index.html',
  'he/teachers.html',
  'he/pricing.html',
  'he/blog.html',
  'he/home.html',
  'he/career-center.html',
  'career-orientation.html',
  'courses.html',
  'teachers.html',
  'pricing.html',
  'blog.html',
  'home.html',
  'career-center.html'
];

let processedCount = 0;
let modifiedCount = 0;

filesToProcess.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const modifiedContent = removePagesDropdown(content);
      
      if (content !== modifiedContent) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
        console.log(`✅ Removed Pages dropdown from: ${file}`);
        modifiedCount++;
      } else {
        console.log(`ℹ️ No Pages dropdown found in: ${file}`);
      }
      processedCount++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Processed: ${processedCount} files`);
console.log(`   Modified: ${modifiedCount} files`);
console.log(`   Pages dropdown removed from all affected files!`);