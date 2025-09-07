import type { Schema, Struct } from '@strapi/strapi';

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
      'sections.alumni-reviews': SectionsAlumniReviews;
      'sections.faq-section': SectionsFaqSection;
      'sections.featured-courses': SectionsFeaturedCourses;
      'sections.hero-banner': SectionsHeroBanner;
      'sections.online-learning': SectionsOnlineLearning;
      'sections.practice-focus': SectionsPracticeFocus;
      'shared.course-module': SharedCourseModule;
      'shared.learning-outcome': SharedLearningOutcome;
      'shared.learning-step': SharedLearningStep;
      'shared.lesson': SharedLesson;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
      'shared.skill-item': SharedSkillItem;
      'shared.testimonial-item': SharedTestimonialItem;
    }
  }
}
