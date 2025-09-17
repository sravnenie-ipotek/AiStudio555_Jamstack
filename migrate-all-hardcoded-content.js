const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('railway');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aistudio_db',
    ssl: isProduction ? {
        rejectUnauthorized: false
    } : undefined
});

console.log('🚀 Starting complete hardcoded content migration to database...\n');

async function migrateAllContent() {
    try {
        // Update hero section with all hardcoded values including ticker
        console.log('📝 Updating hero section with ticker and all content...');
        const heroUpdate = await pool.query(`
            UPDATE nd_home
            SET content_en = content_en || $1::jsonb
            WHERE section_key = 'hero'
        `, [JSON.stringify({
            ticker: [
                "Start Learning",
                "Browse Courses"
            ],
            stats: [
                { value: "100+", label: "Total Courses Taught" },
                { value: "500+", label: "Total Happy Learners" },
                { value: "10+", label: "Years Of Experience" }
            ]
        })]);
        console.log('✅ Hero section updated with ticker and stats');

        // Add navigation section
        console.log('📝 Adding navigation section...');
        await pool.query(`
            INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he)
            VALUES ('navigation', 'menu', $1, '{}', '{}')
            ON CONFLICT (section_key)
            DO UPDATE SET content_en = EXCLUDED.content_en
        `, [JSON.stringify({
            items: [
                { text: "Home", url: "home.html", active: true },
                { text: "Courses", url: "courses.html" },
                { text: "Pricing", url: "pricing.html" },
                { text: "About us", url: "#", dropdown: [
                    { text: "Courses Single", url: "courses-single.html" },
                    { text: "Pricing Single", url: "pricing-single.html" }
                ]},
                { text: "Blog", url: "blog.html" },
                { text: "Pages", url: "#", dropdown: [
                    { text: "Contact Us", url: "contact.html" },
                    { text: "Blogs", url: "blogs.html" },
                    { text: "Blog details", url: "blog-details.html" },
                    { text: "Sign in", url: "signin.html" },
                    { text: "Sign up", url: "signup.html" },
                    { text: "Forget password", url: "forgot-password.html" },
                    { text: "Reset password", url: "reset-password.html" }
                ]},
                { text: "Utility Pages", url: "#", dropdown: [
                    { text: "Style Guide", url: "style-guide.html" },
                    { text: "404 Not Found", url: "404.html" },
                    { text: "Password Protected", url: "password-protected.html" },
                    { text: "Licenses", url: "licenses.html" },
                    { text: "Changelog", url: "changelog.html" }
                ]}
            ],
            cta_button: "Sign Up Today"
        })]);
        console.log('✅ Navigation section added');

        // Update about section with complete content
        console.log('📝 Updating about section with counter stats...');
        const aboutUpdate = await pool.query(`
            UPDATE nd_home
            SET content_en = content_en || $1::jsonb
            WHERE section_key = 'about'
        `, [JSON.stringify({
            counters: [
                { value: "100", suffix: "+", label: "Total Courses Taught" },
                { value: "500", suffix: "+", label: "Total Happy Learners" },
                { value: "10", suffix: "+", label: "Years Of Experience" }
            ],
            subtitle: "Meet Your Mentor",
            main_title: "Get To Know Your Pathway To Mastery.",
            mentor_name: "Mrs. Sarah Johnson",
            description: "With over a decade of experience in the tech industry, mentor has dedicated their career to empowering learners.",
            extended_description: "Providing hands-on, real-world training and mentorship, i aim to bridge gap between theoretical knowledge & practical application, ensuring that every student can confidently apply their skills.",
            button_text: "Discover Courses",
            button_url: "courses.html"
        })]);
        console.log('✅ About section updated');

        // Update features section with additional hardcoded text
        console.log('📝 Updating features section...');
        const featuresUpdate = await pool.query(`
            UPDATE nd_home
            SET content_en = content_en || $1::jsonb
            WHERE section_key = 'features'
        `, [JSON.stringify({
            subtitle: "Featured Courses",
            title: "What Makes Zohacous Your Best Choice.",
            description: "Dive into a world of learning with diverse and extensive range of tech courses designed to cater to every interest.",
            items: [
                {
                    icon: "images/why-choose-us-icon1.svg",
                    title: "Innovative Teaching Methods Here.",
                    description: "Utilizes cutting-edge teaching techniques & tools deliver engaging interactive & effective learning."
                },
                {
                    icon: "images/why-choose-us-icon2.svg",
                    title: "Certified Professional In Your Needs.",
                    description: "Numerous industry certification from leading organizations ensuring that the guidance."
                },
                {
                    icon: "images/why-choose-us-icon3.svg",
                    title: "Expert Instructor Of Industry.",
                    description: "Providing hands-on, real-world training and mentorship, aim bridge gap between theoretical."
                }
            ]
        })]);
        console.log('✅ Features section updated');

        // Update testimonials section with complete reviews
        console.log('📝 Updating testimonials section...');
        const testimonialsUpdate = await pool.query(`
            UPDATE nd_home
            SET content_en = content_en || $1::jsonb
            WHERE section_key = 'testimonials'
        `, [JSON.stringify({
            subtitle: "Testimonials",
            title: "What Our Students Say",
            items: [
                {
                    quote: "The courses are top-notch practical approach and expert instructor made learning engaging and effective. It transformed my career. The hand on projects and personalized mentorship.",
                    author: "John Smith",
                    role: "Web Developer",
                    title: "A Game Changer for My Career"
                },
                {
                    quote: "Quality of the Content is Unmatched",
                    author: "Sarah Johnson",
                    role: "UX Designer",
                    title: "Quality of the Content is Unmatched"
                },
                {
                    quote: "Projects Were Particularly Helpful",
                    author: "Michael Chen",
                    role: "Data Scientist",
                    title: "Projects Were Particularly Helpful"
                },
                {
                    quote: "Curriculum Covered Everything",
                    author: "Emma Davis",
                    role: "Full Stack Developer",
                    title: "Curriculum Covered Everything"
                },
                {
                    quote: "Practical Approach Expert Instructor",
                    author: "Alex Wilson",
                    role: "Software Engineer",
                    title: "Practical Approach Expert Instructor"
                },
                {
                    quote: "Highly Recommend Zohacous!",
                    author: "Lisa Brown",
                    role: "Product Manager",
                    title: "Highly Recommend Zohacous!"
                },
                {
                    quote: "An Exceptional Mentorship Journey",
                    author: "David Miller",
                    role: "DevOps Engineer",
                    title: "An Exceptional Mentorship Journey"
                }
            ]
        })]);
        console.log('✅ Testimonials section updated');

        // Update process section
        console.log('📝 Adding process section...');
        await pool.query(`
            INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he)
            VALUES ('process', 'content', $1, '{}', '{}')
            ON CONFLICT (section_key)
            DO UPDATE SET content_en = EXCLUDED.content_en
        `, [JSON.stringify({
            subtitle: "Detailed Process",
            title: "Your Learning Journey With Our Experts.",
            steps: [
                {
                    number: "01",
                    title: "Choose Your Plan first.",
                    description: "Pick a subscription plan tailored to your learning goals and start your tech education journey."
                },
                {
                    number: "02",
                    title: "Access All Courses",
                    description: "Dive into any course at your own pace, explore new topics, and take advantage."
                },
                {
                    number: "03",
                    title: "Learn And Grow",
                    description: "Engage with hands-on projects, gain practical skills, and advance in your tech career."
                }
            ]
        })]);
        console.log('✅ Process section added');

        // Update awards section
        console.log('📝 Adding awards section...');
        await pool.query(`
            INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he)
            VALUES ('awards', 'content', $1, '{}', '{}')
            ON CONFLICT (section_key)
            DO UPDATE SET content_en = EXCLUDED.content_en
        `, [JSON.stringify({
            subtitle: "Prestigious Awards",
            title: "Awards That Define Our Excellence.",
            awards: [
                {
                    title: "Online Mentorship Award.",
                    description: "She has received prestigious honors \"Top Educator\" award and the \"Teaching Excellence\" award.",
                    year: "2024"
                },
                {
                    title: "Class Mentorship Program.",
                    description: "In today's digital age, remote learning has become an essential component of the educational experience. Whether for K-12, higher education.",
                    year: "2023"
                },
                {
                    title: "Excellent Remote Learning.",
                    description: "Leader Technology Training is designed to empower professionals with the skills and knowledge required to become proficient leaders.",
                    year: "2023"
                },
                {
                    title: "Leader Technology Training.",
                    description: "Leader Technology Training is designed to empower professionals with the skills and knowledge required to become proficient leaders.",
                    year: "2022"
                }
            ]
        })]);
        console.log('✅ Awards section added');

        // Update footer section with complete content
        console.log('📝 Updating footer section...');
        const footerUpdate = await pool.query(`
            UPDATE nd_home
            SET content_en = content_en || $1::jsonb
            WHERE section_key = 'footer'
        `, [JSON.stringify({
            copyright: "© Copyright -",
            brand_name: "Zohacous",
            contact: {
                phone: "(000) 012 3456 7890",
                email: "zohacous@email.com",
                address: "1234 Valencia, Suite, SF, CA"
            },
            columns: [
                {
                    title: "Menu",
                    links: [
                        { text: "About Us", url: "about.html" },
                        { text: "Courses", url: "courses.html" },
                        { text: "Course Single", url: "course-single.html" },
                        { text: "Pricing", url: "pricing.html" },
                        { text: "Pricing Single", url: "pricing-single.html" }
                    ]
                },
                {
                    title: "Pages",
                    links: [
                        { text: "Blog", url: "blog.html" },
                        { text: "Blog Single", url: "blog-single.html" },
                        { text: "Contact Us", url: "contact.html" },
                        { text: "404 Not Found", url: "404.html" },
                        { text: "Password Protected", url: "password-protected.html" }
                    ]
                },
                {
                    title: "Utility Pages",
                    links: [
                        { text: "Changelog", url: "changelog.html" },
                        { text: "License", url: "license.html" },
                        { text: "Style Guide", url: "style-guide.html" },
                        { text: "Sign Up", url: "signup.html" },
                        { text: "Sign In", url: "signin.html" },
                        { text: "Forgot Password", url: "forgot-password.html" },
                        { text: "Reset Password", url: "reset-password.html" }
                    ]
                }
            ],
            newsletter: {
                title: "Subscribe Newsletter",
                placeholder: "Enter your email",
                button_text: "Subscribe"
            }
        })]);
        console.log('✅ Footer section updated');

        // Add misc content section for other scattered text
        console.log('📝 Adding miscellaneous content section...');
        await pool.query(`
            INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he)
            VALUES ('misc', 'content', $1, '{}', '{}')
            ON CONFLICT (section_key)
            DO UPDATE SET content_en = EXCLUDED.content_en
        `, [JSON.stringify({
            page_titles: {
                home: "Unlock Potential With Proven Courses.",
                courses: "Browse Our Tech Course Categories.",
                about: "Get To Know Your Pathway To Mastery.",
                pricing: "Invest in Future with Subscription Plans.",
                blog: "News & Articles",
                contact: "Contact",
                faq: "FAQ & Answer"
            },
            hero_descriptions: {
                main: "Elevate tech career with expert-led courses. if you're just aiming to advance skills, practical training is designed.",
                short: "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed."
            },
            buttons_global: [
                "Sign Up Today",
                "get in touch",
                "Check Out Courses",
                "Continue to Checkout",
                "Discover Courses",
                "Uncover All Courses",
                "Start Learning Today"
            ],
            misc_labels: [
                "Your Cart",
                "Expert-Led Learning",
                "Discover A World Of Learning Opportunities."
            ]
        })]);
        console.log('✅ Miscellaneous content section added');

        console.log('\n🎯 All hardcoded content successfully migrated to database!');
        console.log('📊 Total sections updated/added: 10');
        console.log('✨ The page should now be fully dynamic!\n');

    } catch (error) {
        console.error('❌ Error during migration:', error);
    } finally {
        await pool.end();
    }
}

// Run the migration
migrateAllContent();