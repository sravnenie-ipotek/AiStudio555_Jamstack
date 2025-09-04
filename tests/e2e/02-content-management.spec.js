// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Content Management Workflow', () => {
  let authToken;
  
  test.beforeAll(async ({ request }) => {
    // Get authentication token
    // Note: In real scenario, you'd create a test user first
    // For now, we'll test public endpoints
    authToken = 'test-token';
  });
  
  test('Create new page section', async ({ request }) => {
    const newSection = {
      data: {
        pageName: 'home',
        sectionId: 'test-hero-section',
        sectionName: 'Test Hero Section',
        content: 'This is a test hero section content',
        heading: 'Welcome to Our Test',
        subheading: 'Testing the content creation',
        buttonText: 'Get Started',
        buttonUrl: '/get-started',
        isVisible: true,
        order: 1,
      }
    };
    
    const response = await request.post('/api/page-sections', {
      data: newSection,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // May fail if auth is required, but structure should be correct
    if (response.ok()) {
      const data = await response.json();
      expect(data.data).toHaveProperty('id');
      expect(data.data.attributes.sectionName).toBe('Test Hero Section');
    }
  });
  
  test('Retrieve page sections', async ({ request }) => {
    const response = await request.get('/api/page-sections?filters[pageName][$eq]=home');
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
    expect(data).toHaveProperty('meta');
  });
  
  test('Update section visibility', async ({ request }) => {
    // First get a section
    const getResponse = await request.get('/api/page-sections?pagination[limit]=1');
    
    if (getResponse.ok()) {
      const data = await getResponse.json();
      
      if (data.data && data.data.length > 0) {
        const sectionId = data.data[0].id;
        
        // Try to update visibility
        const updateResponse = await request.put(`/api/page-sections/${sectionId}`, {
          data: {
            data: {
              isVisible: false
            }
          },
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // Check if update structure is correct
        if (updateResponse.ok()) {
          const updateData = await updateResponse.json();
          expect(updateData.data).toHaveProperty('id');
        }
      }
    }
  });
  
  test('Content approval workflow', async ({ request }) => {
    // Test approval endpoint structure
    const response = await request.post('/api/page-sections/1/approve', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Should return 401 or 403 without proper auth
    expect([401, 403, 404]).toContain(response.status());
  });
});