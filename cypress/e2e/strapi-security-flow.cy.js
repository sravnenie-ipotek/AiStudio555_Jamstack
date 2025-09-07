/**
 * Cypress E2E Tests for Strapi Security Flow
 * 
 * Tests the complete security architecture:
 * 1. Content Manager edits → Saves to PostgreSQL
 * 2. Visitor arrives → Gets HTML from Vercel  
 * 3. JavaScript runs → Asks Strapi for updates
 * 4. Strapi checks PostgreSQL → Returns content
 * 5. Website updates → Shows new content
 * 
 * Security Requirements:
 * - Database credentials never exposed
 * - SQL injection impossible from frontend
 * - API tokens control access
 * - Rate limiting prevents abuse
 * - No direct DB queries from browser
 */

describe('Strapi Security Flow - Complete E2E', () => {
  
  // Setup before all tests
  before(() => {
    // Reset database to clean state
    cy.task('resetDatabase');
    
    // Create test users
    cy.task('createTestUsers', {
      superAdmin: {
        email: 'superadmin@test.com',
        password: 'SuperAdmin123!'
      },
      contentManager: {
        email: 'manager@test.com',
        password: 'Manager123!'
      }
    });
    
    // Seed initial content
    cy.task('seedContent');
  });
  
  // ========================================
  // FLOW STEP 1: Content Manager Edits
  // ========================================
  
  describe('Step 1: Content Manager edits in Strapi', () => {
    
    it('Content Manager logs in successfully', () => {
      cy.visit('/admin/auth/login');
      
      cy.get('input[name="email"]').type('manager@test.com');
      cy.get('input[name="password"]').type('Manager123!');
      cy.get('button[type="submit"]').click();
      
      // Should redirect to dashboard
      cy.url().should('include', '/admin');
      
      // Should NOT have access to settings
      cy.get('[data-testid="settings-link"]').should('not.exist');
    });
    
    it('Content Manager edits section content', () => {
      // Navigate to page sections
      cy.visit('/admin/content-manager/collectionType/api::page-section.page-section');
      
      // Find hero banner section
      cy.contains('Hero Banner').click();
      
      // Edit title field
      cy.get('[name="content.title.en"]')
        .clear()
        .type('Welcome to Winter Sale 2024');
      
      // Edit Russian translation
      cy.get('[name="content.title.ru"]')
        .clear()
        .type('Добро пожаловать на зимнюю распродажу 2024');
      
      // Edit Hebrew translation
      cy.get('[name="content.title.he"]')
        .clear()
        .type('ברוכים הבאים למכירת החורף 2024');
      
      // Upload new image via Cloudinary
      cy.get('[data-testid="media-upload"]').click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/winter-banner.jpg');
      
      // Save changes
      cy.get('button[type="submit"]').click();
      
      // Should show as pending approval
      cy.get('[data-status="pending_approval"]').should('be.visible');
    });
    
    it('Changes are saved to PostgreSQL but not live', () => {
      // Check database has draft version
      cy.task('queryDatabase', {
        query: 'SELECT * FROM page_sections WHERE id = 1'
      }).then((result) => {
        expect(result.draftVersion).to.exist;
        expect(result.draftVersion.content.title.en).to.equal('Welcome to Winter Sale 2024');
        expect(result.liveVersion.content.title.en).to.not.equal('Welcome to Winter Sale 2024');
        expect(result.approvalStatus).to.equal('pending_approval');
      });
      
      // Approval request should be created
      cy.task('queryDatabase', {
        query: 'SELECT * FROM approval_requests WHERE status = $1',
        params: ['pending']
      }).then((result) => {
        expect(result.length).to.be.greaterThan(0);
        expect(result[0].requestedBy).to.equal(2); // Content Manager ID
      });
    });
    
    it('SuperAdmin receives notification', () => {
      cy.task('checkEmail', {
        to: 'superadmin@test.com',
        subject: 'Content Approval Required'
      }).then((email) => {
        expect(email).to.exist;
        expect(email.body).to.include('manager@test.com');
        expect(email.body).to.include('Hero Banner');
      });
    });
  });
  
  // ========================================
  // FLOW STEP 2: Website Visitor Arrives
  // ========================================
  
  describe('Step 2: Website visitor arrives', () => {
    
    it('Visitor gets static HTML from Vercel instantly', () => {
      // Measure initial load time
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
          const measure = win.performance.getEntriesByName('pageLoad')[0];
          
          // Should load in under 500ms (static HTML)
          expect(measure.duration).to.be.lessThan(500);
        }
      });
      
      // HTML should have data attributes for Strapi
      cy.get('[data-section="hero-banner"]').should('exist');
      cy.get('[data-strapi-field="title"]').should('exist');
      
      // Should have fallback content (before JS runs)
      cy.get('[data-strapi-field="title"]')
        .should('contain.text')
        .and('not.be.empty');
    });
    
    it('No database credentials in HTML source', () => {
      cy.visit('/');
      
      // View page source
      cy.document().then((doc) => {
        const html = doc.documentElement.outerHTML;
        
        // Should NOT contain any database info
        expect(html).to.not.include('DATABASE_URL');
        expect(html).to.not.include('postgresql://');
        expect(html).to.not.include('postgres');
        expect(html).to.not.include('5432'); // PostgreSQL port
        
        // Should NOT contain sensitive keys
        expect(html).to.not.include('JWT_SECRET');
        expect(html).to.not.include('API_TOKEN_SALT');
        expect(html).to.not.include('CLOUDINARY_SECRET');
      });
    });
  });
  
  // ========================================
  // FLOW STEP 3: JavaScript Asks for Updates
  // ========================================
  
  describe('Step 3: JavaScript runs and asks Strapi', () => {
    
    it('JavaScript makes secure API call to Strapi', () => {
      // Intercept API call
      cy.intercept('GET', '**/api/pages*', (req) => {
        // Check security headers
        expect(req.headers).to.have.property('authorization');
        expect(req.headers.authorization).to.include('Bearer');
        
        // Should NOT have database credentials
        expect(req.headers).to.not.have.property('database-url');
        expect(req.url).to.not.include('postgresql');
        
        // Should have CORS headers
        expect(req.headers).to.have.property('content-type');
      }).as('getPages');
      
      cy.visit('/');
      cy.wait('@getPages');
    });
    
    it('API requires valid token', () => {
      // Try without token - should fail
      cy.request({
        method: 'GET',
        url: '/api/pages',
        failOnStatusCode: false,
        headers: {}
      }).then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('error');
      });
      
      // Try with invalid token - should fail
      cy.request({
        method: 'GET',
        url: '/api/pages',
        failOnStatusCode: false,
        headers: {
          'Authorization': 'Bearer INVALID_TOKEN_12345'
        }
      }).then((response) => {
        expect(response.status).to.equal(401);
      });
      
      // Try with valid read-only token - should work
      cy.request({
        method: 'GET',
        url: '/api/pages',
        headers: {
          'Authorization': `Bearer ${Cypress.env('PUBLIC_API_TOKEN')}`
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('data');
      });
    });
    
    it('Frontend cannot make direct database queries', () => {
      // Try to connect to PostgreSQL directly - should fail
      cy.window().then((win) => {
        // Attempt SQL injection via API
        cy.request({
          method: 'GET',
          url: "/api/pages?filters[slug][$eq]='; DROP TABLE users; --",
          failOnStatusCode: false,
          headers: {
            'Authorization': `Bearer ${Cypress.env('PUBLIC_API_TOKEN')}`
          }
        }).then((response) => {
          // Should sanitize input, not execute SQL
          expect(response.status).to.not.equal(500);
          
          // Database should still have users table
          cy.task('queryDatabase', {
            query: 'SELECT COUNT(*) FROM admin_users'
          }).then((result) => {
            expect(result.count).to.be.greaterThan(0);
          });
        });
      });
    });
  });
  
  // ========================================
  // FLOW STEP 4: Strapi Checks PostgreSQL
  // ========================================
  
  describe('Step 4: Strapi checks PostgreSQL', () => {
    
    it('Only Strapi can access database', () => {
      // This runs on backend only
      cy.task('testDatabaseAccess').then((result) => {
        expect(result.strapiCanConnect).to.be.true;
        expect(result.directConnectionBlocked).to.be.true;
        expect(result.connectionString).to.include('postgresql://');
      });
    });
    
    it('Strapi returns only approved content', () => {
      cy.request({
        method: 'GET',
        url: '/api/page-sections',
        headers: {
          'Authorization': `Bearer ${Cypress.env('PUBLIC_API_TOKEN')}`
        }
      }).then((response) => {
        const sections = response.body.data;
        
        sections.forEach(section => {
          // Should only return live versions
          expect(section.attributes).to.have.property('content');
          expect(section.attributes).to.not.have.property('draftVersion');
          
          // Should not expose sensitive fields
          expect(section.attributes).to.not.have.property('approvalStatus');
          expect(section.attributes).to.not.have.property('lastEditedBy');
        });
      });
    });
    
    it('Strapi sanitizes all output', () => {
      // Create malicious content
      cy.task('createMaliciousContent', {
        title: '<script>alert("XSS")</script>',
        description: 'SELECT * FROM users',
        buttonUrl: 'javascript:alert(1)'
      });
      
      // Fetch via API
      cy.request({
        method: 'GET',
        url: '/api/page-sections/999', // Malicious content ID
        headers: {
          'Authorization': `Bearer ${Cypress.env('PUBLIC_API_TOKEN')}`
        }
      }).then((response) => {
        const content = response.body.data.attributes.content;
        
        // Should be sanitized
        expect(content.title).to.not.include('<script>');
        expect(content.description).to.equal('SELECT * FROM users'); // Text only
        expect(content.buttonUrl).to.not.include('javascript:');
      });
    });
  });
  
  // ========================================
  // FLOW STEP 5: Website Updates
  // ========================================
  
  describe('Step 5: Website updates and shows content', () => {
    
    it('Website displays current live content', () => {
      cy.visit('/');
      
      // Wait for content to load
      cy.wait(500);
      
      // Should show current approved content
      cy.get('[data-strapi-field="title"]')
        .should('contain', 'Unlock Potential'); // Original, not draft
      
      // Draft content should NOT be visible
      cy.get('[data-strapi-field="title"]')
        .should('not.contain', 'Winter Sale 2024');
    });
    
    it('SuperAdmin approves and content goes live', () => {
      // Login as SuperAdmin
      cy.login('superadmin@test.com', 'SuperAdmin123!');
      
      // Go to approval requests
      cy.visit('/admin/content-manager/collectionType/api::approval-request.approval-request');
      
      // Find and approve request
      cy.get('[data-status="pending"]').first().click();
      cy.get('button').contains('Approve').click();
      
      // Logout
      cy.get('[data-testid="logout"]').click();
      
      // Visit frontend
      cy.visit('/');
      cy.wait(1000); // Wait for cache update
      
      // Now should show new content
      cy.get('[data-strapi-field="title"]')
        .should('contain', 'Welcome to Winter Sale 2024');
    });
    
    it('Multi-language content works correctly', () => {
      // Test Russian
      cy.visit('/', {
        headers: {
          'Accept-Language': 'ru-RU,ru;q=0.9'
        }
      });
      
      cy.get('[data-strapi-field="title"]')
        .should('contain', 'Добро пожаловать на зимнюю распродажу');
      
      // Test Hebrew with RTL
      cy.visit('/', {
        headers: {
          'Accept-Language': 'he-IL,he;q=0.9'
        }
      });
      
      cy.get('html').should('have.attr', 'dir', 'rtl');
      cy.get('[data-strapi-field="title"]')
        .should('contain', 'ברוכים הבאים למכירת החורף');
    });
  });
  
  // ========================================
  // SECURITY BENEFITS VALIDATION
  // ========================================
  
  describe('Security Benefits Validation', () => {
    
    it('🔒 Database credentials never exposed', () => {
      // Check browser console
      cy.visit('/');
      
      cy.window().then((win) => {
        // Try to access credentials
        expect(win.DATABASE_URL).to.be.undefined;
        expect(win.POSTGRESQL_PASSWORD).to.be.undefined;
        
        // Check localStorage
        expect(win.localStorage.getItem('DATABASE_URL')).to.be.null;
        
        // Check sessionStorage
        expect(win.sessionStorage.getItem('DATABASE_URL')).to.be.null;
      });
      
      // Check network requests
      cy.intercept('**/*', (req) => {
        expect(req.headers).to.not.have.property('x-database-url');
        expect(req.url).to.not.include('postgresql://');
      });
    });
    
    it('🛡️ SQL injection impossible from frontend', () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM admin_users--",
        "1; DELETE FROM pages WHERE 1=1"
      ];
      
      sqlInjectionAttempts.forEach(attempt => {
        cy.request({
          method: 'GET',
          url: `/api/pages?filters[slug][$eq]=${encodeURIComponent(attempt)}`,
          failOnStatusCode: false,
          headers: {
            'Authorization': `Bearer ${Cypress.env('PUBLIC_API_TOKEN')}`
          }
        }).then((response) => {
          // Should not cause server error
          expect(response.status).to.not.equal(500);
          
          // Should return empty or sanitized result
          if (response.status === 200) {
            expect(response.body.data).to.have.length(0);
          }
        });
      });
      
      // Verify database is intact
      cy.task('queryDatabase', {
        query: 'SELECT tablename FROM pg_tables WHERE schemaname = $1',
        params: ['public']
      }).then((tables) => {
        expect(tables).to.include.deep({ tablename: 'pages' });
        expect(tables).to.include.deep({ tablename: 'admin_users' });
      });
    });
    
    it('🔑 API tokens control access', () => {
      // Test different token permissions
      const tokens = {
        none: null,
        invalid: 'Bearer INVALID_TOKEN',
        readOnly: `Bearer ${Cypress.env('PUBLIC_API_TOKEN')}`,
        expired: `Bearer ${Cypress.env('EXPIRED_TOKEN')}`
      };
      
      Object.entries(tokens).forEach(([type, token]) => {
        // Try to read
        cy.request({
          method: 'GET',
          url: '/api/pages',
          failOnStatusCode: false,
          headers: token ? { 'Authorization': token } : {}
        }).then((response) => {
          if (type === 'readOnly') {
            expect(response.status).to.equal(200);
          } else {
            expect(response.status).to.equal(401);
          }
        });
        
        // Try to write (should all fail)
        cy.request({
          method: 'POST',
          url: '/api/pages',
          failOnStatusCode: false,
          headers: token ? { 'Authorization': token } : {},
          body: {
            data: {
              pageName: 'Hacked Page',
              slug: 'hacked'
            }
          }
        }).then((response) => {
          expect(response.status).to.not.equal(200);
          expect(response.status).to.not.equal(201);
        });
      });
    });
    
    it('📊 Rate limiting prevents abuse', () => {
      const requests = [];
      
      // Make 101 rapid requests
      for (let i = 0; i < 101; i++) {
        requests.push(
          cy.request({
            method: 'GET',
            url: '/api/pages',
            failOnStatusCode: false,
            headers: {
              'Authorization': `Bearer ${Cypress.env('PUBLIC_API_TOKEN')}`
            }
          })
        );
      }
      
      cy.wrap(Promise.all(requests)).then((responses) => {
        // Should hit rate limit
        const rateLimited = responses.filter(r => r.status === 429);
        expect(rateLimited.length).to.be.greaterThan(0);
        
        // Should have rate limit headers
        const limitedResponse = rateLimited[0];
        expect(limitedResponse.headers).to.have.property('x-ratelimit-limit');
        expect(limitedResponse.headers).to.have.property('x-ratelimit-remaining');
        expect(limitedResponse.headers).to.have.property('retry-after');
      });
      
      // Wait for rate limit to reset
      cy.wait(60000);
    });
    
    it('🚫 No direct queries from browser', () => {
      cy.visit('/');
      
      // Check window object
      cy.window().then((win) => {
        // Should not have database libraries
        expect(win.pg).to.be.undefined;
        expect(win.mysql).to.be.undefined;
        expect(win.knex).to.be.undefined;
        expect(win.sequelize).to.be.undefined;
        
        // Try to import database library (should fail)
        try {
          win.eval("require('pg')");
          expect.fail('Should not be able to require pg');
        } catch (e) {
          expect(e.message).to.include('require is not defined');
        }
      });
      
      // Try WebSocket connection to PostgreSQL port (should fail)
      cy.window().then((win) => {
        const ws = new win.WebSocket('ws://localhost:5432');
        
        cy.wrap(new Promise((resolve) => {
          ws.onerror = () => resolve('failed');
          ws.onopen = () => resolve('connected');
          
          setTimeout(() => resolve('timeout'), 1000);
        })).then((result) => {
          expect(result).to.not.equal('connected');
        });
      });
    });
  });
  
  // ========================================
  // PERFORMANCE & FALLBACK TESTING
  // ========================================
  
  describe('Performance and Fallback System', () => {
    
    it('Website loads fast with CDN', () => {
      cy.visit('/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start');
        },
        onLoad: (win) => {
          win.performance.mark('end');
          win.performance.measure('pageLoad', 'start', 'end');
        }
      });
      
      cy.window().its('performance').then((perf) => {
        const measure = perf.getEntriesByName('pageLoad')[0];
        
        // Should load in under 2 seconds
        expect(measure.duration).to.be.lessThan(2000);
        
        // Check resource timing
        const resources = perf.getEntriesByType('resource');
        
        // Static assets should be from CDN
        resources.forEach(resource => {
          if (resource.name.includes('.js') || 
              resource.name.includes('.css') || 
              resource.name.includes('.jpg')) {
            // Should be cached
            expect(resource.transferSize).to.be.lessThan(resource.decodedBodySize);
          }
        });
      });
    });
    
    it('Fallback works when Strapi is down', () => {
      // Block Strapi API
      cy.intercept('GET', '**/api/**', { forceNetworkError: true }).as('apiBlocked');
      
      cy.visit('/');
      cy.wait('@apiBlocked');
      
      // Should still show fallback content
      cy.get('[data-section="hero-banner"]').should('be.visible');
      cy.get('h1').should('not.be.empty');
      
      // Should show cached or hardcoded content
      cy.get('[data-strapi-field="title"]').should('have.text');
      
      // Check console for fallback message
      cy.window().then((win) => {
        cy.spy(win.console, 'warn');
        expect(win.console.warn).to.be.calledWith('Using fallback content');
      });
    });
    
    it('Images load from Cloudinary CDN', () => {
      cy.visit('/');
      
      cy.get('img[data-strapi-media]').each(($img) => {
        const src = $img.attr('src');
        
        // Should be from Cloudinary
        expect(src).to.include('res.cloudinary.com');
        
        // Should have optimization parameters
        expect(src).to.satisfy((url) => {
          return url.includes('q_auto') || // Auto quality
                 url.includes('f_auto') || // Auto format
                 url.includes('w_');      // Width parameter
        });
        
        // Image should load successfully
        cy.request(src).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.headers['content-type']).to.include('image');
          
          // Should be cached
          expect(response.headers).to.have.property('cache-control');
          expect(response.headers['cache-control']).to.include('max-age');
        });
      });
    });
  });
});

// Custom Commands
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/admin/auth/login');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin');
  });
});

// Support file additions
Cypress.Commands.add('checkApiSecurity', () => {
  // Comprehensive API security check
  const securityTests = [
    { test: 'SQL Injection', payload: "' OR '1'='1" },
    { test: 'XSS', payload: '<script>alert(1)</script>' },
    { test: 'Command Injection', payload: '; ls -la' },
    { test: 'Path Traversal', payload: '../../etc/passwd' },
    { test: 'XXE', payload: '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>' }
  ];
  
  securityTests.forEach(({ test, payload }) => {
    cy.request({
      method: 'GET',
      url: `/api/pages?filters[slug][$eq]=${encodeURIComponent(payload)}`,
      failOnStatusCode: false,
      headers: {
        'Authorization': `Bearer ${Cypress.env('PUBLIC_API_TOKEN')}`
      }
    }).then((response) => {
      expect(response.status).to.not.equal(500, `${test} protection failed`);
    });
  });
});