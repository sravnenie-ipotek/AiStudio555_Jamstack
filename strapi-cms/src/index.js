'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  register({ strapi }) {
    // Register custom permissions
    strapi.admin.services.permission.actionProvider.registerMany([
      {
        uid: 'content.approve',
        displayName: 'Approve content',
        pluginName: 'content-manager',
        subCategory: 'Content approval',
        subjects: ['page-section'],
      },
    ]);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // Log server startup
    strapi.log.info('✅ Strapi server bootstrapped successfully');
    
    // Set up lifecycle hooks for content approval
    strapi.db.lifecycles.subscribe({
      models: ['api::page-section.page-section'],
      
      async beforeUpdate(event) {
        const { data, where } = event.params;
        
        // Check if user is SuperAdmin
        const ctx = strapi.requestContext.get();
        if (ctx && ctx.state && ctx.state.user) {
          const user = ctx.state.user;
          
          // If not SuperAdmin and trying to publish
          if (data.publishedAt && !user.roles.some(role => role.name === 'SuperAdmin')) {
            // Create approval request instead
            data.publishedAt = null;
            data.pendingApproval = true;
            data.requestedBy = user.id;
            data.requestedAt = new Date();
            
            strapi.log.info(`Content approval requested by user ${user.email} for section ${where.id}`);
          }
        }
      },
      
      async afterUpdate(event) {
        const { result } = event;
        
        // If content has pendingApproval flag, notify SuperAdmin
        if (result.pendingApproval) {
          // Here we would send email notification to SuperAdmin
          strapi.log.info(`Notification: Content ${result.id} awaiting approval`);
        }
      },
    });
  },
};