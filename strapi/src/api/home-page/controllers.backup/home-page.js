'use strict';

/**
 * home-page controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::home-page.home-page', ({ strapi }) => ({
  /**
   * Retrieve the home page content with all populated fields
   */
  async find(ctx) {
    const { locale } = ctx.query;
    
    const entity = await strapi.entityService.findOne('api::home-page.home-page', 1, {
      populate: {
        hero: {
          populate: {
            backgroundVideo: true,
            heroImage: true,
          }
        },
        featuredCourses: {
          populate: {
            courses: {
              populate: {
                thumbnail: true,
                category: true,
                instructor: {
                  populate: {
                    avatar: true,
                  }
                }
              }
            }
          }
        },
        practiceFocus: {
          populate: {
            learningPath: true,
            skills: true,
          }
        },
        onlineLearning: {
          populate: {
            instructorImage: true,
          }
        },
        faq: {
          populate: {
            faqs: true,
          }
        },
        alumniReviews: {
          populate: {
            reviews: {
              populate: {
                authorAvatar: true,
              }
            }
          }
        },
        seo: {
          populate: {
            metaImage: true,
            metaSocial: {
              populate: {
                image: true,
              }
            }
          }
        }
      },
      locale: locale || 'en',
    });

    if (!entity) {
      return ctx.notFound('Home page content not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  /**
   * Update the home page content
   */
  async update(ctx) {
    const { locale } = ctx.query;
    const { data } = ctx.request.body;

    const entity = await strapi.entityService.update('api::home-page.home-page', 1, {
      data,
      populate: {
        hero: {
          populate: {
            backgroundVideo: true,
            heroImage: true,
          }
        },
        featuredCourses: {
          populate: {
            courses: {
              populate: {
                thumbnail: true,
                category: true,
                instructor: {
                  populate: {
                    avatar: true,
                  }
                }
              }
            }
          }
        },
        practiceFocus: {
          populate: {
            learningPath: true,
            skills: true,
          }
        },
        onlineLearning: {
          populate: {
            instructorImage: true,
          }
        },
        faq: {
          populate: {
            faqs: true,
          }
        },
        alumniReviews: {
          populate: {
            reviews: {
              populate: {
                authorAvatar: true,
              }
            }
          }
        },
        seo: {
          populate: {
            metaImage: true,
            metaSocial: {
              populate: {
                image: true,
              }
            }
          }
        }
      },
      locale: locale || 'en',
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  /**
   * Get only specific sections of the home page
   */
  async findSection(ctx) {
    const { section, locale } = ctx.params;
    
    if (!section) {
      return ctx.badRequest('Section parameter is required');
    }

    const validSections = ['hero', 'featuredCourses', 'practiceFocus', 'onlineLearning', 'faq', 'alumniReviews', 'seo'];
    
    if (!validSections.includes(section)) {
      return ctx.badRequest(`Invalid section. Valid sections are: ${validSections.join(', ')}`);
    }

    const populateConfig = {
      [section]: true
    };

    // Add specific population rules for complex sections
    if (section === 'featuredCourses') {
      populateConfig[section] = {
        populate: {
          courses: {
            populate: {
              thumbnail: true,
              category: true,
              instructor: {
                populate: {
                  avatar: true,
                }
              }
            }
          }
        }
      };
    } else if (section === 'alumniReviews') {
      populateConfig[section] = {
        populate: {
          reviews: {
            populate: {
              authorAvatar: true,
            }
          }
        }
      };
    }

    const entity = await strapi.entityService.findOne('api::home-page.home-page', 1, {
      populate: populateConfig,
      locale: locale || 'en',
    });

    if (!entity || !entity[section]) {
      return ctx.notFound(`${section} section not found`);
    }

    const sanitizedEntity = await this.sanitizeOutput(entity[section], ctx);

    return this.transformResponse(sanitizedEntity);
  },

  /**
   * Preview mode - get content with preview flag
   */
  async preview(ctx) {
    const { locale } = ctx.query;
    
    // This method can be used for preview mode functionality
    const entity = await strapi.entityService.findOne('api::home-page.home-page', 1, {
      populate: 'deep',
      locale: locale || 'en',
      publicationState: 'preview', // Include draft content
    });

    if (!entity) {
      return ctx.notFound('Home page content not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse({
      ...sanitizedEntity,
      isPreview: true,
      previewMode: true,
    });
  }
}));