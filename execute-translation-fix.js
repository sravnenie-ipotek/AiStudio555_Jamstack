/**
 * Script to fix nd_courses translations
 * Adds missing columns and fixes corrupted data
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('jamstack.db');

console.log('🔧 Fixing nd_courses translations...\n');

// SQL commands to execute
const sqlCommands = [
    // Add missing columns
    `ALTER TABLE nd_courses ADD COLUMN description_ru TEXT`,
    `ALTER TABLE nd_courses ADD COLUMN description_he TEXT`,
    `ALTER TABLE nd_courses ADD COLUMN short_description_ru TEXT`,
    `ALTER TABLE nd_courses ADD COLUMN short_description_he TEXT`,

    // Fix corrupted data for course ID 2
    `UPDATE nd_courses
     SET
        title_ru = title,
        title = 'React & Redux Masterclass',
        description_ru = description,
        description = 'Master React.js and Redux for building scalable single-page applications. Learn component architecture, state management, hooks, and best practices for production-ready React apps. Includes real-world projects and deployment strategies.'
     WHERE id = 2`,

    // Add Russian translation for course 3
    `UPDATE nd_courses
     SET
        title_ru = 'Разработка Backend на Node.js',
        description_ru = 'Станьте экспертом по backend с Node.js, Express и MongoDB. Научитесь создавать RESTful API, обрабатывать аутентификацию, внедрять лучшие практики безопасности и развертывать масштабируемые серверные приложения.'
     WHERE id = 3 AND title = 'Node.js Backend Development'`,

    // Add Hebrew translations
    `UPDATE nd_courses
     SET
        title_he = 'מאסטר-קלאס React ו-Redux',
        description_he = 'למדו React.js ו-Redux לבניית אפליקציות חד-עמודיות ניתנות להרחבה. למדו ארכיטקטורת רכיבים, ניהול מצב, hooks ושיטות מומלצות לאפליקציות React מוכנות לייצור.'
     WHERE id = 2`,

    `UPDATE nd_courses
     SET
        title_he = 'פיתוח Backend עם Node.js',
        description_he = 'הפכו למומחי backend עם Node.js, Express ו-MongoDB. למדו לבנות RESTful APIs, לטפל באימות, ליישם שיטות אבטחה מומלצות ולפרוס אפליקציות שרת ניתנות להרחבה.'
     WHERE id = 3`,

    `UPDATE nd_courses
     SET
        title_he = 'Python למדע הנתונים',
        description_he = 'שחררו את הכוח של Python לניתוח נתונים ולמידת מכונה. שלטו ב-pandas, NumPy, matplotlib ו-scikit-learn לניתוח נתונים, יצירת ויזואליזציות ובניית מודלים ניבויים.'
     WHERE id = 4 AND title = 'Python for Data Science'`
];

let completed = 0;
const total = sqlCommands.length;

function executeCommand(index) {
    if (index >= sqlCommands.length) {
        // All done, verify the results
        console.log('\n✅ All commands executed successfully!\n');
        verifyResults();
        return;
    }

    const sql = sqlCommands[index];
    const shortSql = sql.split('\n')[0].substring(0, 50) + '...';

    db.run(sql, function(err) {
        if (err && !err.message.includes('duplicate column name')) {
            console.error(`❌ Error executing: ${shortSql}`);
            console.error(`   ${err.message}`);
        } else {
            completed++;
            console.log(`✓ [${completed}/${total}] ${shortSql}`);
        }

        // Execute next command
        executeCommand(index + 1);
    });
}

function verifyResults() {
    db.all(`
        SELECT
            id,
            title,
            title_ru,
            title_he,
            CASE
                WHEN title_ru IS NOT NULL THEN '✅'
                ELSE '❌'
            END as has_russian,
            CASE
                WHEN title_he IS NOT NULL THEN '✅'
                ELSE '❌'
            END as has_hebrew
        FROM nd_courses
        ORDER BY id
    `, [], (err, rows) => {
        if (err) {
            console.error('Error verifying results:', err.message);
        } else {
            console.log('📊 Translation Status:');
            console.log('═══════════════════════════════════════════════════════');

            rows.forEach(row => {
                console.log(`ID ${row.id}: ${row.title}`);
                console.log(`  Russian ${row.has_russian}: ${row.title_ru || 'Missing'}`);
                console.log(`  Hebrew  ${row.has_hebrew}: ${row.title_he || 'Missing'}`);
                console.log('');
            });
        }

        db.close(() => {
            console.log('✨ Database connection closed.');
        });
    });
}

// Start executing commands
console.log(`Executing ${total} SQL commands...\n`);
executeCommand(0);