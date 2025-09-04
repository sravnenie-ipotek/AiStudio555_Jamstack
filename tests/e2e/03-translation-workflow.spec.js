// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Translation Workflow', () => {
  test('LibreTranslate service is accessible', async ({ request }) => {
    const response = await request.get('http://localhost:5000/languages');
    expect(response.ok()).toBeTruthy();
    
    const languages = await response.json();
    expect(Array.isArray(languages)).toBeTruthy();
    
    // Check if required languages are supported
    const languageCodes = languages.map(lang => lang.code);
    expect(languageCodes).toContain('en');
    expect(languageCodes).toContain('ru');
    expect(languageCodes).toContain('he');
  });
  
  test('Translation API works correctly', async ({ request }) => {
    const translationRequest = {
      q: 'Hello World',
      source: 'en',
      target: 'ru',
      format: 'text'
    };
    
    const response = await request.post('http://localhost:5000/translate', {
      data: translationRequest,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('translatedText');
    expect(data.translatedText).toBeTruthy();
    expect(data.translatedText).not.toBe('Hello World');
  });
  
  test('Hebrew RTL translation works', async ({ request }) => {
    const translationRequest = {
      q: 'Welcome to our website',
      source: 'en',
      target: 'he',
      format: 'text'
    };
    
    const response = await request.post('http://localhost:5000/translate', {
      data: translationRequest,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('translatedText');
    expect(data.translatedText).toBeTruthy();
    
    // Hebrew text should contain Hebrew characters
    expect(/[\u0590-\u05FF]/.test(data.translatedText)).toBeTruthy();
  });
  
  test('Bulk translation endpoint structure', async ({ request }) => {
    const bulkTranslateRequest = {
      ids: [1, 2, 3],
      targetLocale: 'ru'
    };
    
    const response = await request.post('/api/page-sections/bulk-translate', {
      data: bulkTranslateRequest,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Should return 401 without auth or 200 with results
    expect([200, 401, 403]).toContain(response.status());
  });
  
  test('Localized content retrieval', async ({ request }) => {
    // Test English content
    const enResponse = await request.get('/api/page-sections?locale=en');
    expect(enResponse.ok()).toBeTruthy();
    
    // Test Russian content
    const ruResponse = await request.get('/api/page-sections?locale=ru');
    expect(ruResponse.ok()).toBeTruthy();
    
    // Test Hebrew content
    const heResponse = await request.get('/api/page-sections?locale=he');
    expect(heResponse.ok()).toBeTruthy();
  });
});