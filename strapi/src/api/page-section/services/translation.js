'use strict';

const axios = require('axios');

module.exports = {
  async translateText(text, fromLang, toLang) {
    if (!text) return '';
    
    const libreTranslateUrl = process.env.LIBRETRANSLATE_URL || 'http://libretranslate:5000';
    
    try {
      const response = await axios.post(`${libreTranslateUrl}/translate`, {
        q: text,
        source: fromLang || 'en',
        target: toLang,
        format: 'text',
      });
      
      return response.data.translatedText;
    } catch (error) {
      strapi.log.error(`Translation failed: ${error.message}`);
      return text; // Return original text if translation fails
    }
  },
  
  async translateSection(sectionId, targetLocale) {
    // Get the source section (English)
    const sourceSection = await strapi.entityService.findOne('api::page-section.page-section', sectionId, {
      locale: 'en',
    });
    
    if (!sourceSection) {
      throw new Error('Section not found');
    }
    
    // Map locale codes for LibreTranslate
    const localeMap = {
      'en': 'en',
      'ru': 'ru',
      'he': 'he',
    };
    
    const targetLang = localeMap[targetLocale] || targetLocale;
    
    // Translate fields
    const translatedData = {
      sectionName: await this.translateText(sourceSection.sectionName, 'en', targetLang),
      content: await this.translateText(sourceSection.content, 'en', targetLang),
      heading: await this.translateText(sourceSection.heading, 'en', targetLang),
      subheading: await this.translateText(sourceSection.subheading, 'en', targetLang),
      buttonText: await this.translateText(sourceSection.buttonText, 'en', targetLang),
      seoTitle: await this.translateText(sourceSection.seoTitle, 'en', targetLang),
      seoDescription: await this.translateText(sourceSection.seoDescription, 'en', targetLang),
    };
    
    // Create or update the translation
    const existingTranslation = await strapi.entityService.findMany('api::page-section.page-section', {
      filters: {
        sectionId: sourceSection.sectionId,
        pageName: sourceSection.pageName,
      },
      locale: targetLocale,
    });
    
    if (existingTranslation && existingTranslation.length > 0) {
      // Update existing translation
      return await strapi.entityService.update('api::page-section.page-section', existingTranslation[0].id, {
        data: translatedData,
        locale: targetLocale,
      });
    } else {
      // Create new translation
      return await strapi.entityService.create('api::page-section.page-section', {
        data: {
          ...sourceSection,
          ...translatedData,
          locale: targetLocale,
        },
      });
    }
  },
  
  async bulkTranslate(sectionIds, targetLocale) {
    const results = [];
    
    for (const sectionId of sectionIds) {
      try {
        const translated = await this.translateSection(sectionId, targetLocale);
        results.push({
          id: sectionId,
          status: 'success',
          translated,
        });
      } catch (error) {
        results.push({
          id: sectionId,
          status: 'error',
          error: error.message,
        });
      }
    }
    
    return results;
  },
  
  async translateAllPages(targetLocale) {
    // Get all English sections
    const englishSections = await strapi.entityService.findMany('api::page-section.page-section', {
      locale: 'en',
      limit: 1000,
    });
    
    const sectionIds = englishSections.map(section => section.id);
    
    return await this.bulkTranslate(sectionIds, targetLocale);
  },
};