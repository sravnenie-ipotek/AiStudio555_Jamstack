// Minimal SharedMenu implementation to test basic functionality
console.log('Minimal SharedMenu: Script loaded');

class MinimalSharedMenu {
  constructor() {
    console.log('MinimalSharedMenu: Constructor called');
    this.initialized = false;
  }

  init() {
    console.log('MinimalSharedMenu: init() called');
    if (this.initialized) return;

    // Find injection point
    const banner = document.querySelector('.banner');
    if (!banner) {
      console.log('MinimalSharedMenu: No .banner found for injection');
      return;
    }

    // Create simple menu
    const menu = document.createElement('div');
    menu.className = 'navbar w-nav';
    menu.innerHTML = '<div style="background: red; color: white; padding: 10px;">TEST MENU INJECTED</div>';

    // Inject before banner
    banner.parentNode.insertBefore(menu, banner);
    console.log('MinimalSharedMenu: Menu injected before banner');

    this.initialized = true;
  }
}

// Auto-initialize
console.log('MinimalSharedMenu: Setting up DOMContentLoaded listener');
document.addEventListener('DOMContentLoaded', function() {
  console.log('MinimalSharedMenu: DOMContentLoaded fired');

  const menu = new MinimalSharedMenu();
  menu.init();

  console.log('MinimalSharedMenu: Initialization complete');
});