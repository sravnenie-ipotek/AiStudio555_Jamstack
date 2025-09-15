// API Configuration - Central source of truth for API endpoints
// Automatically detects the correct API server based on the current URL

(function() {
    'use strict';

    // Detect the current environment and API endpoint
    function getApiEndpoint() {
        const currentHost = window.location.hostname;
        const currentPort = window.location.port;
        const currentProtocol = window.location.protocol;

        // Check if we're on port 3005 (Python static server for frontend)
        if (currentPort === '3005') {
            console.log('🔧 Detected frontend on port 3005, using API on port 4005');
            // Frontend is on 3005, API is on 4005 (npm run start:dev)
            return `${currentProtocol}//${currentHost}:4005`;
        }

        // Check if we're on port 4005 (combined server - if accessed directly)
        if (currentPort === '4005') {
            console.log('🔧 Detected combined server on port 4005');
            return `${currentProtocol}//${currentHost}:4005`;
        }

        // Production environment (Railway or custom domain)
        if (currentHost.includes('railway.app') || currentHost.includes('aistudio555.com')) {
            console.log('🔧 Detected production environment');
            // In production, the API is on the same domain
            return '';
        }

        // Default fallback - try port 4005 first, then 3000
        console.log('🔧 Using default API endpoint detection');

        // Try to detect which port the API is running on
        if (window.location.href.includes(':4005')) {
            return `${currentProtocol}//${currentHost}:4005`;
        }

        // Default to port 3000 for backwards compatibility
        return `${currentProtocol}//${currentHost}:3000`;
    }

    // Export the API configuration
    window.API_CONFIG = {
        getApiBase: function() {
            return getApiEndpoint();
        },
        getApiUrl: function(path) {
            const base = getApiEndpoint();
            // Ensure path starts with /api if not already
            const apiPath = path.startsWith('/api') ? path : `/api/${path}`;
            return `${base}${apiPath}`;
        },
        isProduction: function() {
            const host = window.location.hostname;
            return host.includes('railway.app') || host.includes('aistudio555.com');
        },
        isDevelopment: function() {
            return !this.isProduction();
        }
    };

    // Log the configuration on load
    console.log('📡 API Configuration loaded:', {
        apiBase: API_CONFIG.getApiBase(),
        isProduction: API_CONFIG.isProduction(),
        currentUrl: window.location.href
    });

})();