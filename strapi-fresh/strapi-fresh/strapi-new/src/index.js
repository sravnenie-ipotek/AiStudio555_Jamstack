'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Ensure home-page permissions are created for public role
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        // Check if home-page find permission exists
        const existingPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
          where: { 
            role: publicRole.id,
            action: 'api::home-page.home-page.find'
          },
        });

        if (existingPermissions.length === 0) {
          // Create the permission if it doesn't exist
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: 'api::home-page.home-page.find',
              role: publicRole.id,
              enabled: true
            }
          });
          console.log('✅ Created home-page find permission for public role');
        } else {
          // Enable it if it exists but is disabled
          for (const perm of existingPermissions) {
            if (!perm.enabled) {
              await strapi.query('plugin::users-permissions.permission').update({
                where: { id: perm.id },
                data: { enabled: true }
              });
              console.log('✅ Enabled home-page find permission for public role');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error setting up home-page permissions:', error);
    }
  },
};