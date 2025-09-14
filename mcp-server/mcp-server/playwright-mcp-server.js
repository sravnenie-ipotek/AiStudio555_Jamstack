#!/usr/bin/env node

/**
 * MCP Server for Playwright Web Automation
 * Provides Nightmare.js-like functionality using modern Playwright
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { chromium, firefox, webkit } from 'playwright';

class PlaywrightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browsers = new Map();
    this.pages = new Map();

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // Define available tools
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'browser_launch',
          description: 'Launch a new browser instance (chromium, firefox, or webkit)',
          inputSchema: {
            type: 'object',
            properties: {
              browser: {
                type: 'string',
                enum: ['chromium', 'firefox', 'webkit'],
                default: 'chromium',
                description: 'Browser type to launch'
              },
              headless: {
                type: 'boolean',
                default: true,
                description: 'Run browser in headless mode'
              },
              viewport: {
                type: 'object',
                properties: {
                  width: { type: 'number', default: 1280 },
                  height: { type: 'number', default: 720 }
                }
              }
            }
          }
        },
        {
          name: 'page_goto',
          description: 'Navigate to a URL',
          inputSchema: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to navigate to'
              },
              browserId: {
                type: 'string',
                description: 'Browser instance ID'
              },
              waitUntil: {
                type: 'string',
                enum: ['load', 'domcontentloaded', 'networkidle'],
                default: 'load'
              }
            },
            required: ['url', 'browserId']
          }
        },
        {
          name: 'page_click',
          description: 'Click an element on the page',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the element to click'
              },
              browserId: {
                type: 'string',
                description: 'Browser instance ID'
              },
              timeout: {
                type: 'number',
                default: 30000
              }
            },
            required: ['selector', 'browserId']
          }
        },
        {
          name: 'page_type',
          description: 'Type text into an input field',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector for the input element'
              },
              text: {
                type: 'string',
                description: 'Text to type'
              },
              browserId: {
                type: 'string',
                description: 'Browser instance ID'
              }
            },
            required: ['selector', 'text', 'browserId']
          }
        },
        {
          name: 'page_wait',
          description: 'Wait for an element or condition',
          inputSchema: {
            type: 'object',
            properties: {
              selector: {
                type: 'string',
                description: 'CSS selector to wait for'
              },
              browserId: {
                type: 'string',
                description: 'Browser instance ID'
              },
              timeout: {
                type: 'number',
                default: 30000
              },
              state: {
                type: 'string',
                enum: ['attached', 'detached', 'visible', 'hidden'],
                default: 'visible'
              }
            },
            required: ['selector', 'browserId']
          }
        },
        {
          name: 'page_evaluate',
          description: 'Execute JavaScript in the page context',
          inputSchema: {
            type: 'object',
            properties: {
              script: {
                type: 'string',
                description: 'JavaScript code to execute'
              },
              browserId: {
                type: 'string',
                description: 'Browser instance ID'
              }
            },
            required: ['script', 'browserId']
          }
        },
        {
          name: 'page_screenshot',
          description: 'Take a screenshot of the page',
          inputSchema: {
            type: 'object',
            properties: {
              browserId: {
                type: 'string',
                description: 'Browser instance ID'
              },
              path: {
                type: 'string',
                description: 'File path to save screenshot'
              },
              fullPage: {
                type: 'boolean',
                default: false
              }
            },
            required: ['browserId']
          }
        },
        {
          name: 'page_content',
          description: 'Get page HTML content',
          inputSchema: {
            type: 'object',
            properties: {
              browserId: {
                type: 'string',
                description: 'Browser instance ID'
              }
            },
            required: ['browserId']
          }
        },
        {
          name: 'browser_close',
          description: 'Close browser instance',
          inputSchema: {
            type: 'object',
            properties: {
              browserId: {
                type: 'string',
                description: 'Browser instance ID to close'
              }
            },
            required: ['browserId']
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'browser_launch':
            return await this.launchBrowser(args);

          case 'page_goto':
            return await this.pageGoto(args);

          case 'page_click':
            return await this.pageClick(args);

          case 'page_type':
            return await this.pageType(args);

          case 'page_wait':
            return await this.pageWait(args);

          case 'page_evaluate':
            return await this.pageEvaluate(args);

          case 'page_screenshot':
            return await this.pageScreenshot(args);

          case 'page_content':
            return await this.pageContent(args);

          case 'browser_close':
            return await this.browserClose(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async launchBrowser(args) {
    const { browser = 'chromium', headless = true, viewport = { width: 1280, height: 720 } } = args;

    let browserInstance;
    switch (browser) {
      case 'chromium':
        browserInstance = await chromium.launch({ headless });
        break;
      case 'firefox':
        browserInstance = await firefox.launch({ headless });
        break;
      case 'webkit':
        browserInstance = await webkit.launch({ headless });
        break;
      default:
        throw new Error(`Unsupported browser: ${browser}`);
    }

    const context = await browserInstance.newContext({ viewport });
    const page = await context.newPage();

    const browserId = `${browser}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    this.browsers.set(browserId, { browser: browserInstance, context, page });

    return {
      content: [
        {
          type: 'text',
          text: `Browser launched successfully. Browser ID: ${browserId}`
        }
      ]
    };
  }

  async pageGoto(args) {
    const { url, browserId, waitUntil = 'load' } = args;
    const browserData = this.browsers.get(browserId);

    if (!browserData) {
      throw new Error(`Browser not found: ${browserId}`);
    }

    await browserData.page.goto(url, { waitUntil });

    return {
      content: [
        {
          type: 'text',
          text: `Navigated to: ${url}`
        }
      ]
    };
  }

  async pageClick(args) {
    const { selector, browserId, timeout = 30000 } = args;
    const browserData = this.browsers.get(browserId);

    if (!browserData) {
      throw new Error(`Browser not found: ${browserId}`);
    }

    await browserData.page.click(selector, { timeout });

    return {
      content: [
        {
          type: 'text',
          text: `Clicked element: ${selector}`
        }
      ]
    };
  }

  async pageType(args) {
    const { selector, text, browserId } = args;
    const browserData = this.browsers.get(browserId);

    if (!browserData) {
      throw new Error(`Browser not found: ${browserId}`);
    }

    await browserData.page.fill(selector, text);

    return {
      content: [
        {
          type: 'text',
          text: `Typed "${text}" into ${selector}`
        }
      ]
    };
  }

  async pageWait(args) {
    const { selector, browserId, timeout = 30000, state = 'visible' } = args;
    const browserData = this.browsers.get(browserId);

    if (!browserData) {
      throw new Error(`Browser not found: ${browserId}`);
    }

    await browserData.page.waitForSelector(selector, { timeout, state });

    return {
      content: [
        {
          type: 'text',
          text: `Waited for element: ${selector} (state: ${state})`
        }
      ]
    };
  }

  async pageEvaluate(args) {
    const { script, browserId } = args;
    const browserData = this.browsers.get(browserId);

    if (!browserData) {
      throw new Error(`Browser not found: ${browserId}`);
    }

    const result = await browserData.page.evaluate(script);

    return {
      content: [
        {
          type: 'text',
          text: `Script result: ${JSON.stringify(result, null, 2)}`
        }
      ]
    };
  }

  async pageScreenshot(args) {
    const { browserId, path, fullPage = false } = args;
    const browserData = this.browsers.get(browserId);

    if (!browserData) {
      throw new Error(`Browser not found: ${browserId}`);
    }

    const screenshot = await browserData.page.screenshot({
      path: path || undefined,
      fullPage
    });

    return {
      content: [
        {
          type: 'text',
          text: path
            ? `Screenshot saved to: ${path}`
            : `Screenshot taken (${screenshot.length} bytes)`
        }
      ]
    };
  }

  async pageContent(args) {
    const { browserId } = args;
    const browserData = this.browsers.get(browserId);

    if (!browserData) {
      throw new Error(`Browser not found: ${browserId}`);
    }

    const content = await browserData.page.content();

    return {
      content: [
        {
          type: 'text',
          text: content
        }
      ]
    };
  }

  async browserClose(args) {
    const { browserId } = args;
    const browserData = this.browsers.get(browserId);

    if (!browserData) {
      throw new Error(`Browser not found: ${browserId}`);
    }

    await browserData.browser.close();
    this.browsers.delete(browserId);

    return {
      content: [
        {
          type: 'text',
          text: `Browser ${browserId} closed successfully`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Playwright MCP Server running on stdio');
  }
}

const server = new PlaywrightMCPServer();
server.run().catch(console.error);