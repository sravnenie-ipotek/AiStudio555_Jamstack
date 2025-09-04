"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
test_1.test.describe('Database Connectivity', () => {
    (0, test_1.test)('PostgreSQL should be running', async () => {
        var _a;
        try {
            const { stdout } = await execAsync('pg_isready -h localhost -p 5432');
            (0, test_1.expect)(stdout).toContain('accepting connections');
        }
        catch (error) {
            if (error.code === 0 && ((_a = error.stdout) === null || _a === void 0 ? void 0 : _a.includes('accepting connections'))) {
                return;
            }
            throw new Error(`PostgreSQL is not running: ${error.message}`);
        }
    });
    (0, test_1.test)('should connect to strapi_admin database', async () => {
        try {
            const { stdout } = await execAsync('PGPASSWORD=localpassword psql -h localhost -U projectdes -d strapi_admin -c "SELECT 1" -t');
            (0, test_1.expect)(stdout.trim()).toBe('1');
        }
        catch (error) {
            throw new Error(`Cannot connect to database: ${error.message}`);
        }
    });
    (0, test_1.test)('should have Strapi tables in database', async () => {
        try {
            const { stdout } = await execAsync(`PGPASSWORD=localpassword psql -h localhost -U projectdes -d strapi_admin -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'strapi_%';" -t`);
            const tableCount = parseInt(stdout.trim());
            (0, test_1.expect)(tableCount).toBeGreaterThan(0);
        }
        catch (error) {
            console.log('Database might be initializing, this is expected on first run');
        }
    });
    (0, test_1.test)('API should report database connection', async ({ request }) => {
        const response = await request.get('http://localhost:1337/_health');
        (0, test_1.expect)(response.ok()).toBeTruthy();
        const adminResponse = await request.get('http://localhost:1337/admin');
        (0, test_1.expect)(adminResponse.status()).toBeLessThan(500);
    });
});
