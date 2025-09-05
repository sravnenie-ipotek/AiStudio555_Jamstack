'use strict';

/**
 * page-section controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::page-section.page-section', ({ strapi }) => ({
  
  // Auto-translate a section
  async translate(ctx) {
    const { id } = ctx.params;
    const translationService = strapi.service('api::page-section.translation');
    
    try {
      const section = await strapi.entityService.findOne('api::page-section.page-section', id);
      
      if (!section) {
        return ctx.notFound('Section not found');
      }
      
      const translations = await translationService.autoTranslateSection(section);
      
      return {
        data: {
          original: section,
          translations
        }
      };
    } catch (error) {
      return ctx.badRequest('Translation failed', { error: error.message });
    }
  },
  
  // Bulk translate all sections for a page
  async bulkTranslate(ctx) {
    const { pageName } = ctx.query;
    const translationService = strapi.service('api::page-section.translation');
    
    if (!pageName) {
      return ctx.badRequest('Page name is required');
    }
    
    try {
      const translatedSections = await translationService.bulkTranslatePage(pageName);
      
      return {
        data: translatedSections
      };
    } catch (error) {
      return ctx.badRequest('Bulk translation failed', { error: error.message });
    }
  },

  // Toggle section visibility
  async toggleVisibility(ctx) {
    const { id } = ctx.params;
    
    try {
      const section = await strapi.entityService.findOne('api::page-section.page-section', id);
      
      if (!section) {
        return ctx.notFound('Section not found');
      }
      
      const updatedSection = await strapi.entityService.update('api::page-section.page-section', id, {
        data: {
          isVisible: !section.isVisible
        }
      });
      
      return {
        data: updatedSection,
        message: `Section ${updatedSection.isVisible ? 'shown' : 'hidden'}`
      };
    } catch (error) {
      return ctx.badRequest('Toggle visibility failed', { error: error.message });
    }
  },

  // Sync frontend changes
  async syncFrontend(ctx) {
    try {
      // This would be called by the sync script
      const { sections } = ctx.request.body;
      
      if (!sections || !Array.isArray(sections)) {
        return ctx.badRequest('Sections array is required');
      }
      
      const results = [];
      
      for (const sectionData of sections) {
        try {
          // Check if section exists
          const existing = await strapi.entityService.findMany('api::page-section.page-section', {
            filters: { sectionId: sectionData.sectionId }
          });
          
          if (existing.length === 0) {
            // Create new section
            const newSection = await strapi.entityService.create('api::page-section.page-section', {
              data: {
                ...sectionData,
                heading: `New ${sectionData.sectionName}`,
                content: 'Content needed - please update',
                isVisible: true,
                metadata: {
                  autoCreated: true,
                  createdAt: new Date().toISOString(),
                  sourceFile: sectionData.sourceFile
                }
              }
            });
            
            results.push({ action: 'created', section: newSection });
          } else {
            // Update existing section
            const updated = await strapi.entityService.update('api::page-section.page-section', existing[0].id, {
              data: {
                order: sectionData.order,
                sectionName: sectionData.sectionName,
                metadata: {
                  ...existing[0].metadata,
                  lastSync: new Date().toISOString(),
                  sourceFile: sectionData.sourceFile
                }
              }
            });
            
            results.push({ action: 'updated', section: updated });
          }
        } catch (error) {
          results.push({ 
            action: 'error', 
            sectionId: sectionData.sectionId,
            error: error.message 
          });
        }
      }
      
      return {
        data: results,
        message: `Sync completed: ${results.length} sections processed`
      };
    } catch (error) {
      return ctx.badRequest('Frontend sync failed', { error: error.message });
    }
  },

  // Get sync status
  async getSyncStatus(ctx) {
    try {
      const sections = await strapi.entityService.findMany('api::page-section.page-section', {
        sort: { pageName: 'asc', order: 'asc' }
      });
      
      const syncStats = {
        total: sections.length,
        autoCreated: sections.filter(s => s.metadata?.autoCreated).length,
        lastSync: sections.reduce((latest, section) => {
          const syncTime = section.metadata?.lastSync;
          return syncTime && syncTime > latest ? syncTime : latest;
        }, null),
        byPage: {}
      };
      
      // Group by page
      sections.forEach(section => {
        if (!syncStats.byPage[section.pageName]) {
          syncStats.byPage[section.pageName] = [];
        }
        syncStats.byPage[section.pageName].push({
          sectionId: section.sectionId,
          sectionName: section.sectionName,
          isVisible: section.isVisible,
          autoCreated: section.metadata?.autoCreated || false,
          lastSync: section.metadata?.lastSync
        });
      });
      
      return {
        data: syncStats
      };
    } catch (error) {
      return ctx.badRequest('Failed to get sync status', { error: error.message });
    }
  }
}));