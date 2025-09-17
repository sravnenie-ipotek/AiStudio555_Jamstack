// Simple authentication middleware for admin panel
const basicAuth = (req, res, next) => {
  // Skip auth in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Basic ')) {
    res.status(401);
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Panel"');
    res.send('Authentication required');
    return;
  }

  const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
  const [username, password] = credentials.split(':');
  
  // Use environment variables for credentials
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'AIStudio2025!';
  
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    next();
  } else {
    res.status(401);
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Panel"');
    res.send('Invalid credentials');
  }
};

module.exports = basicAuth;