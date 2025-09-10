# Local Testing Checklist

## Start Server
```bash
# In terminal, from project root:
cd /Users/michaelmishayev/Desktop/newCode
python3 -m http.server 9090
```

## Test URLs

### 1. Language Switcher Tests
- [ ] Open: http://localhost:9090/dist/en/index.html
- [ ] Switch to Russian - Should go to `/dist/ru/index.html` (NOT `/dist/ru/home.html`)
- [ ] Switch to Hebrew - Should go to `/dist/he/index.html`
- [ ] Check console for errors (F12 → Console tab)

### 2. Admin Panel Tests  
- [ ] Open: http://localhost:9090/content-admin-comprehensive.html
- [ ] Check console - Should NOT see "await is only valid in async functions"
- [ ] Click language buttons - Should switch without "switchLanguage is not defined" error
- [ ] Try saving Career Orientation - Should show success/error message

### 3. Career Pages Tests
- [ ] Open: http://localhost:9090/dist/en/career-orientation.html
- [ ] Check dropdown menu styling - Should be consistent
- [ ] Switch languages - Should work

### 4. Visual Test Tool
- [ ] Open: http://localhost:9090/test-language-switcher.html
- [ ] Click test buttons - Should show correct path conversions
- [ ] All tests should pass (green)

## What to Look For

### ✅ Good Signs:
- No red errors in console
- Language switching works
- Pages load without 404
- home.html → index.html conversion works

### ❌ Bad Signs:
- "Uncaught SyntaxError" in console
- "ReferenceError: switchLanguage is not defined"
- 404 errors when switching languages
- Dropdown menu styling inconsistent

## Console Commands to Test

Open browser console (F12) and run:
```javascript
// Check if language switcher exists
typeof switchLanguage

// Check current language
localStorage.getItem('aistudio_language')

// Test switching
switchLanguage('ru')
```

## Quick Fix Verification

1. **Language Switcher Working:**
   - See dropdown in top-right corner
   - Can switch between EN/RU/HE
   - No 404 errors

2. **Admin Panel Working:**
   - No async/await errors
   - Language buttons work
   - Can save content

3. **Career Services Consistent:**
   - Dropdown looks same on all pages
   - No blue background when active