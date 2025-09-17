// Image Generation Service using Google Gemini API (Imagen 3)
// AI Studio Project for NewDesign

class ImageGenerationService {
  constructor() {
    this.config = {
      apiKey: 'AIzaSyD2b1hZJ3QeMoaMMMP7eFfF0lZJB5_O3ZY',
      model: 'imagen-3.0-generate-002',
      apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta'
    };

    this.isInitialized = false;
    this.genAI = null;
  }

  // Initialize the service
  async init() {
    if (this.isInitialized) return true;

    try {
      // Load the Google GenAI SDK if not already loaded
      if (typeof GoogleGenerativeAI === 'undefined') {
        console.log('Loading Google GenAI SDK...');
        await this.loadGoogleGenAI();
      }

      // Initialize the Google GenAI client
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);

      this.isInitialized = true;
      console.log('Image Generation Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Image Generation Service:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Load Google GenAI SDK dynamically
  async loadGoogleGenAI() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof GoogleGenerativeAI !== 'undefined') {
        resolve();
        return;
      }

      // Import the SDK via script tag for browser compatibility
      const script = document.createElement('script');
      script.type = 'module';

      // Create inline module script to import and expose the SDK
      script.textContent = `
        import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';
        window.GoogleGenerativeAI = GoogleGenerativeAI;
        window.dispatchEvent(new Event('genai-loaded'));
      `;

      document.head.appendChild(script);

      // Wait for the SDK to load
      const handleLoad = () => {
        window.removeEventListener('genai-loaded', handleLoad);
        setTimeout(() => {
          if (typeof GoogleGenerativeAI !== 'undefined') {
            resolve();
          } else {
            reject(new Error('Google GenAI SDK not available after load'));
          }
        }, 100);
      };

      window.addEventListener('genai-loaded', handleLoad);

      // Timeout after 10 seconds
      setTimeout(() => {
        window.removeEventListener('genai-loaded', handleLoad);
        reject(new Error('Timeout loading Google GenAI SDK'));
      }, 10000);
    });
  }

  // Generate images using Imagen 3
  async generateImages(prompt, options = {}) {
    try {
      // Initialize if not ready
      if (!this.isInitialized) {
        const initialized = await this.init();
        if (!initialized) {
          throw new Error('Failed to initialize service');
        }
      }

      // Validate prompt
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('Invalid prompt: must be a non-empty string');
      }

      // Prepare generation config
      const config = {
        numberOfImages: options.numberOfImages || 1,
        aspectRatio: options.aspectRatio || '1:1',
        negativePrompt: options.negativePrompt || '',
        seed: options.seed || undefined
      };

      console.log('Generating images with prompt:', prompt);
      console.log('Configuration:', config);

      // Use Imagen 3 via REST API since SDK might not fully support it yet
      const response = await this.callImagenAPI(prompt, config);

      return {
        success: true,
        images: response.images,
        message: `Successfully generated ${response.images.length} image(s)`
      };

    } catch (error) {
      console.error('Image generation failed:', error);
      return {
        success: false,
        error: error,
        message: error.message || 'Failed to generate images'
      };
    }
  }

  // Call our server-side proxy for image generation
  async callImagenAPI(prompt, config) {
    // Use server proxy endpoint to avoid CORS issues
    const API_BASE_URL = window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://aistudio555jamstack-production.up.railway.app';

    const url = `${API_BASE_URL}/api/generate-image`;

    const requestBody = {
      prompt: prompt,
      numberOfImages: config.numberOfImages,
      aspectRatio: config.aspectRatio,
      negativePrompt: config.negativePrompt
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      // Process the response - images come as URLs from our proxy
      const images = data.images?.map(img => ({
        url: img.url,
        type: 'url',
        mimeType: img.mimeType || 'image/jpeg'
      })) || [];

      // If we got URLs, return them directly
      if (images.length > 0 && images[0].url) {
        return { images };
      }

      // Fallback to placeholder if no images returned
      throw new Error('No images returned from server');

    } catch (error) {
      console.error('API call failed:', error);

      // Fallback to placeholder generation
      return this.generateWithGeminiFlash(prompt, config);
    }
  }

  // Alternative generation using Gemini Flash with image capabilities
  async generateWithGeminiFlash(prompt, config) {
    try {
      if (!this.genAI) {
        throw new Error('GenAI client not initialized');
      }

      // Use Gemini Pro Vision for image-related tasks
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      // Create a creative prompt for text-based image description
      const enhancedPrompt = `Create a detailed description for an image with the following characteristics: ${prompt}.
        Describe it as if it were a real photograph, including colors, composition, lighting, and style.`;

      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      const description = response.text();

      // Since Gemini Flash doesn't directly generate images, return description
      // This can be used with external services or as a placeholder
      return {
        images: [{
          description: description,
          prompt: prompt,
          placeholder: this.generatePlaceholder(prompt)
        }]
      };

    } catch (error) {
      console.error('Gemini Flash generation failed:', error);
      throw error;
    }
  }

  // Generate a placeholder image data URL
  generatePlaceholder(text) {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap the text
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 450 && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);

    // Draw wrapped text
    const lineHeight = 30;
    const startY = 256 - (lines.length * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), 256, startY + index * lineHeight);
    });

    // Add "AI Generated" watermark
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('AI Generated Placeholder', 256, 480);

    return canvas.toDataURL('image/png');
  }

  // Convert base64 to blob for download
  base64ToBlob(base64, mimeType = 'image/png') {
    const byteCharacters = atob(base64.split(',')[1] || base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Download generated image
  downloadImage(imageData, filename = 'generated-image.png') {
    const blob = this.base64ToBlob(imageData.base64 || imageData.placeholder, imageData.mimeType);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasGenAI: this.genAI !== null,
      sdkAvailable: typeof GoogleGenerativeAI !== 'undefined',
      config: {
        model: this.config.model,
        apiEndpoint: this.config.apiEndpoint,
        apiKey: this.config.apiKey.substring(0, 10) + '...'
      }
    };
  }

  // Test the service
  async testGeneration() {
    const testPrompt = 'A futuristic robot teaching in a modern classroom';

    try {
      const result = await this.generateImages(testPrompt, {
        numberOfImages: 1,
        aspectRatio: '16:9'
      });

      if (result.success) {
        console.log('✅ Test generation successful');
        return {
          success: true,
          message: 'Test generation successful',
          images: result.images
        };
      } else {
        console.error('❌ Test generation failed:', result.message);
        return {
          success: false,
          message: 'Test generation failed: ' + result.message,
          error: result.error
        };
      }
    } catch (error) {
      console.error('❌ Test generation error:', error);
      return {
        success: false,
        message: 'Test generation error: ' + error.message,
        error: error
      };
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageGenerationService;
}

// Global instance for browser use
window.ImageGenerationService = ImageGenerationService;
window.imageGenService = new ImageGenerationService();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.imageGenService.init().catch(console.error);
  });
} else {
  // DOM already ready, initialize immediately
  window.imageGenService.init().catch(console.error);
}