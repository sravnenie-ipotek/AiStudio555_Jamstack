'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::career-orientation-assessment-response.career-orientation-assessment-response');

const customRoutes = {
  routes: [
    {
      method: 'POST',
      path: '/career-orientation-assessment-responses/submit',
      handler: 'career-orientation-assessment-response.submit',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'GET', 
      path: '/career-orientation-assessment-responses/session/:sessionId',
      handler: 'career-orientation-assessment-response.getBySession',
      config: {
        policies: [],
        middlewares: []
      }
    },
    ...defaultRouter.routes
  ]
};

module.exports = customRoutes;