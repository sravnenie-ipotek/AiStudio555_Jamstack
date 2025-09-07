import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsAlumniReviews extends Struct.ComponentSchema {
  collectionName: 'components_sections_alumni_reviews';
  info: {
    description: 'Alumni testimonials section';
    displayName: 'Alumni Reviews';
  };
  attributes: {
    graduatesDescription: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"Join alumni at the world's leading technology companies">;
    graduatesTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Our Graduates Work At'>;
    reviews: Schema.Attribute.Component<'shared.review', true>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Student Success Stories'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Alumni Reviews'>;
  };
}

export interface SectionsFaqSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_sections';
  info: {
    description: 'Frequently asked questions section';
    displayName: 'FAQ Section';
  };
  attributes: {
    questions: Schema.Attribute.Component<'shared.faq-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Frequently Asked Questions'>;
  };
}

export interface SectionsFeaturedCourses extends Struct.ComponentSchema {
  collectionName: 'components_sections_featured_courses';
  info: {
    description: 'Section to display featured courses';
    displayName: 'Featured Courses';
  };
  attributes: {
    courseCards: Schema.Attribute.Component<'shared.course-card', true>;
    sectionDescription: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.'>;
    sectionTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Most Popular IT Courses To Advance Your Career.'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Most Popular IT Courses'>;
  };
}

export interface SectionsHeroBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_banners';
  info: {
    description: 'Main hero section with title, subtitle and CTA';
    displayName: 'Hero Banner';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    ctaButton: Schema.Attribute.Component<'shared.button', false>;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.">;
    secondaryButton: Schema.Attribute.Component<'shared.button', false>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Expert-Led Learning'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Unlock Potential With Proven Courses.'>;
  };
}

export interface SectionsOnlineLearning extends Struct.ComponentSchema {
  collectionName: 'components_sections_online_learnings';
  info: {
    description: 'Online learning benefits section';
    displayName: 'Online Learning';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'shared.benefit-item', true>;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Our online learning platform makes it easy to access world-class education from the comfort of your home. Learn at your own pace with expert instructors and interactive course materials.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Learn From Anywhere, Anytime With Our Platform.'>;
  };
}

export interface SectionsPracticeFocus extends Struct.ComponentSchema {
  collectionName: 'components_sections_practice_focuses';
  info: {
    description: 'Practice focused learning section';
    displayName: 'Practice Focus';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"We provide structured knowledge that's in demand in today's job market. No fluff in our teaching - only hands-on experience and real-world projects.">;
    practices: Schema.Attribute.Component<'shared.practice-item', true>;
    practiceStatsTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Practice Focus Statistics'>;
    skillsTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Skills You'll Master Through Practice">;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Focus on Practice'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'85% Practice, 15% Theory - Real Skills That Matter'>;
  };
}

export interface SharedBenefitItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_benefit_items';
  info: {
    description: 'Individual benefit item';
    displayName: 'Benefit Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: 'Reusable button component';
    displayName: 'Button';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Get Started'>;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#'>;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedCourseCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_course_cards';
  info: {
    description: 'Course card for featured courses';
    displayName: 'Course Card';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Master modern web development with HTML, CSS, JavaScript, React, Node.js and databases. Build real-world projects and deploy to production.'>;
    duration: Schema.Attribute.String & Schema.Attribute.DefaultTo<'12 weeks'>;
    instructor: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Expert Instructor'>;
    level: Schema.Attribute.Enumeration<
      ['Beginner', 'Intermediate', 'Advanced']
    > &
      Schema.Attribute.DefaultTo<'Beginner'>;
    link: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/courses/full-stack-web-development'>;
    originalPrice: Schema.Attribute.Decimal;
    price: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<299.99>;
    rating: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<4.8>;
    studentsCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1250>;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Full Stack Web Development'>;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: 'Frequently asked question item';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'We offer a comprehensive range of AI and IT courses including machine learning, web development, data science, cybersecurity, cloud computing, and more. All courses focus on practical, hands-on learning.'>;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Q: What types of AI and IT courses are available?'>;
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
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'step'>;
    stepNumber: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Step Title'>;
  };
}

export interface SharedPracticeItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_practice_items';
  info: {
    description: 'Individual practice item';
    displayName: 'Practice Item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedReview extends Struct.ComponentSchema {
  collectionName: 'components_shared_reviews';
  info: {
    description: 'Alumni review component';
    displayName: 'Review';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    company: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Tech Solutions Inc'>;
    courseCompleted: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Full Stack Web Development'>;
    graduationDate: Schema.Attribute.Date;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Sarah Johnson'>;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    review: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'The hands-on approach and real-world projects made all the difference in my career. I went from zero programming experience to landing my dream job as a full-stack developer in just 6 months. The instructors are incredibly knowledgeable and supportive.'>;
    role: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Full Stack Developer'>;
  };
}

export interface SharedSkillItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_skill_items';
  info: {
    description: 'Individual skill with name and level';
    displayName: 'Skill Item';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'code'>;
    level: Schema.Attribute.Enumeration<
      ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    > &
      Schema.Attribute.DefaultTo<'Intermediate'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'JavaScript'>;
    progress: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<75>;
  };
}

export interface SharedStatItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_items';
  info: {
    description: 'Statistics display component';
    displayName: 'Stat Item';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'users'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Students'>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'1000+'>;
  };
}

export interface SharedTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonial_items';
  info: {
    description: 'Individual testimonial with author info';
    displayName: 'Testimonial Item';
  };
  attributes: {
    authorCompany: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Tech Company'>;
    authorImage: Schema.Attribute.Media<'images'>;
    authorName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'John Doe'>;
    authorTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Software Developer'>;
    content: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'This course completely transformed my career. The hands-on approach and expert guidance helped me land my dream job in tech.'>;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    rating: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
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
      'shared.benefit-item': SharedBenefitItem;
      'shared.button': SharedButton;
      'shared.course-card': SharedCourseCard;
      'shared.faq-item': SharedFaqItem;
      'shared.learning-step': SharedLearningStep;
      'shared.practice-item': SharedPracticeItem;
      'shared.review': SharedReview;
      'shared.skill-item': SharedSkillItem;
      'shared.stat-item': SharedStatItem;
      'shared.testimonial-item': SharedTestimonialItem;
    }
  }
}
