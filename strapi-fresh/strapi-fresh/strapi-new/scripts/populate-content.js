#!/usr/bin/env node

const fetch = require('node-fetch');

async function populateContent() {
  const strapiUrl = 'http://localhost:1337';
  
  // First, let's check if we can access Strapi
  try {
    // Try to update the single type content
    const response = await fetch(`${strapiUrl}/api/home-page`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          title: "AI Studio - Welcome to Learning Platform",
          heroTitle: "Unlock Potential With Proven Courses",
          heroSubtitle: "Expert-Led Learning Platform",
          heroSectionVisible: true
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Content updated successfully:', data);
    } else {
      console.log('❌ Failed to update content:', response.status, await response.text());
    }

    // Now test if we can GET the content
    const getResponse = await fetch(`${strapiUrl}/api/home-page`);
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ Content retrieved successfully:', data);
    } else {
      console.log('❌ Failed to retrieve content:', getResponse.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

populateContent();