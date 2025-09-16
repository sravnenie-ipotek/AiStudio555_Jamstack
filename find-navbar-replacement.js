const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Intercept any DOM modifications
  await page.addInitScript(() => {
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    const originalReplaceChild = Node.prototype.replaceChild;
    const originalAppendChild = Node.prototype.appendChild;

    let modifications = [];

    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function(value) {
        if (this.classList.contains('navbar') || this.classList.contains('navbar-content')) {
          console.log('🔧 Navbar innerHTML change detected:', this.className, value.substring(0, 200));
          modifications.push({
            type: 'innerHTML',
            element: this.className,
            content: value.substring(0, 200)
          });
        }
        return originalInnerHTML.set.call(this, value);
      },
      get: originalInnerHTML.get
    });

    Node.prototype.replaceChild = function(newChild, oldChild) {
      if (oldChild && (oldChild.classList?.contains('navbar') || oldChild.classList?.contains('navbar-content'))) {
        console.log('🔧 Navbar replaceChild detected');
        modifications.push({
          type: 'replaceChild',
          oldChild: oldChild.className || 'no-class',
          newChild: newChild.className || 'no-class'
        });
      }
      return originalReplaceChild.call(this, newChild, oldChild);
    };

    Node.prototype.appendChild = function(child) {
      if (this.classList?.contains('navbar') || this.classList?.contains('navbar-content')) {
        console.log('🔧 Navbar appendChild detected:', child.className || 'no-class');
        modifications.push({
          type: 'appendChild',
          parent: this.className,
          child: child.className || 'no-class'
        });
      }
      return originalAppendChild.call(this, child);
    };

    window.getNavbarModifications = () => modifications;
  });

  await page.goto('http://localhost:3005/home.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  const modifications = await page.evaluate(() => window.getNavbarModifications());
  console.log('Navbar modifications detected:', modifications);

  // Check initial state vs final state
  const comparison = await page.evaluate(() => {
    const navbar = document.querySelector('.navbar');
    const staticStructure = navbar?.outerHTML || 'NOT FOUND';

    return {
      staticExists: !!document.querySelector('.zohacous-logo-link'),
      dynamicExists: !!document.querySelector('.nav-brand'),
      navbarHTML: staticStructure.substring(0, 500)
    };
  });

  console.log('Structure comparison:', comparison);

  await new Promise(resolve => setTimeout(resolve, 3000));
  await browser.close();
})();