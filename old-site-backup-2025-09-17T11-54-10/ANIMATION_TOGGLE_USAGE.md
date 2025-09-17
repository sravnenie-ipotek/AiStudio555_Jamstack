# New Design Animation Toggle System

## Overview
The animation toggle system allows users to disable all animations on New Design pages for better accessibility and performance. The system includes localStorage persistence, automatic toggle button creation, and comprehensive CSS animation disabling.

## System Components

### 1. Enhanced NDPageLoader Class (`js/nd-integration.js`)
- **New Methods Added:**
  - `toggleAnimations()` - Toggles animation state
  - `getAnimationsDisabled()` - Returns current animation state
  - `setAnimationsDisabled(disabled)` - Sets animation state
  - `applyAnimationsPreference()` - Applies current preference to DOM
  - `updateAnimationToggleButtons(disabled)` - Updates toggle button states

### 2. Enhanced AnimationToggle Class (`js/nd-integration.js`)
- **Features:**
  - Auto-creates toggle button in development/preview mode
  - Saves preferences to localStorage
  - Provides visual feedback when toggling
  - Supports server synchronization in preview mode
  - Respects system accessibility preferences
  - Mobile-responsive button design

### 3. Animation Control CSS (`css/nd-animations.css`)
- **Comprehensive animation disabling:**
  - Universal `*` selector with `!important` rules
  - Webflow-specific animation overrides
  - Content visibility fixes for opacity/transform
  - Loading state management
  - Accessibility improvements
  - Mobile-responsive toggle button styling

### 4. Updated HTML Template (`nd/index.html`)
- **Includes:**
  - Early animation preference detection
  - System motion preference respect
  - Enhanced initialization logging
  - Debug tools for development

## Usage

### Automatic Usage
The system works automatically when the New Design page loads:

```javascript
// System initializes automatically on DOMContentLoaded
// No additional setup required
```

### Manual Control (Development)
```javascript
// Available in console during development (localhost)
ndDebug.toggleAnimations()  // Toggle on/off
ndDebug.enableAnimations()  // Force enable
ndDebug.disableAnimations() // Force disable
ndDebug.showToggle()        // Show toggle button
ndDebug.hideToggle()        // Hide toggle button
```

### Programmatic Control
```javascript
// Access the global animation toggle instance
if (window.ndAnimationToggle) {
    window.ndAnimationToggle.toggle();         // Toggle state
    window.ndAnimationToggle.enable();         // Enable animations
    window.ndAnimationToggle.disable();        // Disable animations
    window.ndAnimationToggle.show();           // Show toggle button
    window.ndAnimationToggle.hide();           // Hide toggle button
}
```

### Custom Event Listening
```javascript
// Listen for animation state changes
window.addEventListener('nd:animationsToggled', (e) => {
    console.log(`Animations ${e.detail.disabled ? 'disabled' : 'enabled'}`);
});
```

## Configuration Options

### AnimationToggle Constructor Options
```javascript
new AnimationToggle({
    showInPreview: true,        // Show button in preview mode
    showInProduction: false,    // Show button in production
    position: 'bottom-left',    // Button position
    autoShow: true              // Auto-show based on environment
});
```

### Position Options
- `'bottom-left'` (default)
- `'bottom-right'`
- `'top-left'`
- `'top-right'`

## CSS Classes

### Animation Disabling
- `.no-animations` - Applied to `<html>` when animations are disabled
- `.no-animations *` - Disables all animations on child elements

### Button Styling
- `.nd-animation-toggle` - Main toggle button class
- `.nd-animation-toggle.disabled` - Disabled state styling

### Utility Classes
- `.transform-preserve` - Preserve essential transforms when animations disabled
- `.transition-preserve` - Preserve essential transitions (0.1s max)
- `.gpu-accelerated` - Optimize animations when enabled

## localStorage Key
- `'nd_animations_disabled'` - Stores animation preference as string ('true'/'false')

## Accessibility Features

1. **System Preference Respect:**
   - Automatically detects `prefers-reduced-motion: reduce`
   - Sets animations to disabled if user prefers reduced motion

2. **Visual Feedback:**
   - Toggle button shows current state with icon and text
   - Temporary feedback message on toggle
   - High contrast mode support

3. **Keyboard Accessible:**
   - Toggle button is focusable and keyboard accessible
   - Proper ARIA labeling via title attribute

## Testing

### Manual Testing
1. Open `http://localhost:3005/nd/index.html`
2. Look for toggle button in bottom-left corner
3. Click to toggle animations on/off
4. Refresh page to verify persistence
5. Check console for animation state logs

### Automated Testing
```bash
node test-animation-system.js
```

## File Structure
```
/Users/michaelmishayev/Desktop/newCode/
├── js/nd-integration.js          # Enhanced with animation control
├── css/nd-animations.css         # Animation control styles
├── nd/index.html                 # Updated with CSS include
└── test-animation-system.js      # Test script
```

## Browser Compatibility
- **Modern Browsers:** Full support (Chrome 80+, Firefox 75+, Safari 13+)
- **localStorage:** Graceful degradation if unavailable
- **CSS:** Progressive enhancement with fallbacks

## Performance Impact
- **When Enabled:** Minimal overhead (CSS-only animation control)
- **When Disabled:** Significant performance improvement (no animations/transitions)
- **Toggle Button:** Lightweight (~2KB total footprint)

## Troubleshooting

### Toggle Button Not Appearing
- Check if in development/preview mode
- Verify `nd-integration.js` is loaded
- Check console for JavaScript errors

### Animations Not Disabling
- Verify `.no-animations` class on `<html>`
- Check if `nd-animations.css` is loaded
- Look for CSS conflicts with higher specificity

### localStorage Not Persisting
- Check browser privacy settings
- Verify no errors in console
- Test in incognito mode

## Future Enhancements
- Server-side preference storage
- Per-section animation control
- Animation speed control (not just on/off)
- Custom animation profiles