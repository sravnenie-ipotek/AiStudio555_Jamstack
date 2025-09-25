const strapi = require('@strapi/strapi');

async function setPublicPermissions() {
  const app = await strapi.createStrapi({
    appDir: process.cwd(),
    distDir: './.strapi',
    autoReload: false,
    serveAdminPanel: false,
  }).register();
  
  await app.bootstrap();
  await app.load();

  try {
    console.log('🔧 Setting public permissions for home-page...');
    
    // Get the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.log('❌ Public role not found');
      return;
    }

    // Get current permissions
    const permissions = await strapi.query('plugin::users-permissions.permission').findMany({
      where: {
        role: publicRole.id,
      }
    });

    // Check if home-page find permission exists
    const homePagePermission = permissions.find(p => 
      p.action === 'api::home-page.home-page.find'
    );

    if (homePagePermission) {
      // Update to enabled
      await strapi.query('plugin::users-permissions.permission').update({
        where: { id: homePagePermission.id },
        data: { enabled: true }
      });
      console.log('✅ Enabled find permission for home-page');
    } else {
      // Create the permission
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: 'api::home-page.home-page.find',
          enabled: true,
          role: publicRole.id
        }
      });
      console.log('✅ Created and enabled find permission for home-page');
    }

    console.log('✅ Public permissions set successfully!');
    console.log('\n🎯 Test the API:');
    console.log('curl http://localhost:3000/api/home-page?populate=deep');
    
  } catch (error) {
    console.error('❌ Error setting permissions:', error);
  } finally {
    await app.destroy();
    process.exit(0);
  }
}

setPublicPermissions();