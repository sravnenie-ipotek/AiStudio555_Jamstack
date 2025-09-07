'use strict';

/**
 * page-section controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::page-section.page-section', ({ strapi }) => ({
  
  async find(ctx) {
    // Add custom logic for finding page sections
    const { query } = ctx;
    
    // Add default populate for relations
    if (!query.populate) {
      query.populate = ['screenshot', 'requestedBy', 'approvedBy', 'lockedBy'];
    }
    
    // Call the default find method
    const { data, meta } = await super.find(ctx);
    
    return { data, meta };
  },
  
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;
    
    // Add default populate for relations
    if (!query.populate) {
      query.populate = ['screenshot', 'requestedBy', 'approvedBy', 'lockedBy'];
    }
    
    // Call the default findOne method
    const response = await super.findOne(ctx);
    
    return response;
  },
  
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    
    // Check if section is locked by another user
    const existingSection = await strapi.entityService.findOne('api::page-section.page-section', id, {
      populate: ['lockedBy'],
    });
    
    if (existingSection?.lockedBy && existingSection.lockedBy.id !== ctx.state.user?.id) {
      return ctx.forbidden('This section is currently locked by another user');
    }
    
    // Lock the section for current user
    if (!data.lockedBy) {
      data.lockedBy = ctx.state.user?.id;
      data.lockedAt = new Date();
    }
    
    // Call the default update method
    const response = await super.update(ctx);
    
    // Release lock after successful update
    setTimeout(async () => {
      await strapi.entityService.update('api::page-section.page-section', id, {
        data: {
          lockedBy: null,
          lockedAt: null,
        },
      });
    }, 5000); // Release lock after 5 seconds
    
    return response;
  },
  
  async approve(ctx) {
    const { id } = ctx.params;
    
    // Check if user is SuperAdmin
    const userRoles = ctx.state.user?.roles || [];
    const isSuperAdmin = userRoles.some(role => role.name === 'SuperAdmin');
    
    if (!isSuperAdmin) {
      return ctx.forbidden('Only SuperAdmin can approve content');
    }
    
    // Approve the content
    const approvedSection = await strapi.entityService.update('api::page-section.page-section', id, {
      data: {
        pendingApproval: false,
        approvedBy: ctx.state.user.id,
        approvedAt: new Date(),
        publishedAt: new Date(),
      },
      populate: ['requestedBy', 'approvedBy'],
    });
    
    return { data: approvedSection };
  },
  
  async bulkTranslate(ctx) {
    const { ids, targetLocale } = ctx.request.body;
    
    if (!ids || !targetLocale) {
      return ctx.badRequest('Missing required parameters: ids and targetLocale');
    }
    
    const translationService = strapi.service('api::page-section.translation');
    const results = await translationService.bulkTranslate(ids, targetLocale);
    
    return { data: results, meta: { count: results.length } };
  },
}));