#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const path = require('path');

// Production API URL
const PROD_API = 'https://aistudio555jamstack-production.up.railway.app/api';
const DB_PATH = path.join(__dirname, 'strapi-fresh/.tmp/data.db');

console.log('🔄 Starting Production → Local Database Sync\n');

async function syncProductionToLocal() {
    const db = new sqlite3.Database(DB_PATH);
    
    try {
        // Create tables if they don't exist
        await createTables(db);
        
        // Sync Home Page Data
        console.log('📥 Fetching home page data from production...');
        const homePageResponse = await axios.get(`${PROD_API}/home-page`);
        const homePageData = homePageResponse.data.data.attributes;
        
        await syncHomePage(db, homePageData);
        console.log('✅ Home page data synced');
        
        // Sync Courses Data
        console.log('📥 Fetching courses data from production...');
        const coursesResponse = await axios.get(`${PROD_API}/courses`);
        const coursesData = coursesResponse.data.data;
        
        await syncCourses(db, coursesData);
        console.log('✅ Courses data synced');
        
        console.log('\n🎉 Production data successfully synced to local database!');
        console.log('🔗 Your admin panel and frontend should now show the production content');
        
    } catch (error) {
        console.error('❌ Error syncing data:', error.message);
    } finally {
        db.close();
    }
}

function createTables(db) {
    return new Promise((resolve, reject) => {
        // Match server.js expected schema with snake_case column names
        const homePageTable = `
            CREATE TABLE IF NOT EXISTS home_pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                locale TEXT DEFAULT 'en',
                title TEXT,
                hero_title TEXT,
                hero_subtitle TEXT,
                hero_description TEXT,
                hero_section_visible BOOLEAN,
                featured_courses_title TEXT,
                featured_courses_description TEXT,
                featured_courses_visible BOOLEAN,
                about_title TEXT,
                about_subtitle TEXT,
                about_description TEXT,
                about_visible BOOLEAN,
                companies_title TEXT,
                companies_description TEXT,
                companies_visible BOOLEAN,
                testimonials_title TEXT,
                testimonials_subtitle TEXT,
                testimonials_visible BOOLEAN,
                courses TEXT,
                testimonials TEXT,
                published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        const coursesTable = `
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                locale TEXT DEFAULT 'en',
                title TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2),
                duration TEXT,
                lessons TEXT,
                category TEXT,
                rating DECIMAL(3,1),
                visible BOOLEAN DEFAULT true,
                published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        db.run(homePageTable, (err) => {
            if (err) return reject(err);
            
            db.run(coursesTable, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function syncHomePage(db, data) {
    return new Promise((resolve, reject) => {
        // Clear existing data
        db.run('DELETE FROM home_pages', (err) => {
            if (err) return reject(err);
            
            // Insert new data with snake_case column names to match server.js expectations
            const insertQuery = `
                INSERT INTO home_pages (
                    locale, title, hero_title, hero_subtitle, hero_description, hero_section_visible,
                    featured_courses_title, featured_courses_description, featured_courses_visible,
                    about_title, about_subtitle, about_description, about_visible,
                    companies_title, companies_description, companies_visible,
                    testimonials_title, testimonials_subtitle, testimonials_visible,
                    courses, testimonials, published_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                'en', // locale
                data.title || 'AI Studio - Expert-Led Online Learning Platform',
                data.heroTitle || 'Master AI & Technology',
                data.heroSubtitle || 'Transform Your Career with Expert-Led Courses',
                data.heroDescription || 'Join thousands of students learning cutting-edge technology from industry experts',
                data.heroSectionVisible ?? true,
                data.featuredCoursesTitle || 'Featured Courses',
                data.featuredCoursesDescription || 'Explore our most popular courses designed by industry experts',
                data.featuredCoursesVisible ?? true,
                data.aboutTitle || 'About AI Studio',
                data.aboutSubtitle || 'Your Path to Success',
                data.aboutDescription || 'We provide world-class education in AI, Machine Learning, and modern technology',
                data.aboutVisible ?? true,
                data.companiesTitle || 'Trusted by Leading Companies',
                data.companiesDescription || 'Our graduates work at top technology companies worldwide',
                data.companiesVisible ?? true,
                data.testimonialsTitle || 'Student Success Stories',
                data.testimonialsSubtitle || 'Hear from our successful graduates',
                data.testimonialsVisible ?? true,
                JSON.stringify(data.courses || []),
                JSON.stringify(data.testimonials || []),
                new Date().toISOString() // published_at
            ];
            
            db.run(insertQuery, values, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function syncCourses(db, courses) {
    return new Promise((resolve, reject) => {
        // Clear existing courses
        db.run('DELETE FROM courses', (err) => {
            if (err) return reject(err);
            
            if (!courses || courses.length === 0) {
                return resolve();
            }
            
            // Insert each course
            const insertQuery = `
                INSERT INTO courses (
                    locale, title, description, price, duration, lessons, category, rating, visible, published_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const insertPromises = courses.map(course => {
                return new Promise((courseResolve, courseReject) => {
                    const attrs = course.attributes;
                    const values = [
                        'en', // locale
                        attrs.title || '',
                        attrs.description || '',
                        parseFloat(attrs.price) || 0,
                        attrs.duration || '',
                        attrs.lessons || '',
                        attrs.category || '',
                        parseFloat(attrs.rating) || 0,
                        attrs.visible ?? true,
                        new Date().toISOString() // published_at
                    ];
                    
                    db.run(insertQuery, values, (err) => {
                        if (err) return courseReject(err);
                        courseResolve();
                    });
                });
            });
            
            Promise.all(insertPromises)
                .then(() => resolve())
                .catch(reject);
        });
    });
}

// Run the sync
if (require.main === module) {
    syncProductionToLocal();
}

module.exports = { syncProductionToLocal };