'use strict';

/**
 * home-page router
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/home-page',
      handler: 'home-page.find',
      config: {
        description: 'Get home page content',
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/home-page',
      handler: 'home-page.update',
      config: {
        description: 'Update home page content',
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/home-page/section/:section',
      handler: 'home-page.findSection',
      config: {
        description: 'Get specific section of home page',
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/home-page/preview',
      handler: 'home-page.preview',
      config: {
        description: 'Get home page content in preview mode',
        policies: [],
        middlewares: [],
      },
    },
  ],
};