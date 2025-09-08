const { createStrapi } = require('@strapi/strapi');

async function setupPermissions() {
  const strapi = await createStrapi().load();

  try {
    // Find the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (!publicRole) {
      console.error('Public role not found');
      process.exit(1);
    }

    // Get existing permissions for the public role
    const permissions = await strapi.query('plugin::users-permissions.permission').findMany({
      where: { role: publicRole.id },
    });

    // Define the permissions we want to enable
    const apiPermissions = [
      { action: 'api::home-page.home-page.find' },
    ];

    // Update or create permissions
    for (const perm of apiPermissions) {
      const existingPerm = permissions.find(p => p.action === perm.action);
      
      if (existingPerm) {
        await strapi.query('plugin::users-permissions.permission').update({
          where: { id: existingPerm.id },
          data: { enabled: true }
        });
        console.log(`✅ Enabled permission: ${perm.action}`);
      } else {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: perm.action,
            role: publicRole.id,
            enabled: true
          }
        });
        console.log(`✅ Created permission: ${perm.action}`);
      }
    }

    console.log('\n✅ API permissions configured successfully!');
    console.log('The Home Page API is now publicly accessible at:');
    console.log('http://localhost:1337/api/home-page?populate=*');
    
  } catch (error) {
    console.error('Error setting up permissions:', error);
  } finally {
    await strapi.destroy();
    process.exit(0);
  }
}

setupPermissions();