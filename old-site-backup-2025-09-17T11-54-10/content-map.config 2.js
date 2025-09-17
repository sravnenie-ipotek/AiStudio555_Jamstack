/**
 * Content Map Configuration
 * Maps HTML elements to Strapi content types
 */

module.exports = {
  pages: {
    'home': {
      path: './home.html',
      url: 'http://localhost:3005',
      strapiType: 'api::home-page.home-page',
      sections: [
        {
          id: 'hero-banner',
          selector: 'section.section.banner',
          component: 'sections.hero-banner',
          title: 'Hero Banner',
          fields: [
            {
              name: 'title',
              label: 'Main Heading',
              selector: 'h1.banner-heading',
              type: 'text',
              localized: true,
              defaultValue: 'Unlock Potential With Proven Courses.',
              preview: {
                desktop: '/screenshots/home/hero-title-desktop.png',
                mobile: '/screenshots/home/hero-title-mobile.png'
              }
            },
            {
              name: 'subtitle',
              label: 'Subtitle',
              selector: '.banner-subtitle',
              type: 'text',
              localized: true,
              defaultValue: 'Expert-Led Learning',
              preview: {
                desktop: '/screenshots/home/hero-subtitle-desktop.png',
                mobile: '/screenshots/home/hero-subtitle-mobile.png'
              }
            },
            {
              name: 'description',
              label: 'Description',
              selector: 'p.banner-description-text',
              type: 'text',
              localized: true,
              defaultValue: "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.",
              preview: {
                desktop: '/screenshots/home/hero-description-desktop.png',
                mobile: '/screenshots/home/hero-description-mobile.png'
              }
            },
            {
              name: 'primaryButton',
              label: 'Primary Button',
              selector: '.banner-button-wrapper a:first-child .primary-button-text-block',
              type: 'object',
              localized: true,
              fields: {
                text: { selector: '.primary-button-text-block', type: 'text' },
                link: { selector: '@href', type: 'attribute' }
              }
            },
            {
              name: 'secondaryButton',
              label: 'Secondary Button',
              selector: '.banner-button-wrapper a:last-child .primary-button-text-block',
              type: 'object',
              localized: true,
              fields: {
                text: { selector: '.primary-button-text-block', type: 'text' },
                link: { selector: '@href', type: 'attribute' }
              }
            }
          ]
        },
        {
          id: 'featured-courses',
          selector: 'section.section.featured-courses',
          component: 'sections.featured-courses',
          title: 'Featured Courses',
          fields: [
            {
              name: 'sectionTitle',
              label: 'Section Title',
              selector: 'h2.section-title.featured-courses',
              type: 'text',
              localized: true,
              defaultValue: 'Most Popular IT Courses To Advance Your Career.'
            },
            {
              name: 'sectionSubtitle',
              label: 'Section Subtitle',
              selector: '.section-subtitle',
              type: 'text',
              localized: true,
              defaultValue: 'Most Popular IT Courses'
            },
            {
              name: 'sectionDescription',
              label: 'Section Description',
              selector: 'p.section-description-text.featured-courses',
              type: 'text',
              localized: true,
              defaultValue: 'Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.'
            },
            {
              name: 'courses',
              label: 'Featured Courses List',
              selector: '.featured-courses-collection-item',
              type: 'relation',
              target: 'api::course.course',
              multiple: true,
              populateFields: ['title', 'thumbnail', 'rating', 'duration', 'lessons', 'category', 'price']
            }
          ]
        },
        {
          id: 'focus-on-practice',
          selector: 'section.section.why-choose-us',
          component: 'sections.practice-focus',
          title: 'Focus on Practice',
          fields: [
            {
              name: 'title',
              label: 'Section Title',
              selector: 'h2.section-title.why-choose-us',
              type: 'text',
              localized: true,
              defaultValue: '85% Practice, 15% Theory - Real Skills That Matter'
            },
            {
              name: 'subtitle',
              label: 'Section Subtitle',
              selector: '.section-subtitle',
              type: 'text',
              localized: true,
              defaultValue: 'Focus on Practice'
            },
            {
              name: 'description',
              label: 'Section Description',
              selector: 'p.section-description-text.why-choose-us',
              type: 'text',
              localized: true,
              defaultValue: "We provide structured knowledge that's in demand in today's job market. No fluff in our teaching - only hands-on experience and real-world projects."
            },
            {
              name: 'stats',
              label: 'Statistics',
              type: 'array',
              localized: true,
              fields: [
                { name: 'percentage', type: 'text' },
                { name: 'label', type: 'text' }
              ],
              defaultValue: [
                { percentage: '85%', label: 'Practical Work' },
                { percentage: '15%', label: 'Theory Only' },
                { percentage: '100%', label: 'Job Support' }
              ]
            },
            {
              name: 'learningPath',
              label: 'Learning Path Steps',
              type: 'array',
              localized: true,
              fields: [
                { name: 'step', type: 'number' },
                { name: 'title', type: 'text' },
                { name: 'description', type: 'richtext' },
                { name: 'duration', type: 'text' }
              ]
            }
          ]
        },
        {
          id: 'online-learning',
          selector: 'section.section.about-us',
          component: 'sections.online-learning',
          title: 'Online Learning',
          fields: [
            {
              name: 'title',
              label: 'Section Title',
              selector: 'h2.section-title.about-us',
              type: 'text',
              localized: true,
              defaultValue: 'Learn From Anywhere, Anytime With Our Platform.'
            },
            {
              name: 'subtitle',
              label: 'Section Subtitle',
              selector: '.section-subtitle',
              type: 'text',
              localized: true,
              defaultValue: 'Online Learning'
            },
            {
              name: 'description',
              label: 'Section Description',
              selector: 'p.section-description-text',
              type: 'text',
              localized: true,
              defaultValue: 'Our online learning platform makes it easy to access world-class education from the comfort of your home. Learn at your own pace with expert instructors and interactive course materials.'
            },
            {
              name: 'counters',
              label: 'Achievement Counters',
              type: 'array',
              fields: [
                { name: 'value', type: 'text' },
                { name: 'label', type: 'text' },
                { name: 'suffix', type: 'text' }
              ],
              defaultValue: [
                { value: '20', suffix: '+', label: 'Total Courses Taught' },
                { value: '14', suffix: 'K+', label: 'Total Happy Learners' },
                { value: '8', suffix: '+', label: 'Years Of Experience' }
              ]
            },
            {
              name: 'instructorName',
              label: 'Instructor Name',
              selector: 'h4.about-us-name',
              type: 'text',
              localized: true,
              defaultValue: 'Mrs. Sarah Johnson'
            },
            {
              name: 'instructorBio',
              label: 'Instructor Bio',
              selector: 'p.about-us-description-text',
              type: 'richtext',
              localized: true,
              defaultValue: 'Providing hands-on, real-world training and mentorship, i aim to bridge gap between theoretical knowledge & practical application, ensuring that every student can confidently apply their skills.'
            }
          ]
        },
        {
          id: 'faq',
          selector: 'section.section.faq',
          component: 'sections.faq-section',
          title: 'FAQ Section',
          fields: [
            {
              name: 'title',
              label: 'Section Title',
              selector: 'h2.section-title',
              type: 'text',
              localized: true,
              defaultValue: 'Frequently Asked Questions'
            },
            {
              name: 'subtitle',
              label: 'Section Subtitle',
              selector: '.section-subtitle',
              type: 'text',
              localized: true,
              defaultValue: 'FAQ & Answer'
            },
            {
              name: 'description',
              label: 'Section Description',
              selector: 'p.faq-section-description-text',
              type: 'text',
              localized: true,
              defaultValue: 'Dive into a world of learning with diverse and extensive range of tech courses designed to cater to every interest.'
            },
            {
              name: 'faqs',
              label: 'FAQ Items',
              type: 'relation',
              target: 'api::faq.faq',
              multiple: true,
              populateFields: ['question', 'answer', 'category', 'order']
            }
          ]
        }
      ]
    },
    'courses': {
      path: './courses.html',
      url: 'http://localhost:3005/courses',
      strapiType: 'api::courses-page.courses-page',
      sections: []
    },
    'about': {
      path: './about-us.html',
      url: 'http://localhost:3005/about-us',
      strapiType: 'api::about-page.about-page',
      sections: []
    }
  },
  locales: {
    en: { name: 'English', direction: 'ltr', isDefault: true },
    ru: { name: 'Russian', direction: 'ltr' },
    he: { name: 'Hebrew', direction: 'rtl' }
  }
};