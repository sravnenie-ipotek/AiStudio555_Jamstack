#!/bin/bash

echo "📝 Adding Strapi Master Integration to all pages..."

# List of pages to update
pages=(
  "courses.html"
  "about-us.html"
  "contact-us.html"
  "blog.html"
  "detail_blog.html"
  "pricing.html"
  "teachers.html"
  "career-center.html"
  "career-orientation.html"
  "detail_courses.html"
  "detail_course-categories.html"
  "checkout.html"
  "order-confirmation.html"
)

# Script to add before </body>
integration_script='  <!-- Strapi Master Integration -->\n  <script src="strapi-master-integration.js"></script>'

for page in "${pages[@]}"; do
  if [ -f "$page" ]; then
    # Check if already integrated
    if grep -q "strapi-master-integration.js" "$page"; then
      echo "✅ $page - Already integrated"
    else
      # Add the script before </body>
      sed -i.backup "s|</body>|${integration_script}\n</body>|" "$page"
      echo "✅ $page - Integration added"
    fi
  else
    echo "⚠️ $page - File not found"
  fi
done

echo ""
echo "✨ Integration complete!"
echo "📊 All pages now connected to Strapi CMS"
echo ""
echo "🎯 To activate:"
echo "1. Restart Strapi: cd strapi-fresh && npm run develop"
echo "2. Start frontend: python3 -m http.server 3005"
echo "3. Visit any page to see live CMS integration"