const axios = require('axios');

async function createHomePageContent() {
  const strapiUrl = 'http://localhost:1337';
  
  try {
    // Create the home page with visibility settings matching what you set in the admin
    const homePageData = {
      data: {
        // Visibility toggles - matching your screenshot
        heroSectionVisible: false,        // You toggled this OFF
        featuredCoursesVisible: false,    // You toggled this OFF  
        practiceFocusVisible: false,      // You toggled this OFF
        onlineLearningVisible: true,      // Keep visible
        alumniReviewsVisible: true,       // Keep visible
        faqSectionVisible: true,          // Keep visible
        
        // Section content (empty for now, you can add content later)
        heroSection: null,
        featuredCourses: null,
        practiceFocus: null,
        onlineLearning: null,
        alumniReviews: null,
        faqSection: null,
        
        // Publish immediately
        publishedAt: new Date().toISOString()
      }
    };

    // Create home page
    const response = await axios.post(
      `${strapiUrl}/api/home-page`,
      homePageData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Home page created successfully!');
    console.log('📊 Visibility settings:');
    console.log('   ❌ Hero Section: Hidden');
    console.log('   ❌ Featured Courses: Hidden');
    console.log('   ❌ Practice Focus: Hidden');
    console.log('   ✅ Online Learning: Visible');
    console.log('   ✅ Alumni Reviews: Visible');
    console.log('   ✅ FAQ Section: Visible');
    console.log('\n🎯 To test:');
    console.log('   1. Open http://localhost:8000/home.html');
    console.log('   2. Check browser console for visibility messages');
    console.log('   3. The hidden sections should not appear!');
    
    return response.data;
    
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error('❌ Permission denied. Please ensure public create permission is enabled for Home Page.');
    } else if (error.response && error.response.status === 400) {
      console.error('❌ Bad request. Home page might already exist.');
      console.log('💡 Trying to update existing home page...');
      
      // Try to update instead
      try {
        const updateResponse = await axios.put(
          `${strapiUrl}/api/home-page`,
          homePageData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✅ Home page updated successfully!');
        return updateResponse.data;
      } catch (updateError) {
        console.error('❌ Could not update:', updateError.response?.data || updateError.message);
      }
    } else {
      console.error('❌ Error creating home page:', error.response?.data || error.message);
    }
  }
}

// Run the script
createHomePageContent();