#!/usr/bin/env node

/**
 * DATABASE COMPARISON SCRIPT
 * Compares local PostgreSQL with Railway PostgreSQL
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.production', override: true });

// Database configurations
const localConfig = {
    host: 'localhost',
    port: 5432,
    database: 'aistudio_db',
    user: 'postgres',
    password: process.env.DB_PASSWORD || ''
};

const railwayConfig = {
    connectionString: process.env.DATABASE_URL || process.env.RAILWAY_DATABASE_URL
};

// Tables to compare
const TABLES_TO_COMPARE = [
    'about_pages', 'blog_posts', 'button_texts', 'career_center_pages',
    'career_orientation_pages', 'career_resources', 'company_logos',
    'consultation_services', 'consultations', 'contact_pages', 'courses',
    'entity_teachers', 'faqs', 'footer_content', 'home_pages', 'job_postings',
    'navigation_menus', 'nd_about_page', 'nd_blog_page', 'nd_blog_posts',
    'nd_career_center_platform_page', 'nd_contact_page', 'nd_course_details_page',
    'nd_courses', 'nd_courses_page', 'nd_footer', 'nd_home', 'nd_home_page',
    'nd_menu', 'nd_pricing_page', 'nd_teachers_page', 'nd_ui_translations',
    'pricing_plans', 'site_settings', 'statistics', 'teachers'
];

class DatabaseComparator {
    constructor() {
        this.localClient = new Client(localConfig);
        this.railwayClient = new Client(railwayConfig);
        this.results = {
            timestamp: new Date().toISOString(),
            local: {},
            railway: {},
            differences: {
                missingInRailway: [],
                missingInLocal: [],
                recordCountDifferences: [],
                columnDifferences: []
            },
            summary: {}
        };
    }

    async connect() {
        try {
            console.log('🔄 Connecting to local database...');
            await this.localClient.connect();
            console.log('✅ Connected to local database');

            console.log('🔄 Connecting to Railway database...');
            await this.railwayClient.connect();
            console.log('✅ Connected to Railway database');
        } catch (error) {
            console.error('❌ Connection error:', error.message);
            throw error;
        }
    }

    async getTables(client, dbName) {
        const query = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `;
        const result = await client.query(query);
        return result.rows.map(row => row.table_name);
    }

    async getTableInfo(client, tableName) {
        try {
            // Get record count
            const countQuery = `SELECT COUNT(*) as count FROM ${tableName}`;
            const countResult = await client.query(countQuery);
            const recordCount = parseInt(countResult.rows[0].count);

            // Get column information
            const columnsQuery = `
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = $1 AND table_schema = 'public'
                ORDER BY ordinal_position
            `;
            const columnsResult = await client.query(columnsQuery, [tableName]);

            // Get sample data (first 3 records)
            const sampleQuery = `SELECT * FROM ${tableName} LIMIT 3`;
            const sampleResult = await client.query(sampleQuery);

            return {
                exists: true,
                recordCount,
                columns: columnsResult.rows,
                columnCount: columnsResult.rows.length,
                sampleData: sampleResult.rows
            };
        } catch (error) {
            return {
                exists: false,
                error: error.message
            };
        }
    }

    async compareDatabase() {
        console.log('\n📊 STARTING DATABASE COMPARISON...\n');
        console.log('═'.repeat(60));

        // Get table lists
        const localTables = await this.getTables(this.localClient, 'local');
        const railwayTables = await this.getTables(this.railwayClient, 'railway');

        this.results.local.tableCount = localTables.length;
        this.results.railway.tableCount = railwayTables.length;

        console.log(`\n📋 TABLE COUNT:`);
        console.log(`   Local:   ${localTables.length} tables`);
        console.log(`   Railway: ${railwayTables.length} tables`);

        // Find missing tables
        const missingInRailway = localTables.filter(t => !railwayTables.includes(t));
        const missingInLocal = railwayTables.filter(t => !localTables.includes(t));

        if (missingInRailway.length > 0) {
            console.log(`\n⚠️  Missing in Railway: ${missingInRailway.join(', ')}`);
            this.results.differences.missingInRailway = missingInRailway;
        }

        if (missingInLocal.length > 0) {
            console.log(`\n⚠️  Missing in Local: ${missingInLocal.join(', ')}`);
            this.results.differences.missingInLocal = missingInLocal;
        }

        console.log('\n═'.repeat(60));
        console.log('\n📊 DETAILED TABLE COMPARISON:\n');

        // Compare each table
        for (const tableName of TABLES_TO_COMPARE) {
            const localInfo = await this.getTableInfo(this.localClient, tableName);
            const railwayInfo = await this.getTableInfo(this.railwayClient, tableName);

            this.results.local[tableName] = localInfo;
            this.results.railway[tableName] = railwayInfo;

            // Display comparison
            if (!localInfo.exists && !railwayInfo.exists) {
                console.log(`❌ ${tableName}: Missing in BOTH databases`);
            } else if (!localInfo.exists) {
                console.log(`⚠️  ${tableName}: Missing in LOCAL`);
            } else if (!railwayInfo.exists) {
                console.log(`⚠️  ${tableName}: Missing in RAILWAY`);
            } else {
                const recordDiff = localInfo.recordCount - railwayInfo.recordCount;
                const columnDiff = localInfo.columnCount - railwayInfo.columnCount;

                let status = '✅';
                let details = [];

                if (recordDiff !== 0) {
                    status = '⚠️';
                    details.push(`Records: L:${localInfo.recordCount} R:${railwayInfo.recordCount} (${recordDiff > 0 ? '+' : ''}${recordDiff})`);
                    this.results.differences.recordCountDifferences.push({
                        table: tableName,
                        local: localInfo.recordCount,
                        railway: railwayInfo.recordCount,
                        difference: recordDiff
                    });
                }

                if (columnDiff !== 0) {
                    status = '🔧';
                    details.push(`Columns: L:${localInfo.columnCount} R:${railwayInfo.columnCount} (${columnDiff > 0 ? '+' : ''}${columnDiff})`);
                    this.results.differences.columnDifferences.push({
                        table: tableName,
                        local: localInfo.columnCount,
                        railway: railwayInfo.columnCount,
                        difference: columnDiff
                    });
                }

                if (details.length === 0) {
                    details.push(`Records: ${localInfo.recordCount}, Columns: ${localInfo.columnCount}`);
                }

                console.log(`${status} ${tableName}: ${details.join(' | ')}`);
            }
        }

        // Calculate totals
        await this.calculateTotals();

        // Generate summary
        this.generateSummary();
    }

    async calculateTotals() {
        console.log('\n═'.repeat(60));
        console.log('\n📈 TOTAL RECORD COUNTS:\n');

        const localTotalQuery = `
            SELECT
                (SELECT COUNT(*) FROM about_pages) +
                (SELECT COUNT(*) FROM blog_posts) +
                (SELECT COUNT(*) FROM courses) +
                (SELECT COUNT(*) FROM nd_courses) +
                (SELECT COUNT(*) FROM nd_home) +
                (SELECT COUNT(*) FROM nd_menu) +
                (SELECT COUNT(*) FROM teachers) as total
        `;

        try {
            const localTotal = await this.localClient.query(localTotalQuery);
            const railwayTotal = await this.railwayClient.query(localTotalQuery);

            const localCount = parseInt(localTotal.rows[0].total);
            const railwayCount = parseInt(railwayTotal.rows[0].total);

            console.log(`   Local Total Records:   ${localCount}`);
            console.log(`   Railway Total Records: ${railwayCount}`);
            console.log(`   Difference:            ${localCount - railwayCount}`);

            this.results.summary.totalRecords = {
                local: localCount,
                railway: railwayCount,
                difference: localCount - railwayCount
            };
        } catch (error) {
            console.log('   Could not calculate totals:', error.message);
        }
    }

    generateSummary() {
        console.log('\n═'.repeat(60));
        console.log('\n🎯 COMPARISON SUMMARY:\n');

        const perfect = this.results.differences.missingInRailway.length === 0 &&
                       this.results.differences.missingInLocal.length === 0 &&
                       this.results.differences.recordCountDifferences.length === 0 &&
                       this.results.differences.columnDifferences.length === 0;

        if (perfect) {
            console.log('✅ DATABASES ARE IDENTICAL!');
            this.results.summary.status = 'IDENTICAL';
        } else {
            console.log('⚠️  DIFFERENCES DETECTED:');
            this.results.summary.status = 'DIFFERENT';

            if (this.results.differences.missingInRailway.length > 0) {
                console.log(`   - ${this.results.differences.missingInRailway.length} tables missing in Railway`);
            }
            if (this.results.differences.missingInLocal.length > 0) {
                console.log(`   - ${this.results.differences.missingInLocal.length} tables missing in Local`);
            }
            if (this.results.differences.recordCountDifferences.length > 0) {
                console.log(`   - ${this.results.differences.recordCountDifferences.length} tables have different record counts`);
            }
            if (this.results.differences.columnDifferences.length > 0) {
                console.log(`   - ${this.results.differences.columnDifferences.length} tables have different column counts`);
            }
        }

        console.log('\n═'.repeat(60));
    }

    async saveReport() {
        const reportPath = path.join(__dirname, `comparison_report_${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    }

    async disconnect() {
        await this.localClient.end();
        await this.railwayClient.end();
        console.log('\n✅ Disconnected from both databases');
    }

    async run() {
        try {
            await this.connect();
            await this.compareDatabase();
            await this.saveReport();
        } catch (error) {
            console.error('❌ Comparison failed:', error.message);
        } finally {
            await this.disconnect();
        }
    }
}

// Run comparison
const comparator = new DatabaseComparator();
comparator.run();