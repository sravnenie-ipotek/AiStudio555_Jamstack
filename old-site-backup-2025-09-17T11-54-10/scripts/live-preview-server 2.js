#!/usr/bin/env node

/**
 * Live Preview Server
 * WebSocket server for real-time content updates from Strapi
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3005', 'http://localhost:8000', 'http://localhost:1337'],
    methods: ['GET', 'POST']
  }
});

// Configuration
const PORT = process.env.PREVIEW_SERVER_PORT || 3006;
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '6ba76f584778637fd308f48aac27461c1aca7f088c963d614ad2e73bb7f3f9a646ad9e38cf12e5bd8f7e6f8e0ad2f014ea90ee088bb8a3c3c84a40f9fb0c592e5c8b05e8d25c09f4a9c0b685b2c90bacd5e604fbe4e1b01e0a6e32c76e7e93b1f21e5e47dcad5e80a6b0cf967e2a38b74f5edd19e92f5c0e6d387e1c16e5ce59';

// Middleware
app.use(cors());
app.use(express.json());

// Store active preview sessions
const previewSessions = new Map();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 New preview client connected:', socket.id);
  
  // Handle preview session initialization
  socket.on('init-preview', async (data) => {
    const { pageName, locale = 'en' } = data;
    
    previewSessions.set(socket.id, {
      pageName,
      locale,
      connectedAt: new Date()
    });
    
    console.log(`📄 Preview session started for ${pageName} (${locale})`);
    
    // Send initial content
    try {
      const content = await fetchPageContent(pageName, locale);
      socket.emit('content-update', {
        pageName,
        locale,
        content,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching initial content:', error);
      socket.emit('error', { message: 'Failed to fetch initial content' });
    }
  });
  
  // Handle content refresh requests
  socket.on('refresh-content', async (data) => {
    const session = previewSessions.get(socket.id);
    if (!session) {
      socket.emit('error', { message: 'No preview session found' });
      return;
    }
    
    try {
      const content = await fetchPageContent(session.pageName, session.locale);
      socket.emit('content-update', {
        pageName: session.pageName,
        locale: session.locale,
        content,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error refreshing content:', error);
      socket.emit('error', { message: 'Failed to refresh content' });
    }
  });
  
  // Handle specific field updates
  socket.on('update-field', async (data) => {
    const { pageName, fieldPath, value, locale } = data;
    
    try {
      // Update the field in Strapi
      await updatePageField(pageName, fieldPath, value, locale);
      
      // Broadcast the update to all connected clients viewing the same page
      io.emit('field-updated', {
        pageName,
        fieldPath,
        value,
        locale,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✏️  Field updated: ${pageName}.${fieldPath}`);
    } catch (error) {
      console.error('Error updating field:', error);
      socket.emit('error', { message: 'Failed to update field' });
    }
  });
  
  // Handle screenshot capture requests
  socket.on('capture-screenshot', async (data) => {
    const { pageName, selector } = data;
    
    try {
      const screenshot = await captureElementScreenshot(pageName, selector);
      socket.emit('screenshot-captured', {
        pageName,
        selector,
        screenshot,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      socket.emit('error', { message: 'Failed to capture screenshot' });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    const session = previewSessions.get(socket.id);
    if (session) {
      console.log(`🔌 Preview session ended for ${session.pageName}`);
      previewSessions.delete(socket.id);
    }
  });
});

// Helper functions
async function fetchPageContent(pageName, locale) {
  const endpoint = getPageEndpoint(pageName);
  
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/${endpoint}?populate=deep&locale=${locale}`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching content for ${pageName}:`, error.message);
    throw error;
  }
}

async function updatePageField(pageName, fieldPath, value, locale) {
  const endpoint = getPageEndpoint(pageName);
  
  // Build the update payload dynamically based on field path
  const updateData = buildUpdatePayload(fieldPath, value);
  
  try {
    const response = await axios.put(
      `${STRAPI_URL}/api/${endpoint}?locale=${locale}`,
      {
        data: updateData
      },
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error(`Error updating field ${fieldPath}:`, error.message);
    throw error;
  }
}

function getPageEndpoint(pageName) {
  // Map page names to Strapi endpoints
  const endpointMap = {
    'home': 'home-page',
    'courses': 'courses-page',
    'about': 'about-page',
    'contact': 'contact-page'
  };
  
  return endpointMap[pageName] || pageName;
}

function buildUpdatePayload(fieldPath, value) {
  // Convert dot notation path to nested object
  const parts = fieldPath.split('.');
  const payload = {};
  
  let current = payload;
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = {};
    current = current[parts[i]];
  }
  
  current[parts[parts.length - 1]] = value;
  return payload;
}

async function captureElementScreenshot(pageName, selector) {
  // This would integrate with the screenshot generation script
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    const command = `node scripts/generate-screenshots.js --page=${pageName} --selector="${selector}"`;
    const { stdout } = await execAsync(command);
    return stdout.trim(); // Return the screenshot path or base64 data
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw error;
  }
}

// REST endpoint for webhook from Strapi
app.post('/webhook/content-updated', async (req, res) => {
  const { model, entry } = req.body;
  
  console.log(`📨 Webhook received: ${model} updated`);
  
  // Broadcast to all connected clients
  io.emit('strapi-content-changed', {
    model,
    entry,
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSessions: previewSessions.size,
    uptime: process.uptime()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
🚀 Live Preview Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 WebSocket: ws://localhost:${PORT}
🔗 Health: http://localhost:${PORT}/health
📤 Webhook: http://localhost:${PORT}/webhook/content-updated
🔌 Active Sessions: ${previewSessions.size}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down live preview server...');
  
  // Close all connections
  io.close(() => {
    console.log('✅ All connections closed');
    process.exit(0);
  });
});

module.exports = { io, previewSessions };