module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    // Always check for admin on startup in development
    if (process.env.NODE_ENV === 'development' || process.env.RESET_ADMIN === 'true') {
      try {
        const admins = await strapi.db.query('admin::user').findMany();
        
        if (admins && admins.length > 0) {
          if (process.env.RESET_ADMIN === 'true') {
            const admin = admins[0];
            console.log('\n🔐 Resetting admin password...');
            console.log('Found admin user:', admin.email);
            
            // Hash the password
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('Admin123!', 10);
            
            await strapi.db.query('admin::user').update({
              where: { id: admin.id },
              data: {
                password: hashedPassword,
                isActive: true
              }
            });
            
            console.log('✅ Password reset successfully!');
            console.log('=====================================');
            console.log('Email:', admin.email);
            console.log('Password: Admin123!');
            console.log('=====================================\n');
          }
        } else {
          // Always create admin if none exists
          console.log('\n🔐 No admin user found. Creating default admin...');
          
          const bcrypt = require('bcryptjs');
          const hashedPassword = await bcrypt.hash('Admin123!', 10);
          
          await strapi.db.query('admin::user').create({
            data: {
              email: 'admin@strapi.io',
              username: 'admin',
              firstname: 'Admin',
              lastname: 'User',
              password: hashedPassword,
              isActive: true,
              blocked: false,
              preferedLanguage: 'en'
            }
          });
          
          console.log('✅ Admin user created!');
          console.log('=====================================');
          console.log('Email: admin@strapi.io');
          console.log('Password: Admin123!');
          console.log('=====================================\n');
        }
        
        // Reset the flag
        delete process.env.RESET_ADMIN;
      } catch (error) {
        console.error('Error with admin setup:', error.message);
      }
    }
  },
};