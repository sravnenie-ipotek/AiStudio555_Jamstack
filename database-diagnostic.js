const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('Database Diagnostic for Hebrew Translations');

const dbPath = path.join(__dirname, 'aistudio.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to SQLite database');
    
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%career%'", [], (err, tables) => {
        if (err) {
            console.error('Error querying tables:', err.message);
            return;
        }
        
        console.log('\nCareer-related tables found:');
        tables.forEach(table => {
            console.log('- ' + table.name);
        });
        
        if (tables.length === 0) {
            console.log('No career-specific tables found');
            
            db.all("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'nd_%'", [], (err, ndTables) => {
                console.log('\nAll ND tables:');
                ndTables.forEach(table => {
                    console.log('- ' + table.name);
                });
                
                const careerTable = ndTables.find(t => t.name.includes('career'));
                if (careerTable) {
                    console.log('\nChecking ' + careerTable.name + ' for Hebrew content...');
                    
                    db.all('SELECT key_name, content_en, content_he FROM ' + careerTable.name + ' LIMIT 5', [], (err, rows) => {
                        if (err) {
                            console.error('Error querying content:', err.message);
                        } else {
                            console.log('\nSample content:');
                            rows.forEach(row => {
                                console.log('Key:', row.key_name);
                                const enContent = row.content_en ? row.content_en.substring(0, 50) : 'NULL';
                                const heContent = row.content_he ? row.content_he.substring(0, 50) : 'NULL';
                                console.log('EN:', enContent + '...');
                                console.log('HE:', heContent + '...');
                                console.log('---');
                            });
                        }
                        db.close();
                    });
                } else {
                    console.log('\nNo career center platform table found');
                    db.close();
                }
            });
        }
    });
});
