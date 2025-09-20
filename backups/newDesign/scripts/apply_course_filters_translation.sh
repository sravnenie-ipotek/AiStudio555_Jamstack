#!/bin/bash

# Script to apply missing Russian translations for course filter tabs
# This fixes the mixed language issue in the featured courses section

API_URL="http://localhost:1337/api/nd/home-page/courses"

echo "Applying Russian translations for course filters..."

curl -X PUT "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content_ru": {
      "content": {
        "filters": {
          "all": "Все",
          "web_development": "Веб-разработка",
          "app_development": "Разработка приложений",
          "machine_learning": "Машинное обучение",
          "cloud_computing": "Облачные вычисления",
          "data_science": "Наука о данных"
        }
      }
    }
  }'

echo ""
echo "Testing the update..."
curl -s "$API_URL?locale=ru" | jq '.content.filters'

echo ""
echo "Course filter translations applied successfully!"