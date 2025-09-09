import CareerOrientationDashboard from './components/CareerOrientationDashboard';

export default {
  // Inject custom dashboard into admin interface
  inject: [
    {
      name: 'career-orientation-dashboard',
      to: 'content-manager.routes',
      component: CareerOrientationDashboard,
      exact: true,
      path: '/career-orientation-dashboard'
    }
  ],
  
  // Custom configurations for career orientation content types
  config: {
    // Career Orientation Page configurations
    'api::career-orientation-page.career-orientation-page': {
      // Custom list view configuration
      list: {
        settings: {
          bulkActions: true,
          filters: ['pageTitle', 'publishedAt', 'locale'],
          pageSize: 10,
          searchable: true,
          sortable: true
        },
        layout: {
          defaultSort: 'updatedAt:desc',
          columns: [
            {
              name: 'pageTitle',
              label: '📄 Page Title',
              sortable: true,
              searchable: true,
              width: '30%'
            },
            {
              name: 'locale',
              label: '🌐 Language', 
              sortable: true,
              width: '10%'
            },
            {
              name: 'publishedAt',
              label: '🚀 Published',
              sortable: true,
              width: '15%',
              cellFormatter: (value) => value ? '✅ Live' : '📝 Draft'
            },
            {
              name: 'updatedAt',
              label: '📅 Last Updated',
              sortable: true,
              width: '20%'
            },
            {
              name: 'completion',
              label: '📊 Completion',
              width: '15%',
              cellFormatter: (value, row) => {
                const sections = ['hero', 'problemsSection', 'solutionsSection', 'processSection', 
                                'careerPathsSection', 'expertSection', 'partnersSection', 'assessmentSection'];
                const completed = sections.filter(section => row[section]).length;
                const percentage = Math.round((completed / sections.length) * 100);
                return `${percentage}% (${completed}/${sections.length})`;
              }
            }
          ]
        }
      },
      
      // Custom edit view configuration
      edit: {
        settings: {
          mainField: 'pageTitle',
          defaultSort: 'id:asc'
        },
        layout: {
          edit: [
            // SEO & Basic Info Section
            {
              name: 'seo-section',
              label: '🔍 SEO & Page Information',
              collapsible: true,
              collapsed: false,
              fields: [
                { 
                  name: 'pageTitle', 
                  size: 6,
                  hint: 'This will be the main page title and browser tab title'
                },
                { 
                  name: 'slug', 
                  size: 6,
                  hint: 'URL-friendly version of the page title'
                },
                { 
                  name: 'metaDescription', 
                  size: 8,
                  hint: 'Brief description for search engines (150-160 characters)'
                },
                { 
                  name: 'metaKeywords', 
                  size: 4,
                  hint: 'Comma-separated keywords'
                },
                {
                  name: 'canonicalUrl',
                  size: 12,
                  hint: 'Canonical URL to prevent duplicate content issues'
                }
              ]
            },
            
            // Hero Section
            {
              name: 'hero-section',
              label: '🎯 Hero Section',
              collapsible: true,
              collapsed: false,
              fields: [
                { 
                  name: 'hero', 
                  size: 12,
                  hint: 'Main hero section with title, statistics, and call-to-action'
                }
              ]
            },
            
            // Content Sections
            {
              name: 'content-sections',
              label: '📖 Content Sections',
              collapsible: true,
              collapsed: false,
              fields: [
                { 
                  name: 'problemsSection', 
                  size: 12,
                  hint: 'Section highlighting career challenges and problems'
                },
                { 
                  name: 'solutionsSection', 
                  size: 12,
                  hint: 'Section presenting solutions and benefits'
                },
                { 
                  name: 'processSection', 
                  size: 12,
                  hint: 'Step-by-step process explanation'
                },
                { 
                  name: 'careerPathsSection', 
                  size: 12,
                  hint: 'Available career paths and specializations'
                }
              ]
            },
            
            // Expert & Social Proof
            {
              name: 'social-proof-section',
              label: '👨‍💼 Expert & Social Proof',
              collapsible: true,
              collapsed: true,
              fields: [
                { 
                  name: 'expertSection', 
                  size: 12,
                  hint: 'Expert profile with credentials and achievements'
                },
                { 
                  name: 'partnersSection', 
                  size: 12,
                  hint: 'Partner companies and testimonials'
                }
              ]
            },
            
            // Assessment & Footer
            {
              name: 'assessment-footer-section',
              label: '📊 Assessment & Footer',
              collapsible: true,
              collapsed: true,
              fields: [
                { 
                  name: 'assessmentSection', 
                  size: 12,
                  hint: 'Career assessment form and questions'
                },
                { 
                  name: 'footerSection', 
                  size: 12,
                  hint: 'Footer content with links and contact information'
                }
              ]
            }
          ]
        },
        
        // Custom validation rules
        validation: {
          rules: {
            pageTitle: {
              required: true,
              maxLength: 255,
              message: 'Page title is required and must be less than 255 characters'
            },
            hero: {
              required: true,
              message: 'Hero section is required'
            },
            metaDescription: {
              maxLength: 160,
              message: 'Meta description should be under 160 characters for optimal SEO'
            }
          }
        }
      }
    },
    
    // Assessment Response configurations
    'api::career-orientation-assessment-response.career-orientation-assessment-response': {
      list: {
        settings: {
          bulkActions: false,
          filters: ['completionStatus', 'assessmentPage', 'createdAt'],
          pageSize: 25,
          searchable: true,
          sortable: true
        },
        layout: {
          defaultSort: 'createdAt:desc',
          columns: [
            {
              name: 'sessionId',
              label: '🆔 Session ID',
              sortable: true,
              width: '15%'
            },
            {
              name: 'completionStatus',
              label: '📊 Status',
              sortable: true,
              width: '12%',
              cellFormatter: (value) => {
                const statusEmojis = {
                  completed: '✅ Completed',
                  in_progress: '⏳ In Progress',
                  abandoned: '❌ Abandoned'
                };
                return statusEmojis[value] || value;
              }
            },
            {
              name: 'completionPercentage',
              label: '📈 Progress',
              sortable: true,
              width: '10%',
              cellFormatter: (value) => `${value}%`
            },
            {
              name: 'timeSpentSeconds',
              label: '⏰ Time Spent',
              sortable: true,
              width: '12%',
              cellFormatter: (value) => value ? `${Math.round(value / 60)}m` : 'N/A'
            },
            {
              name: 'createdAt',
              label: '📅 Started',
              sortable: true,
              width: '15%'
            },
            {
              name: 'completedAt',
              label: '🏁 Completed',
              sortable: true,
              width: '15%'
            }
          ]
        }
      },
      
      edit: {
        settings: {
          mainField: 'sessionId'
        },
        layout: {
          edit: [
            {
              name: 'response-info',
              label: '📋 Response Information',
              fields: [
                { name: 'sessionId', size: 6, editable: false },
                { name: 'completionStatus', size: 6, editable: false },
                { name: 'completionPercentage', size: 6, editable: false },
                { name: 'timeSpentSeconds', size: 6, editable: false }
              ]
            },
            {
              name: 'responses-data',
              label: '💬 Response Data',
              fields: [
                { name: 'responses', size: 12, editable: false },
                { name: 'assessmentResults', size: 12, editable: false },
                { name: 'recommendedCareerPaths', size: 12, editable: false }
              ]
            },
            {
              name: 'metadata',
              label: '🔍 Metadata',
              collapsible: true,
              collapsed: true,
              fields: [
                { name: 'userAgent', size: 12, editable: false },
                { name: 'ipAddress', size: 6, editable: false },
                { name: 'pageReferrer', size: 6, editable: false }
              ]
            }
          ]
        }
      }
    }
  },
  
  // Custom menu injection
  menu: {
    sections: [
      {
        name: 'career-orientation-management',
        label: '🎯 Career Orientation',
        items: [
          {
            name: 'career-orientation-dashboard',
            label: '📊 Dashboard',
            to: '/career-orientation-dashboard',
            Component: CareerOrientationDashboard
          },
          {
            name: 'career-orientation-pages',
            label: '📄 Pages',
            to: '/content-manager/collection-types/api::career-orientation-page.career-orientation-page'
          },
          {
            name: 'assessment-responses',
            label: '📊 Responses',
            to: '/content-manager/collection-types/api::career-orientation-assessment-response.career-orientation-assessment-response'
          }
        ]
      }
    ]
  }
};