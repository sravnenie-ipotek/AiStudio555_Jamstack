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
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/home-page',
      handler: 'home-page.update',
      config: {
        auth: false,
      },
    },
  ],
};