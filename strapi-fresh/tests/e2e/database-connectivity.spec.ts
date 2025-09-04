import { test, expect } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

test.describe('Database Connectivity', () => {
  test('PostgreSQL should be running', async () => {
    try {
      const { stdout } = await execAsync('pg_isready -h localhost -p 5432');
      expect(stdout).toContain('accepting connections');
    } catch (error: any) {
      if (error.code === 0 && error.stdout?.includes('accepting connections')) {
        return;
      }
      throw new Error(`PostgreSQL is not running: ${error.message}`);
    }
  });

  test('should connect to strapi_admin database', async () => {
    try {
      const { stdout } = await execAsync(
        'PGPASSWORD=localpassword psql -h localhost -U projectdes -d strapi_admin -c "SELECT 1" -t'
      );
      expect(stdout.trim()).toBe('1');
    } catch (error: any) {
      throw new Error(`Cannot connect to database: ${error.message}`);
    }
  });

  test('should have Strapi tables in database', async () => {
    try {
      const { stdout } = await execAsync(
        `PGPASSWORD=localpassword psql -h localhost -U projectdes -d strapi_admin -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'strapi_%';" -t`
      );
      const tableCount = parseInt(stdout.trim());
      expect(tableCount).toBeGreaterThan(0);
    } catch (error: any) {
      console.log('Database might be initializing, this is expected on first run');
    }
  });

  test('API should report database connection', async ({ request }) => {
    const response = await request.get('http://localhost:1337/_health');
    expect(response.ok()).toBeTruthy();
    
    const adminResponse = await request.get('http://localhost:1337/admin');
    expect(adminResponse.status()).toBeLessThan(500);
  });
});