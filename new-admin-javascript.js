        // ==================== NEW GLOBAL CONTENT JAVASCRIPT FUNCTIONS ====================

        // SITE SETTINGS Functions
        async function loadSiteSettings() {
            try {
                const locale = getCurrentLanguage();
                const response = await fetch(`${API_BASE}/api/site-settings?locale=${locale}`);
                const data = await response.json();
                
                // Populate form fields
                document.getElementById('site_name').value = data.site_name || '';
                document.getElementById('site_tagline').value = data.site_tagline || '';
                document.getElementById('logo_url').value = data.logo_url || '';
                document.getElementById('logo_alt_text').value = data.logo_alt_text || '';
                document.getElementById('primary_color').value = data.primary_color || '#007aff';
                document.getElementById('secondary_color').value = data.secondary_color || '#667eea';
                document.getElementById('footer_email').value = data.footer_email || '';
                document.getElementById('footer_phone').value = data.footer_phone || '';
                document.getElementById('footer_address').value = data.footer_address || '';
                document.getElementById('footer_copyright').value = data.footer_copyright || '';
                document.getElementById('facebook_url').value = data.facebook_url || '';
                document.getElementById('twitter_url').value = data.twitter_url || '';
                document.getElementById('instagram_url').value = data.instagram_url || '';
                document.getElementById('linkedin_url').value = data.linkedin_url || '';
                document.getElementById('youtube_url').value = data.youtube_url || '';
                document.getElementById('whatsapp_number').value = data.whatsapp_number || '';
                document.getElementById('meta_description').value = data.meta_description || '';
                document.getElementById('meta_keywords').value = data.meta_keywords || '';
                document.getElementById('google_analytics_id').value = data.google_analytics_id || '';
                document.getElementById('facebook_pixel_id').value = data.facebook_pixel_id || '';
                
                document.getElementById('status').innerHTML = '✅ Site Settings loaded successfully!';
            } catch (error) {
                console.error('Error loading site settings:', error);
                document.getElementById('status').innerHTML = '❌ Failed to load site settings';
            }
        }

        async function saveSiteSettings() {
            try {
                const locale = getCurrentLanguage();
                const data = {
                    site_name: document.getElementById('site_name').value,
                    site_tagline: document.getElementById('site_tagline').value,
                    logo_url: document.getElementById('logo_url').value,
                    logo_alt_text: document.getElementById('logo_alt_text').value,
                    primary_color: document.getElementById('primary_color').value,
                    secondary_color: document.getElementById('secondary_color').value,
                    footer_email: document.getElementById('footer_email').value,
                    footer_phone: document.getElementById('footer_phone').value,
                    footer_address: document.getElementById('footer_address').value,
                    footer_copyright: document.getElementById('footer_copyright').value,
                    facebook_url: document.getElementById('facebook_url').value,
                    twitter_url: document.getElementById('twitter_url').value,
                    instagram_url: document.getElementById('instagram_url').value,
                    linkedin_url: document.getElementById('linkedin_url').value,
                    youtube_url: document.getElementById('youtube_url').value,
                    whatsapp_number: document.getElementById('whatsapp_number').value,
                    meta_description: document.getElementById('meta_description').value,
                    meta_keywords: document.getElementById('meta_keywords').value,
                    google_analytics_id: document.getElementById('google_analytics_id').value,
                    facebook_pixel_id: document.getElementById('facebook_pixel_id').value
                };

                const response = await fetch(`${API_BASE}/api/site-settings?locale=${locale}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById('status').innerHTML = '✅ Site Settings saved successfully!';
                } else {
                    throw new Error('Failed to save site settings');
                }
            } catch (error) {
                console.error('Error saving site settings:', error);
                document.getElementById('status').innerHTML = '❌ Failed to save site settings';
            }
        }

        // NAVIGATION MENU Functions
        async function loadNavigationMenu() {
            try {
                const locale = getCurrentLanguage();
                const response = await fetch(`${API_BASE}/api/navigation-menu?locale=${locale}&type=main`);
                const data = await response.json();
                
                // Populate form fields
                document.getElementById('home_label').value = data.home_label || 'Home';
                document.getElementById('home_url').value = data.home_url || '/home.html';
                document.getElementById('about_label').value = data.about_label || 'About';
                document.getElementById('about_url').value = data.about_url || '/about-us.html';
                document.getElementById('courses_label').value = data.courses_label || 'Courses';
                document.getElementById('courses_url').value = data.courses_url || '/courses.html';
                document.getElementById('teachers_label').value = data.teachers_label || 'Teachers';
                document.getElementById('teachers_url').value = data.teachers_url || '/teachers.html';
                document.getElementById('contact_label').value = data.contact_label || 'Contact';
                document.getElementById('contact_url').value = data.contact_url || '/contact-us.html';
                document.getElementById('career_services_label').value = data.career_services_label || 'Career Services';
                document.getElementById('career_center_label').value = data.career_center_label || 'Career Center';
                document.getElementById('career_center_url').value = data.career_center_url || '/career-center.html';
                document.getElementById('career_orientation_label').value = data.career_orientation_label || 'Career Orientation';
                document.getElementById('career_orientation_url').value = data.career_orientation_url || '/career-orientation.html';
                
                document.getElementById('status').innerHTML = '✅ Navigation Menu loaded successfully!';
            } catch (error) {
                console.error('Error loading navigation menu:', error);
                document.getElementById('status').innerHTML = '❌ Failed to load navigation menu';
            }
        }

        async function saveNavigationMenu() {
            try {
                const locale = getCurrentLanguage();
                const data = {
                    menu_type: 'main',
                    home_label: document.getElementById('home_label').value,
                    home_url: document.getElementById('home_url').value,
                    about_label: document.getElementById('about_label').value,
                    about_url: document.getElementById('about_url').value,
                    courses_label: document.getElementById('courses_label').value,
                    courses_url: document.getElementById('courses_url').value,
                    teachers_label: document.getElementById('teachers_label').value,
                    teachers_url: document.getElementById('teachers_url').value,
                    contact_label: document.getElementById('contact_label').value,
                    contact_url: document.getElementById('contact_url').value,
                    career_services_label: document.getElementById('career_services_label').value,
                    career_center_label: document.getElementById('career_center_label').value,
                    career_center_url: document.getElementById('career_center_url').value,
                    career_orientation_label: document.getElementById('career_orientation_label').value,
                    career_orientation_url: document.getElementById('career_orientation_url').value
                };

                const response = await fetch(`${API_BASE}/api/navigation-menu?locale=${locale}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById('status').innerHTML = '✅ Navigation Menu saved successfully!';
                } else {
                    throw new Error('Failed to save navigation menu');
                }
            } catch (error) {
                console.error('Error saving navigation menu:', error);
                document.getElementById('status').innerHTML = '❌ Failed to save navigation menu';
            }
        }

        // STATISTICS Functions
        async function loadStatistics() {
            try {
                const locale = getCurrentLanguage();
                const response = await fetch(`${API_BASE}/api/statistics?locale=${locale}`);
                const data = await response.json();
                
                // Populate form fields
                document.getElementById('stats_section_title').value = data.stats_section_title || 'Our Impact';
                document.getElementById('stats_section_subtitle').value = data.stats_section_subtitle || 'Trusted by thousands of learners worldwide';
                document.getElementById('stats_visible').checked = data.stats_visible !== false;
                document.getElementById('courses_count').value = data.courses_count || '125+';
                document.getElementById('courses_label').value = data.courses_label || 'Courses';
                document.getElementById('learners_count').value = data.learners_count || '14,000+';
                document.getElementById('learners_label').value = data.learners_label || 'Learners';
                document.getElementById('years_count').value = data.years_count || '10+';
                document.getElementById('years_label').value = data.years_label || 'Years';
                document.getElementById('instructors_count').value = data.instructors_count || '';
                document.getElementById('instructors_label').value = data.instructors_label || 'Expert Instructors';
                document.getElementById('success_rate').value = data.success_rate || '';
                document.getElementById('success_rate_label').value = data.success_rate_label || 'Success Rate';
                
                document.getElementById('status').innerHTML = '✅ Statistics loaded successfully!';
            } catch (error) {
                console.error('Error loading statistics:', error);
                document.getElementById('status').innerHTML = '❌ Failed to load statistics';
            }
        }

        async function saveStatistics() {
            try {
                const locale = getCurrentLanguage();
                const data = {
                    stats_section_title: document.getElementById('stats_section_title').value,
                    stats_section_subtitle: document.getElementById('stats_section_subtitle').value,
                    stats_visible: document.getElementById('stats_visible').checked,
                    courses_count: document.getElementById('courses_count').value,
                    courses_label: document.getElementById('courses_label').value,
                    learners_count: document.getElementById('learners_count').value,
                    learners_label: document.getElementById('learners_label').value,
                    years_count: document.getElementById('years_count').value,
                    years_label: document.getElementById('years_label').value,
                    instructors_count: document.getElementById('instructors_count').value,
                    instructors_label: document.getElementById('instructors_label').value,
                    success_rate: document.getElementById('success_rate').value,
                    success_rate_label: document.getElementById('success_rate_label').value
                };

                const response = await fetch(`${API_BASE}/api/statistics?locale=${locale}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById('status').innerHTML = '✅ Statistics saved successfully!';
                } else {
                    throw new Error('Failed to save statistics');
                }
            } catch (error) {
                console.error('Error saving statistics:', error);
                document.getElementById('status').innerHTML = '❌ Failed to save statistics';
            }
        }

        // BUTTON TEXTS Functions
        async function loadButtonTexts() {
            try {
                const locale = getCurrentLanguage();
                const response = await fetch(`${API_BASE}/api/button-texts?locale=${locale}`);
                const data = await response.json();
                
                // Populate form fields
                document.getElementById('hero_primary_button').value = data.hero_primary_button || 'Get Started';
                document.getElementById('hero_secondary_button').value = data.hero_secondary_button || 'Explore Courses';
                document.getElementById('courses_view_all_button').value = data.courses_view_all_button || 'View All Courses';
                document.getElementById('about_learn_more_button').value = data.about_learn_more_button || 'Learn More About Us';
                document.getElementById('course_enroll_button').value = data.course_enroll_button || 'Enroll Now';
                document.getElementById('course_learn_more_button').value = data.course_learn_more_button || 'Learn More';
                document.getElementById('course_preview_button').value = data.course_preview_button || 'Preview Course';
                document.getElementById('course_wishlist_button').value = data.course_wishlist_button || 'Add to Wishlist';
                document.getElementById('contact_send_button').value = data.contact_send_button || 'Send Message';
                document.getElementById('newsletter_subscribe_button').value = data.newsletter_subscribe_button || 'Subscribe';
                document.getElementById('apply_now_button').value = data.apply_now_button || 'Apply Now';
                document.getElementById('schedule_consultation_button').value = data.schedule_consultation_button || 'Schedule Consultation';
                document.getElementById('back_button').value = data.back_button || 'Back';
                document.getElementById('next_button').value = data.next_button || 'Next';
                document.getElementById('submit_button').value = data.submit_button || 'Submit';
                document.getElementById('cancel_button').value = data.cancel_button || 'Cancel';
                
                document.getElementById('status').innerHTML = '✅ Button Texts loaded successfully!';
            } catch (error) {
                console.error('Error loading button texts:', error);
                document.getElementById('status').innerHTML = '❌ Failed to load button texts';
            }
        }

        async function saveButtonTexts() {
            try {
                const locale = getCurrentLanguage();
                const data = {
                    hero_primary_button: document.getElementById('hero_primary_button').value,
                    hero_secondary_button: document.getElementById('hero_secondary_button').value,
                    courses_view_all_button: document.getElementById('courses_view_all_button').value,
                    about_learn_more_button: document.getElementById('about_learn_more_button').value,
                    course_enroll_button: document.getElementById('course_enroll_button').value,
                    course_learn_more_button: document.getElementById('course_learn_more_button').value,
                    course_preview_button: document.getElementById('course_preview_button').value,
                    course_wishlist_button: document.getElementById('course_wishlist_button').value,
                    contact_send_button: document.getElementById('contact_send_button').value,
                    newsletter_subscribe_button: document.getElementById('newsletter_subscribe_button').value,
                    apply_now_button: document.getElementById('apply_now_button').value,
                    schedule_consultation_button: document.getElementById('schedule_consultation_button').value,
                    back_button: document.getElementById('back_button').value,
                    next_button: document.getElementById('next_button').value,
                    submit_button: document.getElementById('submit_button').value,
                    cancel_button: document.getElementById('cancel_button').value
                };

                const response = await fetch(`${API_BASE}/api/button-texts?locale=${locale}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById('status').innerHTML = '✅ Button Texts saved successfully!';
                } else {
                    throw new Error('Failed to save button texts');
                }
            } catch (error) {
                console.error('Error saving button texts:', error);
                document.getElementById('status').innerHTML = '❌ Failed to save button texts';
            }
        }

        // COMPANY LOGOS Functions
        async function loadCompanyLogos() {
            try {
                const locale = getCurrentLanguage();
                const response = await fetch(`${API_BASE}/api/company-logos?locale=${locale}`);
                const data = await response.json();
                
                // Populate form fields
                document.getElementById('companies_section_title').value = data.section_title || 'Trusted by Leading Companies';
                document.getElementById('companies_section_subtitle').value = data.section_subtitle || 'Our graduates work at top companies worldwide';
                document.getElementById('companies_section_visible').checked = data.section_visible !== false;
                
                // Company logos 1-8
                for (let i = 1; i <= 8; i++) {
                    document.getElementById(`company_${i}_name`).value = data[`company_${i}_name`] || '';
                    document.getElementById(`company_${i}_logo_url`).value = data[`company_${i}_logo_url`] || '';
                }
                
                document.getElementById('status').innerHTML = '✅ Company Logos loaded successfully!';
            } catch (error) {
                console.error('Error loading company logos:', error);
                document.getElementById('status').innerHTML = '❌ Failed to load company logos';
            }
        }

        async function saveCompanyLogos() {
            try {
                const locale = getCurrentLanguage();
                const data = {
                    section_title: document.getElementById('companies_section_title').value,
                    section_subtitle: document.getElementById('companies_section_subtitle').value,
                    section_visible: document.getElementById('companies_section_visible').checked
                };

                // Add company logos 1-8
                for (let i = 1; i <= 8; i++) {
                    data[`company_${i}_name`] = document.getElementById(`company_${i}_name`).value;
                    data[`company_${i}_logo_url`] = document.getElementById(`company_${i}_logo_url`).value;
                    data[`company_${i}_visible`] = document.getElementById(`company_${i}_name`).value !== '';
                }

                const response = await fetch(`${API_BASE}/api/company-logos?locale=${locale}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById('status').innerHTML = '✅ Company Logos saved successfully!';
                } else {
                    throw new Error('Failed to save company logos');
                }
            } catch (error) {
                console.error('Error saving company logos:', error);
                document.getElementById('status').innerHTML = '❌ Failed to save company logos';
            }
        }

        // RUN MIGRATION Function
        async function runMissingFieldsMigration() {
            try {
                document.getElementById('status').innerHTML = '🔄 Running missing fields migration...';
                
                const response = await fetch(`${API_BASE}/api/run-missing-fields-migration`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('status').innerHTML = '✅ Missing fields migration completed successfully!';
                    // Auto-load data for new sections
                    setTimeout(() => {
                        loadSiteSettings();
                        loadNavigationMenu();
                        loadStatistics();
                        loadButtonTexts();
                        loadCompanyLogos();
                    }, 1000);
                } else {
                    throw new Error(result.details || 'Migration failed');
                }
            } catch (error) {
                console.error('Error running migration:', error);
                document.getElementById('status').innerHTML = `❌ Migration failed: ${error.message}`;
            }
        }

        // Auto-load new content when switching to new sections
        function showSection(sectionId) {
            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show selected section
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.add('active');
            }
            
            // Add active class to selected tab
            const selectedTab = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            
            // Auto-load data for new sections
            switch (sectionId) {
                case 'site-settings':
                    loadSiteSettings();
                    break;
                case 'navigation-menu':
                    loadNavigationMenu();
                    break;
                case 'statistics':
                    loadStatistics();
                    break;
                case 'button-texts':
                    loadButtonTexts();
                    break;
                case 'company-logos':
                    loadCompanyLogos();
                    break;
            }
        }