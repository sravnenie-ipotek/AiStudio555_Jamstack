const fs = require('fs');
const path = require('path');

// Fix script paths in Hebrew HTML files
const hebrewFiles = [
  'he/home.html',
  'he/index.html',
  'he/courses.html',
  'he/teachers.html',
  'he/pricing.html',
  'he/career-center.html',
  'he/career-orientation.html',
  'he/blog.html'
];

hebrewFiles.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix script paths - change ../js/ to /js/
    content = content.replace(/src="\.\.\/js\//g, 'src="/js/');

    // Fix CSS paths if needed - change ../css/ to /css/
    content = content.replace(/href="\.\.\/css\//g, 'href="/css/');

    // Fix image paths if needed - change ../images/ to /images/
    content = content.replace(/src="\.\.\/images\//g, 'src="/images/');

    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed paths in ${file}`);
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
});

console.log('✅ All Hebrew file paths fixed!');