# Playwright MCP Server

A Model Context Protocol (MCP) server that provides web automation capabilities using Playwright, serving as a modern alternative to Nightmare.js.

## Features

- **Multi-browser support**: Chromium, Firefox, and WebKit
- **Full page automation**: Navigate, click, type, wait for elements
- **JavaScript execution**: Run custom scripts in page context
- **Screenshot capture**: Full page or element screenshots
- **Content extraction**: Get HTML content and page data
- **Modern architecture**: Built with Playwright for reliability

## Installation

```bash
cd mcp-server
npm install
```

## Usage

### Starting the Server

```bash
npm start
```

### Available Tools

1. **browser_launch** - Launch a new browser instance
   - Parameters: `browser` (chromium/firefox/webkit), `headless`, `viewport`

2. **page_goto** - Navigate to a URL
   - Parameters: `url`, `browserId`, `waitUntil`

3. **page_click** - Click an element
   - Parameters: `selector`, `browserId`, `timeout`

4. **page_type** - Type text into an input field
   - Parameters: `selector`, `text`, `browserId`

5. **page_wait** - Wait for an element or condition
   - Parameters: `selector`, `browserId`, `timeout`, `state`

6. **page_evaluate** - Execute JavaScript in page context
   - Parameters: `script`, `browserId`

7. **page_screenshot** - Take a screenshot
   - Parameters: `browserId`, `path`, `fullPage`

8. **page_content** - Get page HTML content
   - Parameters: `browserId`

9. **browser_close** - Close browser instance
   - Parameters: `browserId`

## Example Usage via MCP

```javascript
// Launch browser
{
  "name": "browser_launch",
  "arguments": {
    "browser": "chromium",
    "headless": true,
    "viewport": {"width": 1280, "height": 720}
  }
}

// Navigate to page
{
  "name": "page_goto",
  "arguments": {
    "url": "https://example.com",
    "browserId": "chromium_123456_abc"
  }
}

// Take screenshot
{
  "name": "page_screenshot",
  "arguments": {
    "browserId": "chromium_123456_abc",
    "path": "/path/to/screenshot.png",
    "fullPage": true
  }
}
```

## Testing

Run the test suite to verify functionality:

```bash
npm test
```

## Advantages over Nightmare.js

- **Modern & Maintained**: Playwright is actively developed and supported
- **Better Performance**: Faster execution and more reliable
- **Multi-browser**: Support for Chromium, Firefox, and WebKit
- **Better Error Handling**: More detailed error messages and debugging
- **No Electron Dependency**: Lighter weight installation
- **Cross-platform**: Better compatibility across different operating systems

## MCP Integration

This server implements the Model Context Protocol, allowing AI assistants to:
- Automate web interactions
- Test web applications
- Scrape content from websites
- Generate screenshots and reports
- Perform end-to-end testing

Perfect for tasks that previously required Nightmare.js but with modern reliability and features.