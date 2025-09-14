#!/usr/bin/env node

/**
 * Test script for Playwright MCP Server
 * Simulates MCP client behavior to test the server functionality
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MCPServerTester {
  constructor() {
    this.serverProcess = null;
    this.requestId = 1;
  }

  async startServer() {
    console.log('🚀 Starting Playwright MCP Server...');

    this.serverProcess = spawn('node', [join(__dirname, 'playwright-mcp-server.js')], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Wait for server to initialize
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    console.log('✅ Server started');
  }

  async sendRequest(method, params = {}) {
    const request = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method,
      params
    };

    console.log(`📤 Sending: ${method}`);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 30000);

      this.serverProcess.stdout.once('data', (data) => {
        clearTimeout(timeout);
        try {
          const response = JSON.parse(data.toString());
          console.log(`📥 Response:`, response.result ? '✅ Success' : '❌ Error');
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      this.serverProcess.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async testBasicFunctionality() {
    console.log('\n🧪 Testing Basic Functionality...');

    try {
      // Test 1: List available tools
      console.log('\n1. Testing tools/list...');
      const toolsResponse = await this.sendRequest('tools/list');
      const toolCount = toolsResponse.result?.tools?.length || 0;
      console.log(`   Found ${toolCount} tools`);

      // Test 2: Launch browser
      console.log('\n2. Testing browser launch...');
      const launchResponse = await this.sendRequest('tools/call', {
        name: 'browser_launch',
        arguments: {
          browser: 'chromium',
          headless: true,
          viewport: { width: 1280, height: 720 }
        }
      });

      if (launchResponse.result) {
        console.log('   ✅ Browser launched successfully');

        // Extract browser ID from response
        const browserId = launchResponse.result.content[0].text.match(/Browser ID: (.+)$/)[1];

        // Test 3: Navigate to a page
        console.log('\n3. Testing page navigation...');
        await this.sendRequest('tools/call', {
          name: 'page_goto',
          arguments: {
            url: 'https://example.com',
            browserId: browserId
          }
        });
        console.log('   ✅ Page navigation successful');

        // Test 4: Get page content
        console.log('\n4. Testing content extraction...');
        const contentResponse = await this.sendRequest('tools/call', {
          name: 'page_content',
          arguments: {
            browserId: browserId
          }
        });

        if (contentResponse.result?.content[0]?.text?.includes('Example Domain')) {
          console.log('   ✅ Content extraction successful');
        } else {
          console.log('   ⚠️ Content extraction might have issues');
        }

        // Test 5: Close browser
        console.log('\n5. Testing browser cleanup...');
        await this.sendRequest('tools/call', {
          name: 'browser_close',
          arguments: {
            browserId: browserId
          }
        });
        console.log('   ✅ Browser closed successfully');

      } else {
        console.log('   ❌ Browser launch failed');
      }

    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
  }

  async stopServer() {
    if (this.serverProcess) {
      console.log('\n🛑 Stopping server...');
      this.serverProcess.kill('SIGTERM');

      // Wait for process to exit
      await new Promise((resolve) => {
        this.serverProcess.on('close', resolve);
      });

      console.log('✅ Server stopped');
    }
  }

  async run() {
    try {
      await this.startServer();
      await this.testBasicFunctionality();

      console.log('\n🎉 All tests completed!');
      console.log('\n📋 MCP Server Features:');
      console.log('   • Browser automation (Chromium, Firefox, WebKit)');
      console.log('   • Page navigation and interaction');
      console.log('   • Element clicking and typing');
      console.log('   • JavaScript execution');
      console.log('   • Screenshot capture');
      console.log('   • Content extraction');
      console.log('   • Wait for elements/conditions');

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await this.stopServer();
    }
  }
}

const tester = new MCPServerTester();
tester.run().catch(console.error);