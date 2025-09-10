import type { Schema, Struct } from '@strapi/strapi';

export interface CareerOrientationAssessmentQuestion
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_assessment_questions';
  info: {
    description: 'Individual assessment question with validation and options';
    displayName: 'Assessment Question';
  };
  attributes: {
    conditionalDisplay: Schema.Attribute.JSON;
    helpText: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    maxLength: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    minLength: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    options: Schema.Attribute.JSON;
    placeholderText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    questionGroup: Schema.Attribute.String;
    questionText: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    questionType: Schema.Attribute.Enumeration<
      ['text', 'textarea', 'select', 'radio', 'checkbox', 'scale']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'text'>;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    scaleMax: Schema.Attribute.Integer;
    scaleMaxLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    scaleMin: Schema.Attribute.Integer;
    scaleMinLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    validationMessage: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    validationRegex: Schema.Attribute.String;
  };
}

export interface CareerOrientationAssessmentSection
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_assessment_sections';
  info: {
    description: 'Career assessment form section with dynamic questions';
    displayName: 'Assessment Section';
  };
  attributes: {
    allowSaveResume: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    assessmentQuestions: Schema.Attribute.Component<
      'career-orientation.assessment-question',
      true
    > &
      Schema.Attribute.Required;
    completionMessage: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    completionRedirectUrl: Schema.Attribute.String;
    emailNotification: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    formDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    formSubtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    formTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    notificationEmail: Schema.Attribute.Email;
    requireAuthentication: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    saveResponses: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    showProgressBar: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    webhookUrl: Schema.Attribute.String;
  };
}

export interface CareerOrientationCareerPath extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_career_paths';
  info: {
    description: 'Individual career path specialization';
    displayName: 'Career Path';
  };
  attributes: {
    careerImage: Schema.Attribute.Media<'images'>;
    colorTheme: Schema.Attribute.String;
    demandLevel: Schema.Attribute.Enumeration<['High', 'Medium', 'Low']> &
      Schema.Attribute.DefaultTo<'Medium'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    detailedDescription: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    educationLevel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    experienceYearsMax: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    experienceYearsMin: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    growthProjection: Schema.Attribute.Enumeration<
      ['Growing', 'Stable', 'Declining']
    > &
      Schema.Attribute.DefaultTo<'Stable'>;
    iconName: Schema.Attribute.String;
    iconUrl: Schema.Attribute.Media<'images'>;
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    preferredSkills: Schema.Attribute.JSON;
    remoteFriendly: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    requiredSkills: Schema.Attribute.JSON;
    salaryCurrency: Schema.Attribute.Enumeration<['USD', 'EUR', 'ILS', 'RUB']> &
      Schema.Attribute.DefaultTo<'USD'>;
    salaryMax: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    salaryMin: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    salaryNote: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    salaryPeriod: Schema.Attribute.Enumeration<
      ['annually', 'monthly', 'hourly']
    > &
      Schema.Attribute.DefaultTo<'annually'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationCareerPathsSection
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_career_paths_sections';
  info: {
    description: 'Section showcasing available career paths and specializations';
    displayName: 'Career Paths Section';
  };
  attributes: {
    careerPaths: Schema.Attribute.Component<
      'career-orientation.career-path',
      true
    > &
      Schema.Attribute.Required;
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationExpertSection extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_expert_sections';
  info: {
    description: 'Expert profile section with achievements and credentials';
    displayName: 'Expert Section';
  };
  attributes: {
    achievements: Schema.Attribute.Component<'shared.achievement', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    certifications: Schema.Attribute.JSON;
    expertBio: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    expertCompany: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    expertImage: Schema.Attribute.Media<'images'>;
    expertLinkedin: Schema.Attribute.String;
    expertName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    expertQuote: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    expertTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    expertTwitter: Schema.Attribute.String;
    expertWebsite: Schema.Attribute.String;
    quoteContext: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    specialties: Schema.Attribute.JSON;
    yearsExperience: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface CareerOrientationFooterSection extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_footer_sections';
  info: {
    description: 'Comprehensive footer section with company info, links, and contact details';
    displayName: 'Footer Section';
  };
  attributes: {
    companyAddress: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    companyDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    companyEmail: Schema.Attribute.Email;
    companyLogo: Schema.Attribute.Media<'images'>;
    companyName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    companyPhone: Schema.Attribute.String;
    contactCtaButtonText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    contactCtaButtonUrl: Schema.Attribute.String;
    contactCtaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    contactCtaEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    contactCtaTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    copyrightText: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    facebookUrl: Schema.Attribute.String;
    githubUrl: Schema.Attribute.String;
    instagramUrl: Schema.Attribute.String;
    legalLinks: Schema.Attribute.JSON;
    linkedinUrl: Schema.Attribute.String;
    newsletterButtonText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    newsletterDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    newsletterEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    newsletterPlaceholder: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    newsletterTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    quickLinks: Schema.Attribute.JSON;
    quickLinksTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    resourcesLinks: Schema.Attribute.JSON;
    resourcesTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    servicesLinks: Schema.Attribute.JSON;
    servicesTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    socialMediaTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    twitterUrl: Schema.Attribute.String;
    youtubeUrl: Schema.Attribute.String;
  };
}

export interface CareerOrientationHero extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_heroes';
  info: {
    description: 'Hero section for career orientation page';
    displayName: 'Career Orientation Hero';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    backgroundVideo: Schema.Attribute.Media<'videos'>;
    ctaStyle: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    ctaText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ctaUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    mainTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    overlayOpacity: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0.5>;
    statistics: Schema.Attribute.Component<'shared.statistic', true>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationPartnerCompany
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_partner_companies';
  info: {
    description: 'Individual partner company with details and opportunities';
    displayName: 'Partner Company';
  };
  attributes: {
    companyDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    companyLogo: Schema.Attribute.Media<'images'>;
    companyName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    companySize: Schema.Attribute.Enumeration<
      ['Startup', 'Mid-size', 'Enterprise']
    > &
      Schema.Attribute.DefaultTo<'Mid-size'>;
    companyWebsite: Schema.Attribute.String;
    displayPriority: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    headquarters: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hiringActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    industry: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    internshipAvailable: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    jobsPostedCount: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    logoBackgroundColor: Schema.Attribute.String;
    partnershipType: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    remotePositions: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    successStory: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    testimonial: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    testimonialAuthor: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    testimonialTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationPartnersSection
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_partners_sections';
  info: {
    description: 'Section showcasing partner companies and hiring opportunities';
    displayName: 'Partners Section';
  };
  attributes: {
    partnerCompanies: Schema.Attribute.Component<
      'career-orientation.partner-company',
      true
    > &
      Schema.Attribute.Required;
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationProblemCard extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_problem_cards';
  info: {
    description: 'Individual problem/challenge card';
    displayName: 'Problem Card';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    highlightColor: Schema.Attribute.String;
    iconName: Schema.Attribute.String;
    iconUrl: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationProblemsSection
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_problems_sections';
  info: {
    description: 'Section showcasing career challenges and problems';
    displayName: 'Problems Section';
  };
  attributes: {
    problemCards: Schema.Attribute.Component<
      'career-orientation.problem-card',
      true
    > &
      Schema.Attribute.Required;
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationProcessSection
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_process_sections';
  info: {
    description: 'Section showcasing the career orientation process steps';
    displayName: 'Process Section';
  };
  attributes: {
    processSteps: Schema.Attribute.Component<
      'career-orientation.process-step',
      true
    > &
      Schema.Attribute.Required;
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_process_steps';
  info: {
    description: 'Individual process step in the career orientation journey';
    displayName: 'Process Step';
  };
  attributes: {
    deliverables: Schema.Attribute.JSON;
    detailedDescription: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    duration: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    iconName: Schema.Attribute.String;
    iconUrl: Schema.Attribute.Media<'images'>;
    isHighlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    requirements: Schema.Attribute.JSON;
    shortDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    stepImage: Schema.Attribute.Media<'images'>;
    stepNumber: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationSolutionFeature
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_solution_features';
  info: {
    description: 'Individual solution feature card';
    displayName: 'Solution Feature';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    detailedDescription: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    featureImage: Schema.Attribute.Media<'images'>;
    highlightColor: Schema.Attribute.String;
    iconName: Schema.Attribute.String;
    iconUrl: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface CareerOrientationSolutionsSection
  extends Struct.ComponentSchema {
  collectionName: 'components_career_orientation_solutions_sections';
  info: {
    description: 'Section showcasing solution features and benefits';
    displayName: 'Solutions Section';
  };
  attributes: {
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    solutionFeatures: Schema.Attribute.Component<
      'career-orientation.solution-feature',
      true
    > &
      Schema.Attribute.Required;
  };
}

export interface SectionsAlumniReviews extends Struct.ComponentSchema {
  collectionName: 'components_sections_alumni_reviews';
  info: {
    description: 'Testimonials and reviews from course alumni';
    displayName: 'Alumni Reviews';
  };
  attributes: {
    googleRating: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4.8>;
    moreReviewsButtonLink: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/reviews'>;
    moreReviewsButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'View All Reviews'>;
    overallRating: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4.9>;
    reviews: Schema.Attribute.Component<'shared.testimonial-item', true>;
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Real feedback from our graduates who have successfully transformed their careers through our courses.'>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Student Success Stories'>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Alumni Reviews'>;
    showMoreReviewsButton: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    trustpilotRating: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4.9>;
  };
}

export interface SectionsFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_sections';
  info: {
    description: 'Frequently Asked Questions section';
    displayName: 'FAQ Section';
  };
  attributes: {
    ctaButtonLink: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'contact-us.html'>;
    ctaButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'get in touch'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Find answers to the most common questions about our courses, learning platform, and support services.'>;
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'FAQ & Answer'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Frequently Asked Questions'>;
  };
}

export interface SectionsFeaturedCourses extends Struct.ComponentSchema {
  collectionName: 'components_sections_featured_courses';
  info: {
    description: 'Section displaying featured course cards';
    displayName: 'Featured Courses';
  };
  attributes: {
    allCoursesButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Uncover All Courses'>;
    courses: Schema.Attribute.Relation<'oneToMany', 'api::course.course'>;
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.'>;
    sectionSubtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Most Popular IT Courses'>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Most Popular IT Courses To Advance Your Career.'>;
    showAllCoursesButton: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface SectionsHeroBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_banners';
  info: {
    description: 'Main hero section with title, subtitle, and CTA buttons';
    displayName: 'Hero Banner';
  };
  attributes: {
    backgroundVideo: Schema.Attribute.Media<'videos'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }> &
      Schema.Attribute.DefaultTo<"Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.">;
    heroImage: Schema.Attribute.Media<'images'>;
    primaryButtonLink: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'contact-us.html'>;
    primaryButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Get in Touch'>;
    secondaryButtonLink: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'courses.html'>;
    secondaryButtonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Check Out Courses'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Expert-Led Learning'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }> &
      Schema.Attribute.DefaultTo<'Unlock Potential With Proven Courses.'>;
  };
}

export interface SectionsOnlineLearning extends Struct.ComponentSchema {
  collectionName: 'components_sections_online_learning';
  info: {
    description: 'Section about online learning platform features';
    displayName: 'Online Learning';
  };
  attributes: {
    achievements: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'She has received prestigious honors "Top Educator" award and the "Teaching Excellence" award.'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Our online learning platform makes it easy to access world-class education from the comfort of your home. Learn at your own pace with expert instructors and interactive course materials.'>;
    instructorBio: Schema.Attribute.RichText &
      Schema.Attribute.DefaultTo<'Providing hands-on, real-world training and mentorship, i aim to bridge gap between theoretical knowledge & practical application, ensuring that every student can confidently apply their skills.'>;
    instructorImage: Schema.Attribute.Media<'images'>;
    instructorName: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Mrs. Sarah Johnson'>;
    instructorTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Expert Mentor In Technology'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Online Learning'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Learn From Anywhere, Anytime With Our Platform.'>;
    totalCourses: Schema.Attribute.String & Schema.Attribute.DefaultTo<'20+'>;
    totalLearners: Schema.Attribute.String & Schema.Attribute.DefaultTo<'14K+'>;
    yearsExperience: Schema.Attribute.String & Schema.Attribute.DefaultTo<'8+'>;
  };
}

export interface SectionsPracticeFocus extends Struct.ComponentSchema {
  collectionName: 'components_sections_practice_focus';
  info: {
    description: 'Section highlighting practical learning approach';
    displayName: 'Practice Focus';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"We provide structured knowledge that's in demand in today's job market. No fluff in our teaching - only hands-on experience and real-world projects.">;
    jobSupportPercentage: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<100>;
    learningPath: Schema.Attribute.Component<'shared.learning-step', true>;
    practicePercentage: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<85>;
    skills: Schema.Attribute.Component<'shared.skill-item', true>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Focus on Practice'>;
    theoryPercentage: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<15>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'85% Practice, 15% Theory - Real Skills That Matter'>;
  };
}

export interface SharedAchievement extends Struct.ComponentSchema {
  collectionName: 'components_shared_achievements';
  info: {
    description: 'Reusable achievement component with number, label and description';
    displayName: 'Achievement';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    number: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCourseModule extends Struct.ComponentSchema {
  collectionName: 'components_shared_course_modules';
  info: {
    description: 'Course curriculum module';
    displayName: 'Course Module';
  };
  attributes: {
    description: Schema.Attribute.Text;
    lessons: Schema.Attribute.Component<'shared.lesson', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLearningOutcome extends Struct.ComponentSchema {
  collectionName: 'components_shared_learning_outcomes';
  info: {
    description: 'What students will learn';
    displayName: 'Learning Outcome';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    outcome: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLearningStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_learning_steps';
  info: {
    description: 'Individual step in learning path';
    displayName: 'Learning Step';
  };
  attributes: {
    description: Schema.Attribute.Text;
    duration: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
    stepNumber: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLesson extends Struct.ComponentSchema {
  collectionName: 'components_shared_lessons';
  info: {
    description: 'Individual lesson in a module';
    displayName: 'Lesson';
  };
  attributes: {
    duration: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    materials: Schema.Attribute.Media<'files' | 'images' | 'videos', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    videoUrl: Schema.Attribute.String;
  };
}

export interface SharedMetaSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_socials';
  info: {
    description: 'Social media meta tags';
    displayName: 'Meta Social';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    image: Schema.Attribute.Media<'images'>;
    socialNetwork: Schema.Attribute.Enumeration<
      ['Facebook', 'Twitter', 'LinkedIn']
    > &
      Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata for pages';
    displayName: 'SEO';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaKeywords: Schema.Attribute.Text;
    metaSocial: Schema.Attribute.Component<'shared.meta-social', true>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSkillItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_skill_items';
  info: {
    description: 'Individual skill in the skills grid';
    displayName: 'Skill Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStatistic extends Struct.ComponentSchema {
  collectionName: 'components_shared_statistics';
  info: {
    description: 'Reusable statistic component with value and label';
    displayName: 'Statistic';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonial_items';
  info: {
    description: 'Individual testimonial/review item';
    displayName: 'Testimonial Item';
  };
  attributes: {
    authorAvatar: Schema.Attribute.Media<'images'>;
    authorInitial: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2;
      }>;
    authorName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    courseTaken: Schema.Attribute.String;
    hasReadMore: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isVerified: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    readMoreLink: Schema.Attribute.String;
    reviewDate: Schema.Attribute.String & Schema.Attribute.Required;
    reviewPlatform: Schema.Attribute.Enumeration<
      ['Yandex', 'Google', 'Trustpilot', 'Facebook', 'Internal']
    > &
      Schema.Attribute.DefaultTo<'Google'>;
    reviewText: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'career-orientation.assessment-question': CareerOrientationAssessmentQuestion;
      'career-orientation.assessment-section': CareerOrientationAssessmentSection;
      'career-orientation.career-path': CareerOrientationCareerPath;
      'career-orientation.career-paths-section': CareerOrientationCareerPathsSection;
      'career-orientation.expert-section': CareerOrientationExpertSection;
      'career-orientation.footer-section': CareerOrientationFooterSection;
      'career-orientation.hero': CareerOrientationHero;
      'career-orientation.partner-company': CareerOrientationPartnerCompany;
      'career-orientation.partners-section': CareerOrientationPartnersSection;
      'career-orientation.problem-card': CareerOrientationProblemCard;
      'career-orientation.problems-section': CareerOrientationProblemsSection;
      'career-orientation.process-section': CareerOrientationProcessSection;
      'career-orientation.process-step': CareerOrientationProcessStep;
      'career-orientation.solution-feature': CareerOrientationSolutionFeature;
      'career-orientation.solutions-section': CareerOrientationSolutionsSection;
      'sections.alumni-reviews': SectionsAlumniReviews;
      'sections.faq-section': SectionsFaqSection;
      'sections.featured-courses': SectionsFeaturedCourses;
      'sections.hero-banner': SectionsHeroBanner;
      'sections.online-learning': SectionsOnlineLearning;
      'sections.practice-focus': SectionsPracticeFocus;
      'shared.achievement': SharedAchievement;
      'shared.course-module': SharedCourseModule;
      'shared.learning-outcome': SharedLearningOutcome;
      'shared.learning-step': SharedLearningStep;
      'shared.lesson': SharedLesson;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
      'shared.skill-item': SharedSkillItem;
      'shared.statistic': SharedStatistic;
      'shared.testimonial-item': SharedTestimonialItem;
    }
  }
}
