const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const axios = require('axios');

// Configuration
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://aistudio555jamstack-production.up.railway.app'
  : 'http://localhost:3000';

const TEACHERS_HTML_PATH = path.join(__dirname, '..', 'teachers.html');

// Extract teachers from HTML
function extractTeachersFromHTML() {
  const html = fs.readFileSync(TEACHERS_HTML_PATH, 'utf8');
  const $ = cheerio.load(html);
  const teachers = [];
  
  // Find all instructor cards (using the enhanced class)
  $('.instructor-card-enhanced').each((index, element) => {
    const card = $(element);
    
    // Extract category
    const category = card.attr('data-category') || '';
    const categoryBadge = card.find('.instructor-category-badge').text().trim();
    
    // Extract specialties/tags
    const specialties = [];
    card.find('.specialty-tag').each((i, tag) => {
      specialties.push($(tag).text().trim());
    });
    
    // Extract image URL
    let imageUrl = card.find('.instructor-avatar-enhanced img').attr('src') || '';
    if (!imageUrl) {
      imageUrl = card.find('img').first().attr('src') || '';
    }
    
    const teacher = {
      name: card.find('.instructor-name').text().trim(),
      title: card.find('.instructor-title').text().trim(),
      role: card.find('.instructor-title').text().trim(), // Use title as role
      experience: card.find('.instructor-experience').text().trim(),
      bio: card.find('.instructor-bio').text().trim(),
      specialties: specialties,
      category: category || categoryBadge,
      image: imageUrl,
      order: index + 1,
      // Extract company from title if possible
      company: extractCompany(card.find('.instructor-title').text().trim()),
      // Social links (placeholders for now)
      linkedin: '',
      twitter: '',
      github: ''
    };
    
    if (teacher.name) {
      teachers.push(teacher);
    }
  });
  
  console.log(`📚 Found ${teachers.length} teachers in HTML`);
  return teachers;
}

// Extract company name from title
function extractCompany(title) {
  const match = title.match(/at\s+(.+)$/i);
  return match ? match[1] : '';
}

// Get existing teachers from database
async function getExistingTeachers() {
  try {
    const response = await axios.get(`${API_URL}/api/teachers`);
    return response.data.data || [];
  } catch (error) {
    console.error('❌ Error fetching existing teachers:', error.message);
    return [];
  }
}

// Update or create teacher in database
async function upsertTeacher(teacher) {
  try {
    // Check if teacher exists by name
    const existingTeachers = await getExistingTeachers();
    const existing = existingTeachers.find(t => 
      t.attributes.name.toLowerCase() === teacher.name.toLowerCase()
    );
    
    const teacherData = {
      data: {
        name: teacher.name,
        role: teacher.role || teacher.title,
        bio: teacher.bio,
        experience: teacher.experience,
        company: teacher.company,
        specialties: teacher.specialties.join(', '),
        image: teacher.image,
        linkedin: teacher.linkedin || `https://linkedin.com/in/${teacher.name.toLowerCase().replace(/\s+/g, '-')}`,
        twitter: teacher.twitter || `https://twitter.com/${teacher.name.toLowerCase().replace(/\s+/g, '')}`,
        github: teacher.github || `https://github.com/${teacher.name.toLowerCase().replace(/\s+/g, '')}`,
        order: teacher.order
      }
    };
    
    if (existing) {
      // Update existing teacher
      const response = await axios.put(
        `${API_URL}/api/teachers/${existing.id}`,
        teacherData
      );
      console.log(`✅ Updated: ${teacher.name}`);
      return response.data;
    } else {
      // Create new teacher
      const response = await axios.post(
        `${API_URL}/api/teachers`,
        teacherData
      );
      console.log(`✅ Created: ${teacher.name}`);
      return response.data;
    }
  } catch (error) {
    console.error(`❌ Error upserting teacher ${teacher.name}:`, error.message);
    return null;
  }
}

// Main migration function
async function migrateTeachers() {
  console.log('🚀 Starting Teachers Migration');
  console.log(`📍 API URL: ${API_URL}`);
  console.log('=====================================\n');
  
  // Extract teachers from HTML
  const teachers = extractTeachersFromHTML();
  
  if (teachers.length === 0) {
    console.log('⚠️  No teachers found in HTML');
    return;
  }
  
  // Get existing teachers
  const existingTeachers = await getExistingTeachers();
  console.log(`📊 Existing teachers in database: ${existingTeachers.length}`);
  
  // Display teacher names found
  console.log('\n📝 Teachers to migrate:');
  teachers.forEach((teacher, index) => {
    console.log(`   ${index + 1}. ${teacher.name} - ${teacher.title}`);
  });
  
  // Migrate each teacher
  console.log('\n🔄 Starting migration...\n');
  let successCount = 0;
  let failureCount = 0;
  
  for (const teacher of teachers) {
    const result = await upsertTeacher(teacher);
    if (result) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n=====================================');
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Success: ${successCount} teachers`);
  console.log(`   ❌ Failed: ${failureCount} teachers`);
  console.log(`   📚 Total: ${teachers.length} teachers`);
  console.log('=====================================');
  
  // Verify migration
  const finalTeachers = await getExistingTeachers();
  console.log(`\n✅ Final count in database: ${finalTeachers.length} teachers`);
  
  // Save migration report
  const report = {
    timestamp: new Date().toISOString(),
    source: 'teachers.html',
    target: API_URL,
    totalTeachers: teachers.length,
    successCount,
    failureCount,
    teachers: teachers.map(t => ({
      name: t.name,
      title: t.title,
      company: t.company
    }))
  };
  
  const reportPath = path.join(__dirname, '..', 'teachers-migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Migration report saved to: ${reportPath}`);
}

// Run migration
if (require.main === module) {
  migrateTeachers()
    .then(() => {
      console.log('\n✅ Migration completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { extractTeachersFromHTML, migrateTeachers };