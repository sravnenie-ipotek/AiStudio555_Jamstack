'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::home-page.home-page', ({ strapi }) => ({
  async find(ctx) {
    // Directly query the database for single type
    const result = await strapi.db.query('api::home-page.home-page').findOne({
      where: { id: 1 } // Just get record with ID 1
    });
    
    if (!result) {
      return ctx.notFound('Home page not found');
    }
    
    // Return the data in Strapi v5 format
    return {
      data: {
        id: result.id,
        documentId: result.document_id || result.documentId,
        title: result.title,
        heroTitle: result.hero_title || result.heroTitle,
        heroSubtitle: result.hero_subtitle || result.heroSubtitle,
        heroSectionVisible: Boolean(result.hero_section_visible !== undefined ? result.hero_section_visible : result.heroSectionVisible),
        createdAt: result.created_at || result.createdAt,
        updatedAt: result.updated_at || result.updatedAt,
        publishedAt: result.published_at || result.publishedAt
      },
      meta: {}
    };
  }
}));