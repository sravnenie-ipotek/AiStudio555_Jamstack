async function resetAdmin() {
  try {
    // Find the first admin user
    const admins = await strapi.admin.services.user.findMany({ 
      filters: { isActive: true },
      populate: ['roles']
    });
    
    if (admins && admins.length > 0) {
      const admin = admins[0];
      console.log('Found admin user:', admin.email);
      
      // Update the password
      await strapi.admin.services.user.update(admin.id, {
        password: 'Admin123!',
        isActive: true
      });
      
      console.log('✅ Password reset successfully!');
      console.log('Email:', admin.email);
      console.log('New Password: Admin123!');
    } else {
      // Create new admin if none exists
      console.log('No admin found. Creating new admin...');
      const newAdmin = await strapi.admin.services.user.create({
        email: 'admin@strapi.io',
        firstname: 'Admin',
        lastname: 'User',
        password: 'Admin123!',
        isActive: true,
        roles: [1] // Super Admin role
      });
      console.log('✅ New admin created!');
      console.log('Email: admin@strapi.io');
      console.log('Password: Admin123!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

resetAdmin().then(() => process.exit(0));