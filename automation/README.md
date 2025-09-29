# Page Comparison Automation

## Overview
Automated tool to compare pages between local development and production environments, ensuring 100% identical content, visual appearance, and functionality.

## Features

### 1. Content Comparison
- HTML structure analysis
- Text content verification
- DOM element counting
- Link validation
- Normalizes dynamic content for accurate comparison

### 2. Visual Comparison
- Full-page screenshots across multiple viewports
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x812)
- Pixel-by-pixel comparison
- Automatic screenshot saving for differences

### 3. API Response Comparison
- Monitors all API calls
- Compares response status codes
- Tracks number of API requests
- Identifies missing or extra API calls

### 4. Performance Comparison
- Page load time metrics
- DOM content loaded timing
- First paint measurements
- Network performance analysis

## Installation

```bash
# Install dependencies (already included in main package.json)
npm install

# Install Playwright browsers if not already installed
npx playwright install
```

## Usage

### Quick Start

```bash
# Run the comparison
npm run compare

# Or directly
node automation/compare-local-prod.js
```

### Prerequisites

1. **Start Local Server:**
```bash
npm start
```

2. **Start Frontend Server:**
```bash
python3 -m http.server 3005
```

3. **Ensure Production is Accessible:**
- Production URL: https://www.aistudio555.com

## Configuration

Edit `automation/compare-local-prod.js` to modify:

```javascript
const CONFIG = {
  localUrl: 'http://localhost:3005',    // Local development URL
  prodUrl: 'https://www.aistudio555.com', // Production URL
  pages: [                               // Pages to compare
    '/home.html',
    '/courses.html',
    // ... add more pages
  ],
  diffThreshold: 0.01,                   // Visual difference threshold (1%)
  timeout: 30000                         // Page load timeout
};
```

## Output

### Reports Location
- **JSON Report:** `automation/reports/comparison-report-[timestamp].json`
- **HTML Report:** `automation/reports/comparison-report-[timestamp].html`
- **Screenshots:** `automation/screenshots/`

### Report Contents

#### Success Report
```
✅ SUCCESS: No differences found!
All 16 pages are identical between local and production.
```

#### Failure Report
```
❌ FAIL: Differences found in 3 pages
Pages with differences:
  • /home.html
  • /courses.html
  • /pricing.html
```

## Report Types

### HTML Report
- Visual dashboard with summary metrics
- Detailed difference breakdowns
- Color-coded status indicators
- Expandable sections for each page

### JSON Report
- Machine-readable format
- Complete comparison data
- Metrics and performance data
- Integration-ready format

## Difference Types

### Content Differences
- Text mismatches
- Missing elements
- Structure variations
- Link discrepancies

### Visual Differences
- Layout changes
- Styling variations
- Image differences
- Responsive issues

### API Differences
- Status code mismatches
- Missing endpoints
- Response variations
- Call count differences

### Performance Differences
- Load time variations
- Render timing changes
- Network performance gaps

## CI/CD Integration

### GitHub Actions
```yaml
- name: Compare Environments
  run: |
    npm start &
    sleep 5
    python3 -m http.server 3005 &
    sleep 3
    npm run compare
```

### Exit Codes
- `0` - All pages identical (PASS)
- `1` - Differences found (FAIL)

## Troubleshooting

### Common Issues

1. **Timeout Errors**
   - Increase `CONFIG.timeout` value
   - Check server accessibility

2. **Screenshot Differences**
   - Check for animation timing
   - Verify font loading
   - Review dynamic content

3. **API Mismatches**
   - Verify API endpoints
   - Check environment variables
   - Review CORS settings

## Advanced Usage

### Custom Page List
```javascript
const customPages = [
  '/dist/en/home.html',
  '/dist/ru/home.html',
  '/dist/he/home.html'
];
```

### Selective Comparison
```javascript
// Only visual comparison
await comparator.compareVisual(pagePath);

// Only content comparison
await comparator.compareContent(pagePath);
```

### Custom Viewports
```javascript
viewports: [
  { name: 'iPhone-12', width: 390, height: 844 },
  { name: '4K-Monitor', width: 3840, height: 2160 }
]
```

## Best Practices

1. **Regular Checks**
   - Run before deployments
   - Include in CI/CD pipeline
   - Schedule periodic checks

2. **Review Differences**
   - Check HTML reports for details
   - Compare screenshots manually
   - Verify API response data

3. **Maintain Consistency**
   - Keep environments synchronized
   - Update both environments together
   - Document intentional differences

## Support

For issues or questions, check:
- Generated reports in `automation/reports/`
- Screenshots in `automation/screenshots/`
- Console output for immediate feedback