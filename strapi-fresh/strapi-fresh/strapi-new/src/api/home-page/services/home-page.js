'use strict';

/**
 * home-page service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::home-page.home-page', ({ strapi }) => ({
  /**
   * Get home page with full population
   */
  async getHomePageContent(locale = 'en') {
    return await strapi.entityService.findOne('api::home-page.home-page', 1, {
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
      locale,
    });
  },

  /**
   * Update home page section
   */
  async updateSection(sectionName, sectionData, locale = 'en') {
    const updateData = {
      [sectionName]: sectionData
    };

    return await strapi.entityService.update('api::home-page.home-page', 1, {
      data: updateData,
      populate: {
        [sectionName]: true
      },
      locale,
    });
  },

  /**
   * Get specific section content
   */
  async getSection(sectionName, locale = 'en') {
    const populateConfig = {
      [sectionName]: true
    };

    // Add specific population rules for complex sections
    if (sectionName === 'featuredCourses') {
      populateConfig[sectionName] = {
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
    } else if (sectionName === 'alumniReviews') {
      populateConfig[sectionName] = {
        populate: {
          reviews: {
            populate: {
              authorAvatar: true,
            }
          }
        }
      };
    } else if (sectionName === 'hero') {
      populateConfig[sectionName] = {
        populate: {
          backgroundVideo: true,
          heroImage: true,
        }
      };
    } else if (sectionName === 'onlineLearning') {
      populateConfig[sectionName] = {
        populate: {
          instructorImage: true,
        }
      };
    } else if (sectionName === 'practiceFocus') {
      populateConfig[sectionName] = {
        populate: {
          learningPath: true,
          skills: true,
        }
      };
    } else if (sectionName === 'faq') {
      populateConfig[sectionName] = {
        populate: {
          faqs: true,
        }
      };
    } else if (sectionName === 'seo') {
      populateConfig[sectionName] = {
        populate: {
          metaImage: true,
          metaSocial: {
            populate: {
              image: true,
            }
          }
        }
      };
    }

    const entity = await strapi.entityService.findOne('api::home-page.home-page', 1, {
      populate: populateConfig,
      locale,
    });

    return entity ? entity[sectionName] : null;
  },

  /**
   * Initialize home page with default content
   */
  async initializeHomePageContent(locale = 'en') {
    const existingContent = await this.getHomePageContent(locale);
    
    if (existingContent) {
      return existingContent;
    }

    // Create default content structure
    const defaultContent = {
      hero: {
        title: "Unlock Potential With Proven Courses.",
        subtitle: "Expert-Led Learning",
        description: "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.",
        primaryButtonText: "Get in Touch",
        primaryButtonLink: "contact-us.html",
        secondaryButtonText: "Check Out Courses",
        secondaryButtonLink: "courses.html"
      },
      featuredCourses: {
        sectionTitle: "Most Popular IT Courses To Advance Your Career.",
        sectionSubtitle: "Most Popular IT Courses",
        sectionDescription: "Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.",
        showAllCoursesButton: true,
        allCoursesButtonText: "Uncover All Courses"
      },
      practiceFocus: {
        title: "85% Practice, 15% Theory - Real Skills That Matter",
        subtitle: "Focus on Practice",
        description: "We provide structured knowledge that's in demand in today's job market. No fluff in our teaching - only hands-on experience and real-world projects.",
        practicePercentage: 85,
        theoryPercentage: 15,
        jobSupportPercentage: 100
      },
      onlineLearning: {
        title: "Learn From Anywhere, Anytime With Our Platform.",
        subtitle: "Online Learning",
        description: "Our online learning platform makes it easy to access world-class education from the comfort of your home. Learn at your own pace with expert instructors and interactive course materials.",
        totalCourses: "20+",
        totalLearners: "14K+",
        yearsExperience: "8+",
        instructorName: "Mrs. Sarah Johnson",
        instructorTitle: "Expert Mentor In Technology",
        instructorBio: "Providing hands-on, real-world training and mentorship, i aim to bridge gap between theoretical knowledge & practical application, ensuring that every student can confidently apply their skills.",
        achievements: "She has received prestigious honors \"Top Educator\" award and the \"Teaching Excellence\" award."
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "FAQ & Answer",
        description: "Find answers to the most common questions about our courses, learning platform, and support services.",
        ctaButtonText: "get in touch",
        ctaButtonLink: "contact-us.html"
      },
      alumniReviews: {
        sectionTitle: "Alumni Reviews",
        sectionSubtitle: "Student Success Stories",
        sectionDescription: "Real feedback from our graduates who have successfully transformed their careers through our courses.",
        overallRating: 4.9,
        trustpilotRating: 4.9,
        googleRating: 4.8,
        showMoreReviewsButton: true,
        moreReviewsButtonText: "View All Reviews",
        moreReviewsButtonLink: "/reviews"
      },
      seo: {
        metaTitle: "AI Studio - Expert-Led IT Courses | Transform Your Tech Career",
        metaDescription: "Unlock your potential with proven AI and IT courses. 85% practice, 15% theory. Expert instructors, hands-on projects, and job placement support.",
        keywords: "AI courses, IT training, programming courses, tech career, online learning, expert instructors",
        metaRobots: "index,follow",
        structuredData: null,
        canonicalURL: "https://aistudio.com"
      },
      locale,
      publishedAt: new Date()
    };

    return await strapi.entityService.create('api::home-page.home-page', {
      data: defaultContent,
      locale,
    });
  },

  /**
   * Get featured courses for home page
   */
  async getFeaturedCoursesForHomePage(limit = 6) {
    return await strapi.entityService.findMany('api::course.course', {
      filters: {
        featured: true,
        publishedAt: {
          $notNull: true,
        }
      },
      populate: {
        thumbnail: true,
        category: true,
        instructor: {
          populate: {
            avatar: true,
          }
        }
      },
      sort: { rating: 'desc' },
      pagination: {
        page: 1,
        pageSize: limit,
      }
    });
  },

  /**
   * Get FAQ items for home page
   */
  async getFAQsForHomePage(limit = 5) {
    return await strapi.entityService.findMany('api::faq.faq', {
      filters: {
        publishedAt: {
          $notNull: true,
        }
      },
      sort: { displayOrder: 'asc' },
      pagination: {
        page: 1,
        pageSize: limit,
      }
    });
  },

  /**
   * Update home page SEO data
   */
  async updateSEO(seoData, locale = 'en') {
    return await this.updateSection('seo', seoData, locale);
  },

  /**
   * Bulk update multiple sections
   */
  async updateMultipleSections(sectionsData, locale = 'en') {
    return await strapi.entityService.update('api::home-page.home-page', 1, {
      data: sectionsData,
      populate: 'deep',
      locale,
    });
  }
}));