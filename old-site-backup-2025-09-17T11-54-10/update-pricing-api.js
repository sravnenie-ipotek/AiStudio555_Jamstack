/**
 * Update pricing page content via API
 */

async function updatePricingContent() {
  try {
    const API_URL = 'http://localhost:1337/api/nd/pricing-page';

    // Define pricing content
    const pricingData = {
      plans: {
        content: {
          title: "Choose Your Learning Path",
          subtitle: "Flexible pricing plans for everyone",
          monthly_toggle: "Monthly",
          yearly_toggle: "Yearly",
          currency: "USD",
          plans: [
            {
              id: "basic",
              name: "Basic Plan",
              price_monthly: 29,
              price_yearly: 278,
              description: "Perfect for beginners starting their AI journey",
              features: [
                "Access to 50+ courses",
                "Community forum access",
                "Course completion certificates",
                "Basic support (48h response)",
                "Monthly webinars",
                "Downloadable resources"
              ],
              cta_text: "Get Started",
              cta_link: "#signup-basic",
              featured: false
            },
            {
              id: "pro",
              name: "Pro Plan",
              price_monthly: 79,
              price_yearly: 758,
              description: "For professionals serious about AI mastery",
              features: [
                "Access to ALL courses",
                "Priority community support",
                "Professional certificates",
                "Priority support (12h response)",
                "1-on-1 monthly mentoring",
                "Hands-on projects",
                "Career coaching",
                "Job placement assistance"
              ],
              cta_text: "Start Pro Trial",
              cta_link: "#signup-pro",
              featured: true,
              popular_badge: "Most Popular",
              color_scheme: "#667eea"
            },
            {
              id: "enterprise",
              name: "Enterprise",
              price_monthly: "Custom",
              price_yearly: "Custom",
              description: "Tailored solutions for teams and organizations",
              features: [
                "Everything in Pro",
                "Unlimited team members",
                "Custom learning paths",
                "Dedicated account manager",
                "Priority 24/7 support",
                "Private workshops",
                "API access",
                "Analytics dashboard"
              ],
              cta_text: "Contact Sales",
              cta_link: "#contact-enterprise",
              featured: false
            }
          ]
        },
        locale: "en"
      },
      hero: {
        content: {
          title: "Transparent Pricing for Your AI Education",
          subtitle: "Choose the plan that fits your learning goals",
          description: "Join thousands of students mastering AI with our comprehensive courses. No hidden fees, cancel anytime."
        },
        locale: "en"
      }
    };

    // Update each section
    for (const [section, data] of Object.entries(pricingData)) {
      console.log(`📝 Updating ${section} section...`);

      const response = await fetch(`${API_URL}/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ ${section} section updated successfully`);
      } else {
        console.error(`❌ Failed to update ${section}:`, await response.text());
      }
    }

    console.log('\n🎉 Pricing page content updated successfully!');

    // Test the API
    console.log('\n🔍 Fetching updated pricing data...');
    const testResponse = await fetch(API_URL);
    const testData = await testResponse.json();

    if (testData.success) {
      console.log('✅ API endpoint working correctly');
      console.log('📊 Sections available:', Object.keys(testData.data.attributes.sections));
    }

  } catch (error) {
    console.error('❌ Error updating pricing:', error);
  }
}

// Run the update
updatePricingContent();