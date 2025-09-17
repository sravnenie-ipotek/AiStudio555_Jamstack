// Create nd_pricing_plans table with monthly/yearly support
// Following NewDesign naming convention

const { Pool } = require('pg');

async function createPricingPlansTable() {
    console.log('🚀 Creating nd_pricing_plans table...');

    // Database configuration - same as server.js
    const defaultUrl = 'postgresql://postgres:postgres@localhost:5432/postgres';
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL || defaultUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        // Create nd_pricing_plans table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS nd_pricing_plans (
                id SERIAL PRIMARY KEY,
                plan_name VARCHAR(255) NOT NULL,
                plan_description TEXT,
                monthly_price VARCHAR(50),
                yearly_price VARCHAR(50),
                features JSONB DEFAULT '[]'::jsonb,
                button_text VARCHAR(255) DEFAULT 'Get Started',
                button_url VARCHAR(500) DEFAULT '#',
                featured BOOLEAN DEFAULT false,
                display_order INTEGER DEFAULT 0,
                visible BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;

        await pool.query(createTableQuery);
        console.log('✅ nd_pricing_plans table created successfully');

        // Check if we have existing plans in nd_pricing_page to migrate
        const checkExistingQuery = `
            SELECT content_en FROM nd_pricing_page
            WHERE section_name = 'plans' LIMIT 1;
        `;

        const existingResult = await pool.query(checkExistingQuery);

        if (existingResult.rows.length > 0) {
            const plansData = existingResult.rows[0].content_en;

            if (plansData && plansData.plans && Array.isArray(plansData.plans)) {
                console.log('📊 Migrating existing plans to nd_pricing_plans...');

                for (let i = 0; i < plansData.plans.length; i++) {
                    const plan = plansData.plans[i];

                    // Default monthly/yearly prices based on existing price
                    let monthlyPrice = plan.price || '';
                    let yearlyPrice = plan.price ? (parseInt(plan.price.replace(/[^0-9]/g, '')) * 10 + '/year') : '';

                    // If no monthly indicator, assume it's monthly
                    if (monthlyPrice && !monthlyPrice.includes('month') && !monthlyPrice.includes('year')) {
                        monthlyPrice = monthlyPrice + '/month';
                    }

                    const insertQuery = `
                        INSERT INTO nd_pricing_plans (
                            plan_name, plan_description, monthly_price, yearly_price,
                            features, button_text, button_url, featured, display_order
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        ON CONFLICT DO NOTHING;
                    `;

                    await pool.query(insertQuery, [
                        plan.name || 'Plan ' + (i + 1),
                        plan.description || '',
                        monthlyPrice,
                        yearlyPrice,
                        JSON.stringify(plan.features || []),
                        plan.button_text || 'Get Started',
                        plan.button_url || '#',
                        plan.featured || false,
                        i + 1
                    ]);
                }

                console.log(`✅ Migrated ${plansData.plans.length} plans to nd_pricing_plans`);
            }
        } else {
            // Create default plans if none exist
            console.log('📝 Creating default pricing plans...');

            const defaultPlans = [
                {
                    name: 'Basic Plan',
                    description: 'Perfect for beginners starting their AI journey',
                    monthly_price: '$29/month',
                    yearly_price: '$290/year',
                    features: [
                        'Access to 50+ courses',
                        'Community forum access',
                        'Course completion certificates',
                        'Basic support (48h response)',
                        'Monthly webinars',
                        'Downloadable resources'
                    ],
                    featured: false,
                    display_order: 1
                },
                {
                    name: 'Pro Plan',
                    description: 'For professionals serious about AI mastery',
                    monthly_price: '$99/month',
                    yearly_price: '$990/year',
                    features: [
                        'Access All Courses',
                        'Priority community support',
                        'Professional certificates',
                        'Priority support (12h response)',
                        '1-on-1 monthly mentoring',
                        'Hands-on projects',
                        'Career coaching',
                        'Job placement assistance'
                    ],
                    featured: true,
                    display_order: 2
                },
                {
                    name: 'Enterprise',
                    description: 'Tailored solutions for teams and organizations',
                    monthly_price: 'Custom',
                    yearly_price: 'Custom',
                    features: [
                        'Everything in Pro',
                        'Unlimited team members',
                        'Custom learning paths',
                        'Dedicated account manager',
                        'Priority 24/7 support',
                        'Private workshops',
                        'API access',
                        'Analytics dashboard'
                    ],
                    featured: false,
                    display_order: 3
                }
            ];

            for (const plan of defaultPlans) {
                const insertQuery = `
                    INSERT INTO nd_pricing_plans (
                        plan_name, plan_description, monthly_price, yearly_price,
                        features, featured, display_order
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7);
                `;

                await pool.query(insertQuery, [
                    plan.name,
                    plan.description,
                    plan.monthly_price,
                    plan.yearly_price,
                    JSON.stringify(plan.features),
                    plan.featured,
                    plan.display_order
                ]);
            }

            console.log('✅ Created 3 default pricing plans');
        }

        // Verify the table
        const verifyQuery = 'SELECT COUNT(*) as count FROM nd_pricing_plans';
        const verifyResult = await pool.query(verifyQuery);
        console.log(`📊 Total plans in nd_pricing_plans: ${verifyResult.rows[0].count}`);

        console.log('\n🎉 nd_pricing_plans table setup complete!');
        console.log('✅ Table structure: plan_name, monthly_price, yearly_price, features, etc.');
        console.log('✅ Ready for monthly/yearly pricing management');

    } catch (error) {
        console.error('❌ Error creating nd_pricing_plans table:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Run if called directly
if (require.main === module) {
    createPricingPlansTable()
        .then(() => {
            console.log('✅ Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Script failed:', error);
            process.exit(1);
        });
}

module.exports = { createPricingPlansTable };