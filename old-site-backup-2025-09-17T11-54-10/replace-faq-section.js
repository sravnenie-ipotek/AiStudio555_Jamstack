const fs = require('fs');

// Read the courses.html file
const coursesHtml = fs.readFileSync('he/courses.html', 'utf8');

// Read the new FAQ design
const newFaqDesign = fs.readFileSync('new-faq-design.html', 'utf8');

// Find the start and end of the FAQ section
const startMarker = '    <section class="section faq">';
const endMarker = '    </section>\n\n    <!-- Graduate Companies Section -->';

const startIndex = coursesHtml.indexOf(startMarker);
const endIndex = coursesHtml.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('❌ Could not find FAQ section markers');
    process.exit(1);
}

// Replace the old FAQ section with the new design
const beforeFaq = coursesHtml.substring(0, startIndex);
const afterFaq = coursesHtml.substring(endIndex + '    </section>'.length);

// Combine with new FAQ design
const updatedHtml = beforeFaq + newFaqDesign + afterFaq;

// Write the updated HTML back to the file
fs.writeFileSync('he/courses.html', updatedHtml);

console.log('✅ Successfully replaced FAQ section with new modern design!');
console.log('\n📋 New FAQ Design Features:');
console.log('- Modern card-based layout with glassmorphism effects');
console.log('- Numbered FAQ items (01-06)');
console.log('- Gradient label badge for "שאלות נפוצות"');
console.log('- Smooth hover and click animations');
console.log('- Plus/minus toggle icons');
console.log('- Responsive grid layout');
console.log('- RTL support for Hebrew');
console.log('- All Hebrew content preserved');
console.log('\n🎨 The new design is completely different from the home page!');