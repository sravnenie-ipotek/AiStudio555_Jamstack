'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/page-sections/:id/approve',
      handler: 'page-section.approve',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/page-sections/bulk-translate',
      handler: 'page-section.bulkTranslate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};