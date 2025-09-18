const fs = require('fs');
const path = require('path');

// Update teacher profile links with correct IDs
function fixTeacherLinks() {
  console.log('🔧 Fixing teacher profile links...');

  const teachersFilePath = path.join(__dirname, 'teachers.html');
  let content = fs.readFileSync(teachersFilePath, 'utf8');

  console.log('📄 Read teachers.html file');

  // Define teacher patterns and their correct IDs
  const teacherUpdates = [
    // Mike Johnson - Teacher 2 (find course-categories image)
    {
      pattern: /href="detail_teacher\.html\?id=1"([^>]*Course-Categories-Content-Bg\.jpg)/g,
      replacement: 'href="detail_teacher.html?id=2"$1',
      teacher: 'Mike Johnson (image)'
    },
    // Mike Johnson - Teacher 2 (button link - find the one after Mike Johnson title)
    {
      pattern: /(Mike Johnson - Full-Stack Development Instructor<\/a>[\s\S]*?)<a href="detail_teacher\.html\?id=1" class="blog-card-link/,
      replacement: '$1<a href="detail_teacher.html?id=2" class="blog-card-link',
      teacher: 'Mike Johnson (button)'
    },
    // Emily Rodriguez - Teacher 3 (title)
    {
      pattern: /(Emily Rodriguez - Career Transition Coach<\/a>)/g,
      findBefore: /<a href="detail_teacher\.html\?id=1" class="blog-post-name">Emily Rodriguez - Career Transition Coach<\/a>/g,
      replacement: '<a href="detail_teacher.html?id=3" class="blog-post-name">Emily Rodriguez - Career Transition Coach</a>',
      teacher: 'Emily Rodriguez (title)'
    },
    // Emily Rodriguez - Teacher 3 (image - About-Me-Image.jpg)
    {
      pattern: /href="detail_teacher\.html\?id=1"([^>]*About-Me-Image\.jpg)/g,
      replacement: 'href="detail_teacher.html?id=3"$1',
      teacher: 'Emily Rodriguez (image)'
    },
    // David Park - Teacher 4 (title)
    {
      pattern: /<a href="detail_teacher\.html\?id=1" class="blog-post-name">David Park - Data Science Instructor<\/a>/g,
      replacement: '<a href="detail_teacher.html?id=4" class="blog-post-name">David Park - Data Science Instructor</a>',
      teacher: 'David Park (title)'
    },
    // David Park - Teacher 4 (image - About-Us-Image.png)
    {
      pattern: /href="detail_teacher\.html\?id=1"([^>]*About-Us-Image\.png)/g,
      replacement: 'href="detail_teacher.html?id=4"$1',
      teacher: 'David Park (image)'
    }
  ];

  // Apply updates systematically
  let updateCount = 0;

  // First, let's manually fix specific sections
  console.log('🎯 Applying targeted fixes...');

  // Emily Rodriguez title fix
  content = content.replace(
    /<a href="detail_teacher\.html\?id=1" class="blog-post-name">Emily Rodriguez - Career Transition Coach<\/a>/g,
    '<a href="detail_teacher.html?id=3" class="blog-post-name">Emily Rodriguez - Career Transition Coach</a>'
  );

  // David Park title fix
  content = content.replace(
    /<a href="detail_teacher\.html\?id=1" class="blog-post-name">David Park - Data Science Instructor<\/a>/g,
    '<a href="detail_teacher.html?id=4" class="blog-post-name">David Park - Data Science Instructor</a>'
  );

  // Image link fixes based on image paths
  content = content.replace(
    /href="detail_teacher\.html\?id=1"([^>]*Course-Categories-Content-Bg\.jpg)/g,
    'href="detail_teacher.html?id=2"$1'
  );

  content = content.replace(
    /href="detail_teacher\.html\?id=1"([^>]*About-Me-Image\.jpg)/g,
    'href="detail_teacher.html?id=3"$1'
  );

  content = content.replace(
    /href="detail_teacher\.html\?id=1"([^>]*About-Us-Image\.png)/g,
    'href="detail_teacher.html?id=4"$1'
  );

  // Fix remaining button links by position
  // Split content by teacher sections and fix button links
  const sections = content.split('<div role="listitem" class="main-blog-collection-list-item">');

  if (sections.length >= 5) { // Should have 1 part before + 4 teacher sections
    // Teacher 2 (Mike Johnson) - section index 2
    if (sections[2]) {
      sections[2] = sections[2].replace(
        /href="detail_teacher\.html\?id=1" class="blog-card-link w-inline-block"/g,
        'href="detail_teacher.html?id=2" class="blog-card-link w-inline-block"'
      );
    }

    // Teacher 3 (Emily Rodriguez) - section index 3
    if (sections[3]) {
      sections[3] = sections[3].replace(
        /href="detail_teacher\.html\?id=1" class="blog-card-link w-inline-block"/g,
        'href="detail_teacher.html?id=3" class="blog-card-link w-inline-block"'
      );
    }

    // Teacher 4 (David Park) - section index 4
    if (sections[4]) {
      sections[4] = sections[4].replace(
        /href="detail_teacher\.html\?id=1" class="blog-card-link w-inline-block"/g,
        'href="detail_teacher.html?id=4" class="blog-card-link w-inline-block"'
      );
    }

    content = sections.join('<div role="listitem" class="main-blog-collection-list-item">');
    console.log('✅ Applied section-based button link fixes');
  }

  // Write the updated content back to file
  fs.writeFileSync(teachersFilePath, content, 'utf8');

  console.log('✅ Teacher links have been fixed!');
  console.log('🎯 Links updated:');
  console.log('   - Sarah Chen: detail_teacher.html?id=1');
  console.log('   - Mike Johnson: detail_teacher.html?id=2');
  console.log('   - Emily Rodriguez: detail_teacher.html?id=3');
  console.log('   - David Park: detail_teacher.html?id=4');

  // Verify the changes
  const finalContent = fs.readFileSync(teachersFilePath, 'utf8');
  const id1Count = (finalContent.match(/detail_teacher\.html\?id=1/g) || []).length;
  const id2Count = (finalContent.match(/detail_teacher\.html\?id=2/g) || []).length;
  const id3Count = (finalContent.match(/detail_teacher\.html\?id=3/g) || []).length;
  const id4Count = (finalContent.match(/detail_teacher\.html\?id=4/g) || []).length;

  console.log('🔍 Verification:');
  console.log(`   - Teacher 1 links: ${id1Count} (should be 3)`);
  console.log(`   - Teacher 2 links: ${id2Count} (should be 3)`);
  console.log(`   - Teacher 3 links: ${id3Count} (should be 3)`);
  console.log(`   - Teacher 4 links: ${id4Count} (should be 3)`);
  console.log(`   - Total links: ${id1Count + id2Count + id3Count + id4Count} (should be 12)`);
}

fixTeacherLinks();