const config = {
  locales: ['en', 'ru', 'he'],
  translations: {
    en: {
      'app.components.LeftMenu.navbrand.title': 'CMS Admin Panel',
      'app.components.LeftMenu.navbrand.workplace': 'Content Management',
    },
    ru: {
      'app.components.LeftMenu.navbrand.title': 'Панель администратора CMS',
      'app.components.LeftMenu.navbrand.workplace': 'Управление контентом',
    },
    he: {
      'app.components.LeftMenu.navbrand.title': 'לוח בקרה CMS',
      'app.components.LeftMenu.navbrand.workplace': 'ניהול תוכן',
    },
  },
};

const bootstrap = (app) => {
  console.log('Admin panel bootstrapped');
};

export default {
  config,
  bootstrap,
};