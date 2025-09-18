/**
 * Manual QA Test for Shared Menu Component
 */

class ManualMenuQA {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.currentTest = null;
  }

  async runAllTests() {
    console.log('🎯 Starting Manual Menu QA Tests');
    console.log('================================');
    
    await this.testBasicFunctionality();
    await this.testResponsiveDesign();
    await this.testWebflowIndependence();
    
    this.printResults();
  }

  startTest(name) {
    this.currentTest = { name, status: 'running', details: [] };
    console.log('\n🧪 Testing: ' + name);
  }

  passTest(message) {
    if (this.currentTest) {
      this.currentTest.status = 'passed';
      if (message) this.currentTest.details.push('✅ ' + message);
      this.results.passed++;
      this.results.tests.push(this.currentTest);
      console.log('✅ PASS: ' + this.currentTest.name + (message ? ' - ' + message : ''));
    }
  }

  failTest(message) {
    if (this.currentTest) {
      this.currentTest.status = 'failed';
      if (message) this.currentTest.details.push('❌ ' + message);
      this.results.failed++;
      this.results.tests.push(this.currentTest);
      console.log('❌ FAIL: ' + this.currentTest.name + (message ? ' - ' + message : ''));
    }
  }

  warnTest(message) {
    if (this.currentTest) {
      this.currentTest.details.push('⚠️ ' + message);
      this.results.warnings++;
      console.log('⚠️ WARN: ' + message);
    }
  }

  async testBasicFunctionality() {
    this.startTest('Basic Menu Functionality');
    
    try {
      const navbar = document.querySelector('.navbar');
      if (!navbar) {
        this.failTest('Navbar element not found');
        return;
      }
      
      const navLinks = document.querySelectorAll('.nav-link');
      if (navLinks.length === 0) {
        this.failTest('No navigation links found');
        return;
      }
      
      const dropdowns = document.querySelectorAll('.menu-dropdown-wrapper');
      if (dropdowns.length < 2) {
        this.warnTest('Expected at least 2 dropdown menus');
      }
      
      this.passTest('All basic elements present');
      
    } catch (error) {
      this.failTest('Error: ' + error.message);
    }
  }

  async testResponsiveDesign() {
    this.startTest('Responsive Design');
    
    try {
      const mobileMenuButton = document.querySelector('.menu-button');
      if (!mobileMenuButton) {
        this.failTest('Mobile menu button not found');
        return;
      }
      
      const hamburgerLines = document.querySelectorAll('.hamburger-line');
      if (hamburgerLines.length !== 3) {
        this.failTest('Expected 3 hamburger lines');
        return;
      }
      
      this.passTest('Responsive elements present');
      
    } catch (error) {
      this.failTest('Error: ' + error.message);
    }
  }

  async testWebflowIndependence() {
    this.startTest('Webflow Independence');
    
    try {
      if (window.SharedMenu) {
        this.passTest('SharedMenu object available');
      } else {
        this.failTest('SharedMenu object not found');
      }
      
    } catch (error) {
      this.failTest('Error: ' + error.message);
    }
  }

  printResults() {
    console.log('\n📊 QA Test Results Summary');
    console.log('==========================');
    console.log('✅ Passed: ' + this.results.passed);
    console.log('❌ Failed: ' + this.results.failed);
    console.log('⚠️ Warnings: ' + this.results.warnings);
    console.log('📝 Total Tests: ' + this.results.tests.length);
    
    const successRate = (this.results.passed / this.results.tests.length * 100).toFixed(1);
    console.log('📈 Success Rate: ' + successRate + '%');
    
    console.log('\n🎯 QA Test Complete!');
    
    return this.results;
  }
}

if (typeof window !== 'undefined') {
  const qa = new ManualMenuQA();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => qa.runAllTests(), 1000);
    });
  } else {
    setTimeout(() => qa.runAllTests(), 1000);
  }
  
  window.ManualMenuQA = qa;
}
