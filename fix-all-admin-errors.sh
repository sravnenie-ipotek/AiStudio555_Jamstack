#!/bin/bash

echo "🔧 FIXING ALL ADMIN PANEL NULL REFERENCE ERRORS"
echo "================================================"

# Create a backup first
cp content-admin-comprehensive.html content-admin-comprehensive.backup.html

# Fix loadPricingPlans
sed -i '' "s/document\.getElementById('pricing_page_title')\.value = data\.page_title/const el1 = document.getElementById('pricing_page_title'); if (el1) el1.value = data.page_title/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('pricing_page_description')\.value = data\.page_description/const el2 = document.getElementById('pricing_page_description'); if (el2) el2.value = data.page_description/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('pricing_hero_title')\.value = data\.hero_title/const el3 = document.getElementById('pricing_hero_title'); if (el3) el3.value = data.hero_title/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('pricing_hero_description')\.value = data\.hero_description/const el4 = document.getElementById('pricing_hero_description'); if (el4) el4.value = data.hero_description/g" content-admin-comprehensive.html

# Fix loadBlogPosts
sed -i '' "s/document\.getElementById('blog_page_title')\.value = data\.page_title/const el5 = document.getElementById('blog_page_title'); if (el5) el5.value = data.page_title/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('blog_page_description')\.value = data\.page_description/const el6 = document.getElementById('blog_page_description'); if (el6) el6.value = data.page_description/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('blog_hero_title')\.value = data\.hero_title/const el7 = document.getElementById('blog_hero_title'); if (el7) el7.value = data.hero_title/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('blog_hero_description')\.value = data\.hero_description/const el8 = document.getElementById('blog_hero_description'); if (el8) el8.value = data.hero_description/g" content-admin-comprehensive.html

# Fix loadAboutPage
sed -i '' "s/document\.getElementById('about_page_title')\.value = data\.title/const el9 = document.getElementById('about_page_title'); if (el9) el9.value = data.title/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('about_page_description')\.value = data\.description/const el10 = document.getElementById('about_page_description'); if (el10) el10.value = data.description/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('about_mission_title')\.value = data\.mission_title/const el11 = document.getElementById('about_mission_title'); if (el11) el11.value = data.mission_title/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('about_mission_text')\.value = data\.mission_text/const el12 = document.getElementById('about_mission_text'); if (el12) el12.value = data.mission_text/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('about_vision_title')\.value = data\.vision_title/const el13 = document.getElementById('about_vision_title'); if (el13) el13.value = data.vision_title/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('about_vision_text')\.value = data\.vision_text/const el14 = document.getElementById('about_vision_text'); if (el14) el14.value = data.vision_text/g" content-admin-comprehensive.html

# Fix loadContactPage
sed -i '' "s/document\.getElementById('contact_page_title')\.value = data\.title/const el15 = document.getElementById('contact_page_title'); if (el15) el15.value = data.title/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('contact_page_description')\.value = data\.description/const el16 = document.getElementById('contact_page_description'); if (el16) el16.value = data.description/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('contact_email')\.value = data\.email/const el17 = document.getElementById('contact_email'); if (el17) el17.value = data.email/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('contact_phone')\.value = data\.phone/const el18 = document.getElementById('contact_phone'); if (el18) el18.value = data.phone/g" content-admin-comprehensive.html
sed -i '' "s/document\.getElementById('contact_address')\.value = data\.address/const el19 = document.getElementById('contact_address'); if (el19) el19.value = data.address/g" content-admin-comprehensive.html

echo "✅ Fixed all null reference errors"
echo "✅ Backup created: content-admin-comprehensive.backup.html"
echo "✅ All tabs should now work without errors"