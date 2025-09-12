/**
 * AUTHENTICATION MIDDLEWARE FOR FOOTER ADMIN ENDPOINTS
 * 
 * Fixes: Authentication Bypass (CRITICAL)
 * Provides secure authentication and authorization for admin operations
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Configuration
const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  JWT_EXPIRES: process.env.JWT_EXPIRES || '24h',
  ADMIN_ROLES: ['admin', 'super_admin', 'content_manager'],
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5
  }
};

// Rate limiting store
const rateLimitStore = new Map();

/**
 * Clean up expired rate limit entries
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > AUTH_CONFIG.RATE_LIMIT.windowMs) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

/**
 * Rate limiting middleware
 */
function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, {
      attempts: 1,
      windowStart: now
    });
    return next();
  }
  
  const data = rateLimitStore.get(ip);
  
  // Reset window if expired
  if (now - data.windowStart > AUTH_CONFIG.RATE_LIMIT.windowMs) {
    data.attempts = 1;
    data.windowStart = now;
    return next();
  }
  
  // Check if limit exceeded
  if (data.attempts >= AUTH_CONFIG.RATE_LIMIT.maxAttempts) {
    return res.status(429).json({
      error: 'Too many authentication attempts',
      retryAfter: Math.ceil((AUTH_CONFIG.RATE_LIMIT.windowMs - (now - data.windowStart)) / 1000)
    });
  }
  
  data.attempts++;
  next();
}

/**
 * Authentication middleware - verifies JWT token
 */
function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid Bearer token'
      });
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Token not provided'
      });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
    
    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || []
    };
    
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Authentication failed'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error'
    });
  }
}

/**
 * Authorization middleware - checks admin permissions
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please authenticate first'
    });
  }
  
  if (!AUTH_CONFIG.ADMIN_ROLES.includes(req.user.role)) {
    return res.status(403).json({
      error: 'Insufficient permissions',
      message: 'Admin access required'
    });
  }
  
  next();
}

/**
 * CSRF protection middleware
 */
function requireCSRF(req, res, next) {
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;
  
  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      error: 'CSRF token missing or invalid',
      message: 'Request blocked for security'
    });
  }
  
  next();
}

/**
 * Generate CSRF token
 */
function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Login endpoint
 */
function createLoginEndpoint(pool) {
  return async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Input validation
      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing credentials',
          message: 'Email and password required'
        });
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }
      
      // Check rate limiting
      const ip = req.ip || req.connection.remoteAddress;
      const rateLimitData = rateLimitStore.get(ip);
      if (rateLimitData && rateLimitData.attempts >= AUTH_CONFIG.RATE_LIMIT.maxAttempts) {
        return res.status(429).json({
          error: 'Too many login attempts',
          message: 'Please try again later'
        });
      }
      
      // Verify credentials (implement your user lookup logic here)
      // For now, using environment variables for admin user
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        console.error('Admin credentials not configured in environment');
        return res.status(500).json({
          error: 'Server configuration error'
        });
      }
      
      if (email !== adminEmail || password !== adminPassword) {
        // Increment rate limit attempts on failed login
        if (rateLimitData) {
          rateLimitData.attempts++;
        } else {
          rateLimitStore.set(ip, {
            attempts: 1,
            windowStart: Date.now()
          });
        }
        
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password incorrect'
        });
      }
      
      // Generate JWT token
      const tokenPayload = {
        userId: 1,
        email: adminEmail,
        role: 'admin',
        permissions: ['footer:read', 'footer:write', 'footer:delete']
      };
      
      const token = jwt.sign(tokenPayload, AUTH_CONFIG.JWT_SECRET, {
        expiresIn: AUTH_CONFIG.JWT_EXPIRES
      });
      
      // Generate CSRF token
      const csrfToken = generateCSRFToken();
      
      // Store CSRF token in session (you'll need to set up session middleware)
      if (req.session) {
        req.session.csrfToken = csrfToken;
      }
      
      // Clear rate limit on successful login
      rateLimitStore.delete(ip);
      
      res.json({
        success: true,
        token,
        csrfToken,
        user: {
          email: adminEmail,
          role: 'admin'
        },
        expires: AUTH_CONFIG.JWT_EXPIRES
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Login failed',
        message: 'Internal server error'
      });
    }
  };
}

/**
 * Security headers middleware
 */
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.emailjs.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.emailjs.com"
  );
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireCSRF,
  rateLimit,
  generateCSRFToken,
  createLoginEndpoint,
  securityHeaders,
  AUTH_CONFIG
};