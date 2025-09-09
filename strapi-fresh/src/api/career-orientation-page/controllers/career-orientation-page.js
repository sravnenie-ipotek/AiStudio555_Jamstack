'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::career-orientation-page.career-orientation-page', ({ strapi }) => ({
  // Override the default find method to populate all components
  async find(ctx) {
    const { data, meta } = await super.find(ctx, {
      populate: {
        hero: {
          populate: {
            statistics: true,
            backgroundImage: true,
            backgroundVideo: true,
          }
        },
        problemsSection: {
          populate: {
            problemCards: {
              populate: {
                iconUrl: true
              }
            }
          }
        },
        solutionsSection: {
          populate: {
            solutionFeatures: {
              populate: {
                iconUrl: true,
                featureImage: true
              }
            }
          }
        },
        processSection: {
          populate: {
            processSteps: {
              populate: {
                iconUrl: true,
                stepImage: true
              }
            }
          }
        },
        careerPathsSection: {
          populate: {
            careerPaths: {
              populate: {
                iconUrl: true,
                careerImage: true
              }
            }
          }
        },
        expertSection: {
          populate: {
            expertImage: true,
            achievements: true
          }
        },
        partnersSection: {
          populate: {
            partnerCompanies: {
              populate: {
                companyLogo: true
              }
            }
          }
        },
        assessmentSection: {
          populate: {
            assessmentQuestions: true
          }
        },
        footerSection: {
          populate: {
            companyLogo: true
          }
        }
      }
    });

    return { data, meta };
  },

  // Override the default findOne method to populate all components
  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx, {
      populate: {
        hero: {
          populate: {
            statistics: true,
            backgroundImage: true,
            backgroundVideo: true,
          }
        },
        problemsSection: {
          populate: {
            problemCards: {
              populate: {
                iconUrl: true
              }
            }
          }
        },
        solutionsSection: {
          populate: {
            solutionFeatures: {
              populate: {
                iconUrl: true,
                featureImage: true
              }
            }
          }
        },
        processSection: {
          populate: {
            processSteps: {
              populate: {
                iconUrl: true,
                stepImage: true
              }
            }
          }
        },
        careerPathsSection: {
          populate: {
            careerPaths: {
              populate: {
                iconUrl: true,
                careerImage: true
              }
            }
          }
        },
        expertSection: {
          populate: {
            expertImage: true,
            achievements: true
          }
        },
        partnersSection: {
          populate: {
            partnerCompanies: {
              populate: {
                companyLogo: true
              }
            }
          }
        },
        assessmentSection: {
          populate: {
            assessmentQuestions: true
          }
        },
        footerSection: {
          populate: {
            companyLogo: true
          }
        }
      }
    });

    return { data, meta };
  }
}));