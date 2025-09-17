const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Content extraction script for New Design home.html
class NDContentExtractor {
    constructor() {
        this.homePath = path.join(__dirname, '../backups/newDesign/home.html');
        this.sections = [];
    }

    extractHomeContent() {
        const html = fs.readFileSync(this.homePath, 'utf8');
        const $ = cheerio.load(html);

        // Extract navigation menu
        this.extractMenu($);

        // Extract banner/hero section
        this.extractHero($);

        // Extract features section
        this.extractFeatures($);

        // Extract courses section
        this.extractCourses($);

        // Extract testimonials
        this.extractTestimonials($);

        // Extract stats/numbers
        this.extractStats($);

        // Extract instructors
        this.extractInstructors($);

        // Extract pricing
        this.extractPricing($);

        // Extract blog posts
        this.extractBlogPosts($);

        // Extract CTA sections
        this.extractCTAs($);

        // Extract footer
        this.extractFooter($);

        return this.sections;
    }

    extractMenu($) {
        const menuItems = [];

        // Main navigation items
        $('.nav-link').each((index, element) => {
            const $el = $(element);
            menuItems.push({
                type: 'link',
                label: $el.text().trim(),
                url: $el.attr('href') || '#',
                parent_id: null,
                order_index: index
            });
        });

        // Dropdown items
        $('.dropdown-menu-text-link-block').each((index, element) => {
            const $el = $(element);
            const text = $el.find('div').first().text().trim();
            const url = $el.attr('href') || '#';

            menuItems.push({
                type: 'dropdown_item',
                label: text,
                url: url,
                parent_id: 'pages_dropdown', // Will need to handle parent relationships
                order_index: index
            });
        });

        this.sections.push({
            type: 'menu',
            data: menuItems
        });
    }

    extractHero($) {
        const heroSection = {
            section_key: 'hero',
            section_type: 'hero',
            content_en: {
                subtitle: $('.banner-subtitle').text().trim(),
                title: $('.banner-typography h1').text().trim(),
                description: $('.banner-typography p').text().trim(),
                buttons: [],
                stats: [],
                backgroundImages: []
            }
        };

        // Extract buttons
        $('.banner-typography .primary-button').each((i, el) => {
            const $btn = $(el);
            heroSection.content_en.buttons.push({
                text: $btn.find('.primary-button-text-block').first().text().trim(),
                url: $btn.attr('href') || '#',
                style: $btn.hasClass('is-secondary') ? 'secondary' : 'primary'
            });
        });

        // Extract stats
        $('.banner-bottom-count-item').each((i, el) => {
            const $stat = $(el);
            heroSection.content_en.stats.push({
                number: $stat.find('.banner-bottom-count-number').text().trim(),
                label: $stat.find('.banner-bottom-count-text').text().trim()
            });
        });

        // Extract images
        $('.banner-image, .banner-man-image').each((i, el) => {
            const $img = $(el);
            heroSection.content_en.backgroundImages.push({
                src: $img.attr('src') || '',
                alt: $img.attr('alt') || '',
                loading: $img.attr('loading') || 'lazy'
            });
        });

        this.sections.push(heroSection);
    }

    extractFeatures($) {
        const features = {
            section_key: 'features',
            section_type: 'grid',
            content_en: {
                subtitle: $('.section.choose-us .section-subtitle').text().trim(),
                title: $('.section.choose-us .section-title').text().trim(),
                items: []
            }
        };

        $('.choose-us-card').each((i, el) => {
            const $card = $(el);
            features.content_en.items.push({
                icon: $card.find('.choose-us-card-icon').attr('src') || '',
                title: $card.find('.choose-us-card-title').text().trim(),
                description: $card.find('.choose-us-card-caption').text().trim(),
                visible: true,
                order_index: i
            });
        });

        this.sections.push(features);
    }

    extractCourses($) {
        const courses = {
            section_key: 'courses',
            section_type: 'carousel',
            content_en: {
                subtitle: $('.section.courses .section-subtitle').text().trim(),
                title: $('.section.courses .section-title').text().trim(),
                viewAllText: 'View All Courses',
                viewAllUrl: '/courses.html',
                items: []
            }
        };

        $('.courses-card').each((i, el) => {
            const $card = $(el);
            const course = {
                image: $card.find('.courses-card-image').attr('src') || '',
                category: $card.find('.courses-card-category').text().trim(),
                title: $card.find('.courses-card-title').text().trim(),
                description: $card.find('.courses-card-caption').text().trim(),
                price: $card.find('.courses-card-price').text().trim(),
                originalPrice: $card.find('.courses-card-price.is-opacity').text().trim(),
                author: {
                    image: $card.find('.courses-card-author-image').attr('src') || '',
                    name: $card.find('.courses-card-author-name').text().trim()
                },
                rating: {
                    value: $card.find('.courses-card-review-text').text().trim(),
                    count: $card.find('.courses-card-review-text').text().match(/\((\d+)\)/)?.[1] || '0'
                },
                duration: $card.find('.courses-card-lesson').text().trim(),
                url: $card.parent().attr('href') || '#',
                visible: true,
                order_index: i
            };
            courses.content_en.items.push(course);
        });

        this.sections.push(courses);
    }

    extractTestimonials($) {
        const testimonials = {
            section_key: 'testimonials',
            section_type: 'carousel',
            content_en: {
                subtitle: $('.section.testimonial .section-subtitle').text().trim(),
                title: $('.section.testimonial .section-title').text().trim(),
                items: []
            }
        };

        $('.testimonial-card').each((i, el) => {
            const $card = $(el);
            testimonials.content_en.items.push({
                quote: $card.find('.testimonial-card-description').text().trim(),
                author: {
                    image: $card.find('.testimonial-card-client-image').attr('src') || '',
                    name: $card.find('.testimonial-card-client-name').text().trim(),
                    role: $card.find('.testimonial-card-client-job').text().trim()
                },
                rating: 5, // Extract actual rating if available
                visible: true,
                order_index: i
            });
        });

        this.sections.push(testimonials);
    }

    extractStats($) {
        const stats = {
            section_key: 'stats',
            section_type: 'stats',
            content_en: {
                items: []
            }
        };

        $('.count-card').each((i, el) => {
            const $card = $(el);
            stats.content_en.items.push({
                icon: $card.find('.count-card-icon').attr('src') || '',
                number: $card.find('.count-card-number').text().trim(),
                suffix: $card.find('.count-card-suffix').text().trim(),
                label: $card.find('.count-card-title').text().trim(),
                visible: true,
                order_index: i
            });
        });

        if (stats.content_en.items.length > 0) {
            this.sections.push(stats);
        }
    }

    extractInstructors($) {
        const instructors = {
            section_key: 'instructors',
            section_type: 'grid',
            content_en: {
                subtitle: $('.section.instructor .section-subtitle').text().trim(),
                title: $('.section.instructor .section-title').text().trim(),
                items: []
            }
        };

        $('.instructor-card').each((i, el) => {
            const $card = $(el);
            instructors.content_en.items.push({
                image: $card.find('.instructor-card-image').attr('src') || '',
                name: $card.find('.instructor-card-title').text().trim(),
                role: $card.find('.instructor-card-subtitle').text().trim(),
                social: {
                    facebook: $card.find('[aria-label*="facebook"]').attr('href') || '',
                    twitter: $card.find('[aria-label*="twitter"]').attr('href') || '',
                    linkedin: $card.find('[aria-label*="linkedin"]').attr('href') || ''
                },
                visible: true,
                order_index: i
            });
        });

        if (instructors.content_en.items.length > 0) {
            this.sections.push(instructors);
        }
    }

    extractPricing($) {
        const pricing = {
            section_key: 'pricing',
            section_type: 'pricing',
            content_en: {
                subtitle: $('.section.pricing .section-subtitle').text().trim(),
                title: $('.section.pricing .section-title').text().trim(),
                items: []
            }
        };

        $('.pricing-card').each((i, el) => {
            const $card = $(el);
            const features = [];

            $card.find('.pricing-card-feature-item').each((j, feat) => {
                features.push({
                    text: $(feat).text().trim(),
                    included: !$(feat).hasClass('is-disable')
                });
            });

            pricing.content_en.items.push({
                name: $card.find('.pricing-card-title').text().trim(),
                price: $card.find('.pricing-card-price').text().trim(),
                period: $card.find('.pricing-card-period').text().trim(),
                description: $card.find('.pricing-card-description').text().trim(),
                features: features,
                buttonText: $card.find('.primary-button-text-block').first().text().trim(),
                buttonUrl: $card.find('.primary-button').attr('href') || '#',
                isPopular: $card.hasClass('is-popular'),
                visible: true,
                order_index: i
            });
        });

        if (pricing.content_en.items.length > 0) {
            this.sections.push(pricing);
        }
    }

    extractBlogPosts($) {
        const blog = {
            section_key: 'blog',
            section_type: 'grid',
            content_en: {
                subtitle: $('.section.blog .section-subtitle').text().trim(),
                title: $('.section.blog .section-title').text().trim(),
                viewAllText: 'View All Posts',
                viewAllUrl: '/blog.html',
                items: []
            }
        };

        $('.blog-card').each((i, el) => {
            const $card = $(el);
            blog.content_en.items.push({
                image: $card.find('.blog-card-image').attr('src') || '',
                category: $card.find('.blog-card-category').text().trim(),
                date: $card.find('.blog-card-date').text().trim(),
                title: $card.find('.blog-card-title').text().trim(),
                description: $card.find('.blog-card-caption').text().trim(),
                author: {
                    image: $card.find('.blog-card-author-image').attr('src') || '',
                    name: $card.find('.blog-card-author-name').text().trim()
                },
                readMoreText: 'Read More',
                url: $card.parent().attr('href') || '#',
                visible: true,
                order_index: i
            });
        });

        if (blog.content_en.items.length > 0) {
            this.sections.push(blog);
        }
    }

    extractCTAs($) {
        // Newsletter CTA
        const newsletter = $('.section.newsletter');
        if (newsletter.length) {
            this.sections.push({
                section_key: 'newsletter_cta',
                section_type: 'cta',
                content_en: {
                    title: newsletter.find('.newsletter-title').text().trim(),
                    description: newsletter.find('.newsletter-caption').text().trim(),
                    inputPlaceholder: newsletter.find('input[type="email"]').attr('placeholder') || 'Enter your email',
                    buttonText: newsletter.find('.primary-button-text-block').first().text().trim(),
                    backgroundImage: newsletter.find('.newsletter-image').attr('src') || ''
                }
            });
        }

        // Other CTA sections
        $('.section.cta').each((i, el) => {
            const $cta = $(el);
            this.sections.push({
                section_key: `cta_${i + 1}`,
                section_type: 'cta',
                content_en: {
                    title: $cta.find('.cta-title, .section-title').text().trim(),
                    description: $cta.find('.cta-description, .section-description').text().trim(),
                    buttonText: $cta.find('.primary-button-text-block').first().text().trim(),
                    buttonUrl: $cta.find('.primary-button').attr('href') || '#'
                }
            });
        });
    }

    extractFooter($) {
        const footer = {
            section_key: 'footer',
            columns: []
        };

        // Extract footer columns
        $('.footer-column').each((i, col) => {
            const $col = $(col);
            const column = {
                title: $col.find('.footer-title').text().trim(),
                links: []
            };

            $col.find('.footer-link').each((j, link) => {
                const $link = $(link);
                column.links.push({
                    text: $link.text().trim(),
                    url: $link.attr('href') || '#'
                });
            });

            footer.columns.push(column);
        });

        // Extract social links
        const socialLinks = [];
        $('.footer-social-link').each((i, link) => {
            const $link = $(link);
            socialLinks.push({
                platform: $link.attr('aria-label') || '',
                url: $link.attr('href') || '#',
                iconClass: $link.find('img').attr('alt') || ''
            });
        });

        footer.social = socialLinks;

        // Extract copyright
        footer.copyright = $('.footer-copyright-text').text().trim();

        this.sections.push(footer);
    }

    generateSQL() {
        const sqlStatements = [];

        this.sections.forEach((section, index) => {
            if (section.section_key) {
                const contentJson = section.content_en ? JSON.stringify(section.content_en).replace(/'/g, "''") : '{}';
                const sql = `
INSERT INTO nd_home (section_key, section_type, content_en, visible, order_index)
VALUES ('${section.section_key}', '${section.section_type || 'general'}', '${contentJson}', true, ${index})
ON CONFLICT (section_key) DO UPDATE SET
    content_en = EXCLUDED.content_en,
    updated_at = CURRENT_TIMESTAMP;`;
                sqlStatements.push(sql);
            }
        });

        return sqlStatements.join('\n');
    }

    saveToFile(outputPath) {
        const content = this.extractHomeContent();

        // Save as JSON
        fs.writeFileSync(
            path.join(outputPath, 'nd_home_content.json'),
            JSON.stringify(content, null, 2)
        );

        // Save as SQL
        fs.writeFileSync(
            path.join(outputPath, 'nd_home_content.sql'),
            this.generateSQL()
        );

        console.log(`✅ Content extracted and saved to ${outputPath}`);
        console.log(`📊 Total sections extracted: ${this.sections.length}`);

        // Summary
        this.sections.forEach(section => {
            if (section.section_key) {
                const itemCount = section.content_en?.items?.length || 0;
                console.log(`   - ${section.section_key}: ${itemCount > 0 ? itemCount + ' items' : 'extracted'}`);
            }
        });
    }
}

// Run extraction
if (require.main === module) {
    const extractor = new NDContentExtractor();
    const outputDir = path.join(__dirname, '../backups/newDesign/extracted');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    extractor.saveToFile(outputDir);
}

module.exports = NDContentExtractor;