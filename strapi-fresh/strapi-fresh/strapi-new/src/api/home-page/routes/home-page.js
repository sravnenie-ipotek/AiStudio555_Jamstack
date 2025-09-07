'use strict';

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
  ],
};