'use strict';

/**
 * page-section router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::page-section.page-section', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
  },
});