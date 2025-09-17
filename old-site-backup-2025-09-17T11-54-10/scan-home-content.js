const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

async function scanHomeContent() {
    console.log('🔍 Scanning home.html for ALL hardcoded content...\n');

    const htmlPath = path.join(__dirname, 'nd', 'home.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    const content = {
        hero: {
            subtitle: $('.banner-subtitle').first().text().trim(),
            title: $('.banner-heading').text().trim(),
            description: $('.banner-description-text').text().trim(),
            button_text: $('.banner-button-wrapper .primary-button-text-block').first().text().trim(),
            stats: []
        },
        features: {
            subtitle: $('.choose-us .section-subtitle').text().trim(),
            title: $('.choose-us .section-title').text().trim(),
            items: []
        },
        about: {
            subtitle: $('.about-us .section-subtitle').text().trim(),
            title: $('.about-us .section-title').text().trim(),
            description: $('.about-us .section-description-text').text().trim(),
            button_text: $('.about-us .primary-button-text-block').first().text().trim()
        },
        courses: {
            subtitle: $('.courses .section-subtitle').text().trim(),
            title: $('.courses .section-title').text().trim(),
            items: []
        },
        testimonials: {
            subtitle: $('.testimonial .section-subtitle').text().trim(),
            title: $('.testimonial .section-title').text().trim(),
            items: []
        },
        blog: {
            subtitle: $('.blog .section-subtitle').text().trim(),
            title: $('.blog .section-title').text().trim(),
            items: []
        },
        cta: {
            title: $('.cta-banner-title').text().trim(),
            description: $('.cta-banner-description').text().trim(),
            button_text: $('.cta-banner .white-button-text').text().trim()
        },
        pricing: {
            subtitle: $('.pricing .section-subtitle').text().trim(),
            title: $('.pricing .section-title').text().trim(),
            plans: []
        },
        faq: {
            subtitle: $('.faq .section-subtitle').text().trim(),
            title: $('.faq .section-title').text().trim(),
            items: []
        },
        footer: {
            about_text: $('.footer-about-text').text().trim(),
            links: [],
            contact: {}
        }
    };

    // Extract Hero Stats
    $('.banner-feature-card').each((i, elem) => {
        const $card = $(elem);
        content.hero.stats.push({
            number: $card.find('.banner-feature-title').text().trim(),
            label: $card.find('.banner-feature-caption').text().replace(/\s+/g, ' ').trim()
        });
    });

    // Extract Feature Cards
    $('.choose-us-card').each((i, elem) => {
        const $card = $(elem);
        content.features.items.push({
            icon: $card.find('.choose-us-card-icon').attr('src') || '',
            title: $card.find('.choose-us-card-title').text().trim(),
            description: $card.find('.choose-us-card-caption').text().trim()
        });
    });

    // Extract Course Cards
    $('.courses-card').each((i, elem) => {
        const $card = $(elem);
        content.courses.items.push({
            image: $card.find('.courses-card-image').attr('src') || '',
            rating: $card.find('.courses-card-star-rate').text().trim(),
            reviews: $card.find('.courses-card-reviews').text().trim(),
            title: $card.find('.courses-card-title').text().trim(),
            price: $card.find('.courses-card-price').first().text().trim(),
            old_price: $card.find('.courses-card-price.prev-price').text().trim(),
            duration: $card.find('.courses-card-time').text().trim()
        });
    });

    // Extract Testimonials
    $('.testimonial-card').each((i, elem) => {
        const $card = $(elem);
        content.testimonials.items.push({
            text: $card.find('.testimonial-card-text').text().trim(),
            name: $card.find('.testimonial-person-name').text().trim(),
            role: $card.find('.testimonial-person-role').text().trim(),
            image: $('.testimonial-tab-link-image').eq(i).attr('src') || ''
        });
    });

    // Extract Blog Posts
    $('.blog-card').each((i, elem) => {
        const $card = $(elem);
        content.blog.items.push({
            image: $card.find('.blog-card-image').attr('src') || '',
            date: $card.find('.blog-card-date-text').text().trim(),
            author: $card.find('.blog-card-admin-text').text().trim(),
            title: $card.find('.blog-card-title').text().trim()
        });
    });

    // Extract Pricing Plans
    $('.pricing-plan-card').each((i, elem) => {
        const $card = $(elem);
        const features = [];
        $card.find('.pricing-plan-featured-single').each((j, feat) => {
            features.push($(feat).find('.pricing-plan-featured-name').text().trim());
        });

        content.pricing.plans.push({
            name: $card.find('.pricing-plan-name').text().trim(),
            price: $card.find('.pricing-plan-price').text().trim(),
            period: $card.find('.pricing-pack-text').text().trim(),
            features: features,
            button_text: $card.find('.primary-button-text-block').first().text().trim()
        });
    });

    // Extract FAQ Items
    $('.faq-item').each((i, elem) => {
        const $item = $(elem);
        content.faq.items.push({
            question: $item.find('.faq-question').text().trim(),
            answer: $item.find('.faq-answer').text().trim()
        });
    });

    // Extract Footer Links
    $('.footer-menu-wrapper').each((i, elem) => {
        const $menu = $(elem);
        const menuTitle = $menu.find('.footer-menu-title').text().trim();
        const links = [];

        $menu.find('.footer-menu-text-link').each((j, link) => {
            links.push({
                text: $(link).text().trim(),
                href: $(link).attr('href') || '#'
            });
        });

        if (menuTitle && links.length > 0) {
            content.footer.links.push({
                title: menuTitle,
                items: links
            });
        }
    });

    // Extract Footer Contact
    content.footer.contact = {
        phone: $('.footer-contact-details-text').eq(0).text().trim(),
        email: $('.footer-contact-details-text').eq(1).text().trim(),
        address: $('.footer-contact-details-text').eq(2).text().trim()
    };

    // Save the extracted content
    fs.writeFileSync('nd-extracted-content.json', JSON.stringify(content, null, 2));

    // Generate summary
    console.log('📊 Content Extraction Summary:\n');
    console.log('✅ Hero Section:');
    console.log(`   - Title: "${content.hero.title}"`);
    console.log(`   - Stats: ${content.hero.stats.length} items`);

    console.log('\n✅ Features Section:');
    console.log(`   - ${content.features.items.length} feature cards`);

    console.log('\n✅ Courses Section:');
    console.log(`   - ${content.courses.items.length} course cards`);
    if (content.courses.items.length > 0) {
        console.log('   Sample courses:');
        content.courses.items.slice(0, 3).forEach(course => {
            console.log(`     • ${course.title} - ${course.price}`);
        });
    }

    console.log('\n✅ Testimonials:');
    console.log(`   - ${content.testimonials.items.length} testimonials`);

    console.log('\n✅ Blog Posts:');
    console.log(`   - ${content.blog.items.length} blog articles`);

    console.log('\n✅ Pricing Plans:');
    console.log(`   - ${content.pricing.plans.length} plans`);

    console.log('\n✅ FAQ Section:');
    console.log(`   - ${content.faq.items.length} Q&A items`);

    console.log('\n✅ Footer:');
    console.log(`   - ${content.footer.links.length} link sections`);
    console.log(`   - Contact info included`);

    console.log('\n💾 Full content saved to: nd-extracted-content.json');
    console.log('\n🎯 Next step: Update database schema and populate with this content');

    return content;
}

// Run the scan
scanHomeContent()
    .then(() => {
        console.log('\n✅ Scan complete!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });