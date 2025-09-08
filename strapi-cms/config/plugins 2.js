module.exports = ({ env }) => ({
  // Enable internationalization
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'en',
      locales: [
        {
          code: 'en',
          name: 'English',
        },
        {
          code: 'ru',
          name: 'Russian (Русский)',
        },
        {
          code: 'he',
          name: 'Hebrew (עברית)',
          isRTL: true,
        },
      ],
    },
  },
  
  // Upload configuration (will use Cloudinary later)
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250mb in bytes
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
    },
  },
  
  // Email configuration
  email: {
    config: {
      provider: 'sendmail',
      settings: {
        defaultFrom: 'noreply@yoursite.com',
        defaultReplyTo: 'noreply@yoursite.com',
      },
    },
  },
});