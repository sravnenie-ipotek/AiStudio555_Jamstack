// Image Generation Service Configuration
// Google Gemini API (Imagen 3) Settings

const IMAGE_GEN_CONFIG = {
  // Google API Configuration
  GOOGLE_API: {
    API_KEY: 'AIzaSyD2b1hZJ3QeMoaMMMP7eFfF0lZJB5_O3ZY',
    MODEL_IMAGEN: 'imagen-3.0-generate-002',
    MODEL_GEMINI_FLASH: 'gemini-1.5-flash',
    MODEL_GEMINI_PRO: 'gemini-1.5-pro',
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    CDN_URL: 'https://esm.run/@google/generative-ai'
  },

  // Image Generation Settings
  GENERATION: {
    DEFAULT_COUNT: 1,
    MAX_COUNT: 4,
    DEFAULT_ASPECT_RATIO: '1:1',
    ASPECT_RATIOS: ['1:1', '16:9', '9:16', '4:3', '3:4'],
    SAFETY_FILTER: 'block_some',
    PERSON_GENERATION: 'allow_adult'
  },

  // Image Quality Settings
  QUALITY: {
    DEFAULT_QUALITY: 'standard',
    OPTIONS: ['standard', 'hd'],
    DEFAULT_STYLE: 'natural',
    STYLES: ['natural', 'vivid', 'dramatic', 'artistic']
  },

  // Validation Rules
  VALIDATION: {
    PROMPT: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 1000,
      REQUIRED: true
    },
    NEGATIVE_PROMPT: {
      MAX_LENGTH: 500,
      REQUIRED: false
    }
  },

  // Rate Limiting
  RATE_LIMITS: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_HOUR: 1000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // ms
  },

  // Supported Image Formats
  FORMATS: {
    INPUT: ['text'],
    OUTPUT: ['png', 'jpeg', 'webp'],
    DEFAULT_OUTPUT: 'png',
    MAX_SIZE_MB: 10
  },

  // Service Settings
  SETTINGS: {
    AUTO_INIT: true,
    USE_FALLBACK: true,
    ENABLE_PLACEHOLDER: true,
    CACHE_RESULTS: false,
    DEBUG_MODE: process.env.NODE_ENV === 'development'
  },

  // Placeholder Settings
  PLACEHOLDER: {
    WIDTH: 512,
    HEIGHT: 512,
    BACKGROUND: {
      START_COLOR: '#667eea',
      END_COLOR: '#764ba2'
    },
    TEXT: {
      FONT: 'bold 24px Arial',
      COLOR: 'white',
      WATERMARK: 'AI Generated Placeholder'
    }
  },

  // Error Messages
  ERRORS: {
    INIT_FAILED: 'Failed to initialize Image Generation Service',
    INVALID_PROMPT: 'Prompt must be a non-empty string',
    API_KEY_MISSING: 'Google API key is not configured',
    GENERATION_FAILED: 'Failed to generate image',
    NETWORK_ERROR: 'Network error occurred during image generation',
    QUOTA_EXCEEDED: 'API quota exceeded, please try again later',
    INVALID_ASPECT_RATIO: 'Invalid aspect ratio specified'
  },

  // Success Messages
  MESSAGES: {
    INIT_SUCCESS: 'Image Generation Service initialized successfully',
    GENERATION_SUCCESS: 'Image generated successfully',
    DOWNLOAD_SUCCESS: 'Image downloaded successfully',
    TEST_SUCCESS: 'Test generation completed successfully'
  }
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IMAGE_GEN_CONFIG;
}

if (typeof window !== 'undefined') {
  window.IMAGE_GEN_CONFIG = IMAGE_GEN_CONFIG;
}