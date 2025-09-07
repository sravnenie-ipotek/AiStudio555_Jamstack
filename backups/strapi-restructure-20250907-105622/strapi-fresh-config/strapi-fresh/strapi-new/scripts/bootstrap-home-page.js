const strapi = require('@strapi/strapi').default;

async function bootstrap() {
  const app = await strapi({
    distDir: './dist',
    runtimeDir: './.strapi',
  }).load();

  try {
    console.log('🚀 Bootstrapping home page content...');
    
    // Check if home page already exists
    const existing = await strapi.entityService.findMany('api::home-page.home-page');
    
    if (existing && existing.length > 0) {
      console.log('✅ Home page content already exists');
    } else {
      // Create home page content
      const homePageData = {
        title: "AI Studio - Welcome",
        heroTitle: "Unlock Potential With Proven Courses",
        heroSubtitle: "Expert-Led Learning", 
        heroSectionVisible: true,
        publishedAt: new Date()
      };

      const created = await strapi.entityService.create('api::home-page.home-page', {
        data: homePageData
      });

      console.log('✅ Home page content created:', created.id);
    }

  } catch (error) {
    console.error('❌ Bootstrap failed:', error.message);
  } finally {
    await strapi.destroy();
    process.exit(0);
  }
}

// Handle the app directly
bootstrap();