#!/bin/bash

# STRAPI FULL INTEGRATION SETUP
# Creates all content types for complete website CMS control

echo "🚀 Setting up Complete Strapi CMS Integration"
echo "============================================="

cd strapi-fresh

# Create all API directories
echo "📁 Creating API directories..."
mkdir -p src/api/course/content-types/course
mkdir -p src/api/course/controllers
mkdir -p src/api/course/services
mkdir -p src/api/course/routes

mkdir -p src/api/about-page/content-types/about-page
mkdir -p src/api/about-page/controllers
mkdir -p src/api/about-page/services
mkdir -p src/api/about-page/routes

mkdir -p src/api/contact-page/content-types/contact-page
mkdir -p src/api/contact-page/controllers
mkdir -p src/api/contact-page/services
mkdir -p src/api/contact-page/routes

mkdir -p src/api/blog-post/content-types/blog-post
mkdir -p src/api/blog-post/controllers
mkdir -p src/api/blog-post/services
mkdir -p src/api/blog-post/routes

mkdir -p src/api/pricing-plan/content-types/pricing-plan
mkdir -p src/api/pricing-plan/controllers
mkdir -p src/api/pricing-plan/services
mkdir -p src/api/pricing-plan/routes

mkdir -p src/api/teacher/content-types/teacher
mkdir -p src/api/teacher/controllers
mkdir -p src/api/teacher/services
mkdir -p src/api/teacher/routes

mkdir -p src/api/job-posting/content-types/job-posting
mkdir -p src/api/job-posting/controllers
mkdir -p src/api/job-posting/services
mkdir -p src/api/job-posting/routes

mkdir -p src/api/career-resource/content-types/career-resource
mkdir -p src/api/career-resource/controllers
mkdir -p src/api/career-resource/services
mkdir -p src/api/career-resource/routes

echo "✅ API directories created"

# Create Course schema
cat > src/api/course/content-types/course/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "courses",
  "info": {
    "singularName": "course",
    "pluralName": "courses",
    "displayName": "Course",
    "description": "Course catalog"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "richtext"
    },
    "price": {
      "type": "decimal"
    },
    "duration": {
      "type": "string"
    },
    "lessons": {
      "type": "integer"
    },
    "category": {
      "type": "string"
    },
    "rating": {
      "type": "decimal",
      "default": 5.0
    },
    "visible": {
      "type": "boolean",
      "default": true
    }
  }
}
EOF

# Create About Page schema
cat > src/api/about-page/content-types/about-page/schema.json << 'EOF'
{
  "kind": "singleType",
  "collectionName": "about_pages",
  "info": {
    "singularName": "about-page",
    "pluralName": "about-pages",
    "displayName": "About Page",
    "description": "About Us page content"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "heroTitle": {
      "type": "string"
    },
    "heroSubtitle": {
      "type": "string"
    },
    "missionTitle": {
      "type": "string"
    },
    "missionDescription": {
      "type": "text"
    },
    "visionTitle": {
      "type": "string"
    },
    "visionDescription": {
      "type": "text"
    },
    "values": {
      "type": "json"
    }
  }
}
EOF

# Create Contact Page schema
cat > src/api/contact-page/content-types/contact-page/schema.json << 'EOF'
{
  "kind": "singleType",
  "collectionName": "contact_pages",
  "info": {
    "singularName": "contact-page",
    "pluralName": "contact-pages",
    "displayName": "Contact Page",
    "description": "Contact information"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "phone": {
      "type": "string"
    },
    "email": {
      "type": "email"
    },
    "address": {
      "type": "text"
    },
    "officeHours": {
      "type": "string"
    },
    "mapUrl": {
      "type": "string"
    }
  }
}
EOF

# Create Blog Post schema
cat > src/api/blog-post/content-types/blog-post/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "blog_posts",
  "info": {
    "singularName": "blog-post",
    "pluralName": "blog-posts",
    "displayName": "Blog Post",
    "description": "Blog articles"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "title"
    },
    "excerpt": {
      "type": "text"
    },
    "content": {
      "type": "richtext"
    },
    "author": {
      "type": "string"
    },
    "category": {
      "type": "string"
    },
    "featuredImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "publishedAt": {
      "type": "datetime"
    }
  }
}
EOF

# Create Pricing Plan schema
cat > src/api/pricing-plan/content-types/pricing-plan/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "pricing_plans",
  "info": {
    "singularName": "pricing-plan",
    "pluralName": "pricing-plans",
    "displayName": "Pricing Plan",
    "description": "Subscription plans"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "price": {
      "type": "decimal"
    },
    "period": {
      "type": "string"
    },
    "description": {
      "type": "text"
    },
    "features": {
      "type": "json"
    },
    "featured": {
      "type": "boolean",
      "default": false
    },
    "ctaText": {
      "type": "string"
    },
    "order": {
      "type": "integer"
    }
  }
}
EOF

# Create Teacher schema
cat > src/api/teacher/content-types/teacher/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "teachers",
  "info": {
    "singularName": "teacher",
    "pluralName": "teachers",
    "displayName": "Teacher",
    "description": "Instructors and staff"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "role": {
      "type": "string"
    },
    "bio": {
      "type": "text"
    },
    "photo": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "expertise": {
      "type": "json"
    },
    "linkedin": {
      "type": "string"
    },
    "twitter": {
      "type": "string"
    },
    "order": {
      "type": "integer"
    }
  }
}
EOF

# Create Job Posting schema
cat > src/api/job-posting/content-types/job-posting/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "job_postings",
  "info": {
    "singularName": "job-posting",
    "pluralName": "job-postings",
    "displayName": "Job Posting",
    "description": "Career opportunities"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "company": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "type": {
      "type": "string"
    },
    "description": {
      "type": "richtext"
    },
    "requirements": {
      "type": "json"
    },
    "applyUrl": {
      "type": "string"
    }
  }
}
EOF

# Create Career Resource schema
cat > src/api/career-resource/content-types/career-resource/schema.json << 'EOF'
{
  "kind": "collectionType",
  "collectionName": "career_resources",
  "info": {
    "singularName": "career-resource",
    "pluralName": "career-resources",
    "displayName": "Career Resource",
    "description": "Career development materials"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {},
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "type": {
      "type": "string"
    },
    "downloadUrl": {
      "type": "string"
    }
  }
}
EOF

# Create controllers
echo "📝 Creating controllers..."

# Course controller
cat > src/api/course/controllers/course.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::course.course');
EOF

# About Page controller
cat > src/api/about-page/controllers/about-page.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::about-page.about-page');
EOF

# Contact Page controller
cat > src/api/contact-page/controllers/contact-page.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact-page.contact-page');
EOF

# Blog Post controller
cat > src/api/blog-post/controllers/blog-post.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::blog-post.blog-post');
EOF

# Pricing Plan controller
cat > src/api/pricing-plan/controllers/pricing-plan.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::pricing-plan.pricing-plan');
EOF

# Teacher controller
cat > src/api/teacher/controllers/teacher.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::teacher.teacher');
EOF

# Job Posting controller
cat > src/api/job-posting/controllers/job-posting.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::job-posting.job-posting');
EOF

# Career Resource controller
cat > src/api/career-resource/controllers/career-resource.js << 'EOF'
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::career-resource.career-resource');
EOF

# Create services
echo "🔧 Creating services..."

# Course service
cat > src/api/course/services/course.js << 'EOF'
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::course.course');
EOF

# About Page service
cat > src/api/about-page/services/about-page.js << 'EOF'
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::about-page.about-page');
EOF

# Contact Page service
cat > src/api/contact-page/services/contact-page.js << 'EOF'
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::contact-page.contact-page');
EOF

# Blog Post service
cat > src/api/blog-post/services/blog-post.js << 'EOF'
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::blog-post.blog-post');
EOF

# Pricing Plan service
cat > src/api/pricing-plan/services/pricing-plan.js << 'EOF'
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pricing-plan.pricing-plan');
EOF

# Teacher service
cat > src/api/teacher/services/teacher.js << 'EOF'
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::teacher.teacher');
EOF

# Job Posting service
cat > src/api/job-posting/services/job-posting.js << 'EOF'
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::job-posting.job-posting');
EOF

# Career Resource service
cat > src/api/career-resource/services/career-resource.js << 'EOF'
'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::career-resource.career-resource');
EOF

# Create routes
echo "🛣️ Creating routes..."

# Course routes
cat > src/api/course/routes/course.js << 'EOF'
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::course.course');
EOF

# About Page routes
cat > src/api/about-page/routes/about-page.js << 'EOF'
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::about-page.about-page');
EOF

# Contact Page routes
cat > src/api/contact-page/routes/contact-page.js << 'EOF'
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::contact-page.contact-page');
EOF

# Blog Post routes
cat > src/api/blog-post/routes/blog-post.js << 'EOF'
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::blog-post.blog-post');
EOF

# Pricing Plan routes
cat > src/api/pricing-plan/routes/pricing-plan.js << 'EOF'
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::pricing-plan.pricing-plan');
EOF

# Teacher routes
cat > src/api/teacher/routes/teacher.js << 'EOF'
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::teacher.teacher');
EOF

# Job Posting routes
cat > src/api/job-posting/routes/job-posting.js << 'EOF'
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::job-posting.job-posting');
EOF

# Career Resource routes
cat > src/api/career-resource/routes/career-resource.js << 'EOF'
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::career-resource.career-resource');
EOF

echo "✅ All content types created!"
echo ""
echo "🔄 Restarting Strapi to apply changes..."
echo ""
echo "Please restart Strapi with: npm run develop"
echo ""
echo "📊 New Content Types Available:"
echo "  - Courses (Collection)"
echo "  - About Page (Single)"
echo "  - Contact Page (Single)"
echo "  - Blog Posts (Collection)"
echo "  - Pricing Plans (Collection)"
echo "  - Teachers (Collection)"
echo "  - Job Postings (Collection)"
echo "  - Career Resources (Collection)"
echo ""
echo "🎯 Next Steps:"
echo "1. Restart Strapi: cd strapi-fresh && npm run develop"
echo "2. Go to Admin Panel: http://localhost:1337/admin"
echo "3. Configure permissions for each content type"
echo "4. Add sample content"
echo "5. Include strapi-master-integration.js in all HTML pages"