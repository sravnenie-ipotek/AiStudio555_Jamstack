// Script to add missing Russian translations for course filter tabs

const translations = {
  misc: {
    content_ru: {
      content: {
        filters: {
          all: "Все",
          web_development: "Веб-разработка",
          app_development: "Разработка приложений",
          machine_learning: "Машинное обучение",
          cloud_computing: "Облачные вычисления",
          data_science: "Наука о данных"
        }
      }
    }
  },
  ui: {
    content_ru: {
      labels: {
        filter_all: "Все",
        filter_web_development: "Веб-разработка",
        filter_app_development: "Разработка приложений",
        filter_machine_learning: "Машинное обучение",
        filter_cloud_computing: "Облачные вычисления",
        filter_data_science: "Наука о данных"
      }
    }
  },
  courses: {
    content_ru: {
      content: {
        filters: {
          all: "Все",
          web_development: "Веб-разработка",
          app_development: "Разработка приложений",
          machine_learning: "Машинное обучение",
          cloud_computing: "Облачные вычисления",
          data_science: "Наука о данных"
        }
      }
    }
  }
};

async function updateTranslations() {
  const baseUrl = 'http://localhost:3000/api/nd/home-page';

  for (const [section, data] of Object.entries(translations)) {
    console.log(`Updating ${section} section...`);

    try {
      const response = await fetch(`${baseUrl}/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✓ ${section} updated successfully`);
      } else {
        console.log(`✗ Failed to update ${section}:`, result.message);
      }
    } catch (error) {
      console.log(`✗ Error updating ${section}:`, error.message);
    }
  }

  // Verify the updates
  console.log('\nVerifying translations...');
  try {
    const response = await fetch(`${baseUrl}?locale=ru`);
    const data = await response.json();

    console.log('\nCourses filters:', data.data?.courses?.content?.filters || 'Not found');
    console.log('UI labels:', data.data?.ui?.labels || 'Not found');
    console.log('Misc filters:', data.data?.misc?.content?.filters || 'Not found');
  } catch (error) {
    console.log('Error verifying:', error.message);
  }
}

updateTranslations();