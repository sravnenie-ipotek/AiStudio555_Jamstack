const { createStrapi } = require('@strapi/core');

const resetPassword = async () => {
  const strapi = await createStrapi({ appDir: process.cwd() }).load();
  
  try {
    const admins = await strapi.db.query('admin::user').findMany();
    
    if (admins.length > 0) {
      const admin = admins[0];
      console.log('\n🔐 Found admin user:', admin.email);
      
      // Use bcryptjs directly
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('Admin123!', 10);
      
      await strapi.db.query('admin::user').update({
        where: { id: admin.id },
        data: { 
          password: passwordHash,
          isActive: true 
        }
      });
      
      console.log('✅ Password reset successfully!');
      console.log('=====================================');
      console.log('Email:', admin.email);
      console.log('New Password: Admin123!');
      console.log('=====================================\n');
    } else {
      console.log('No admin user found.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await strapi.destroy();
    process.exit(0);
  }
};

resetPassword();