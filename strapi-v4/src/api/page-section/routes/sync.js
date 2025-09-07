'use strict';

/**
 * Frontend sync routes for page-section
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/admin/sync-frontend',
      handler: 'page-section.syncFrontend',
    },
    {
      method: 'GET',
      path: '/admin/sync-status',
      handler: 'page-section.getSyncStatus',
    },
    {
      method: 'POST',
      path: '/page-sections/:id/toggle-visibility',
      handler: 'page-section.toggleVisibility',
    }
  ]
};