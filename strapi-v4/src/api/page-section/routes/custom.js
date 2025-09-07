'use strict';

/**
 * Custom translation routes for page-section
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/page-sections/:id/translate',
      handler: 'page-section.translate',
    },
    {
      method: 'GET', 
      path: '/page-sections/bulk-translate',
      handler: 'page-section.bulkTranslate',
    }
  ]
};