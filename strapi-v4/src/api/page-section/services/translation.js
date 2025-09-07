'use strict';

const axios = require('axios');

module.exports = {
  /**
   * Translate text using LibreTranslate
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code (ru, he)
   * @param {string} sourceLang - Source language code (default: en)
   */
  async translateText(text, targetLang, sourceLang = 'en') {
    try {
      const response = await axios.post('http://localhost:5001/translate', {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      });
      
      return response.data.translatedText;
    } catch (error) {
      console.error('Translation error:', error.message);
      return text; // Return original text if translation fails
    }
  },

  /**
   * Auto-translate page section to Russian and Hebrew
   * @param {object} data - Page section data
   */
  async autoTranslateSection(data) {
    const translatableFields = ['sectionName', 'heading', 'subheading', 'buttonText', 'content', 'seoTitle', 'seoDescription'];
    const translations = {
      ru: {},
      he: {}
    };

    for (const field of translatableFields) {
      if (data[field]) {
        // Translate to Russian
        translations.ru[field] = await this.translateText(data[field], 'ru');
        
        // Translate to Hebrew
        translations.he[field] = await this.translateText(data[field], 'he');
      }
    }

    return translations;
  },

  /**
   * Bulk translate all sections for a page
   * @param {string} pageName - Name of the page
   */
  async bulkTranslatePage(pageName) {
    const sections = await strapi.entityService.findMany('api::page-section.page-section', {
      filters: { pageName },
      sort: { order: 'asc' }
    });

    const translatedSections = [];
    
    for (const section of sections) {
      const translations = await this.autoTranslateSection(section);
      translatedSections.push({
        original: section,
        translations
      });
    }

    return translatedSections;
  }
};