# Image Generation Service for NewDesign Project

## 🎨 Overview
Professional AI image generation service for the AI Studio platform, powered by Google Gemini API (Imagen 3). Provides text-to-image generation capabilities with fallback support and placeholder generation.

## 🔧 Configuration

### API Keys and Settings
- **Google API Key**: `AIzaSyD2b1hZJ3QeMoaMMMP7eFfF0lZJB5_O3ZY`
- **Primary Model**: `imagen-3.0-generate-002` (Imagen 3)
- **Fallback Model**: `gemini-1.5-flash` (Gemini Flash)
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta`

## 📁 Files Structure
```
shared/services/imageGenerationService/
├── imageGenerationService.js      # Main service class
├── imageGenerationConfig.js       # Configuration constants
├── test-image-generation.html     # Comprehensive test suite
└── README.md                      # This documentation
```

## 🚀 Usage

### Basic Usage
```javascript
// Initialize service
await window.imageGenService.init();

// Generate a single image
const result = await window.imageGenService.generateImages(
  'A futuristic robot teaching in a classroom',
  {
    numberOfImages: 1,
    aspectRatio: '16:9'
  }
);

if (result.success) {
  console.log('Images generated:', result.images);
}
```

### Advanced Options
```javascript
// Generate multiple images with options
const result = await window.imageGenService.generateImages(
  'Beautiful sunset over mountains',
  {
    numberOfImages: 4,        // Generate up to 4 images
    aspectRatio: '16:9',      // Landscape format
    negativePrompt: 'blur, low quality', // What to avoid
    seed: 12345              // For reproducible results
  }
);
```

### Available Aspect Ratios
- `1:1` - Square (default)
- `16:9` - Landscape
- `9:16` - Portrait
- `4:3` - Standard
- `3:4` - Portrait Standard

## 🧪 Testing

### Test Page
Access the comprehensive test suite at:
```
http://localhost:3005/backups/newDesign/shared/services/imageGenerationService/test-image-generation.html
```

### Test Features
- **Service Status Check**: Verify initialization and configuration
- **Image Generation**: Generate images with custom prompts
- **Quick Examples**: Pre-configured prompts for testing
- **Image Gallery**: View and download generated images
- **Configuration Display**: View current settings

### Test Generation
```javascript
// Run a quick test
const testResult = await window.imageGenService.testGeneration();
console.log('Test result:', testResult);
```

## 🎯 Features

### Core Capabilities
- **Text-to-Image Generation**: Convert text prompts to images
- **Multiple Images**: Generate up to 4 variations at once
- **Aspect Ratio Control**: Choose from 5 preset ratios
- **Negative Prompts**: Specify what to avoid in images
- **Fallback Support**: Automatic fallback to Gemini Flash if Imagen fails

### Placeholder Generation
When the API is unavailable or fails, the service generates:
- Canvas-based placeholder images
- Gradient backgrounds with text overlay
- 512x512 default resolution
- Automatic text wrapping

### Image Handling
- **Base64 Encoding**: Images returned as base64 strings
- **Download Support**: Helper method for saving images
- **Format Support**: PNG, JPEG, WebP output formats
- **Gallery Display**: Built-in UI components for display

## ⚙️ Integration

### Include in HTML Pages
```html
<!-- Load the service -->
<script src="/backups/newDesign/shared/services/imageGenerationService/imageGenerationConfig.js"></script>
<script src="/backups/newDesign/shared/services/imageGenerationService/imageGenerationService.js"></script>

<!-- Use the service -->
<script>
  async function generateCourseImage() {
    const result = await window.imageGenService.generateImages(
      'Professional online course thumbnail for AI programming',
      { aspectRatio: '16:9' }
    );

    if (result.success && result.images.length > 0) {
      const imageUrl = `data:image/png;base64,${result.images[0].base64}`;
      document.getElementById('courseImage').src = imageUrl;
    }
  }
</script>
```

### Download Generated Images
```javascript
// Download the first generated image
if (result.images && result.images.length > 0) {
  window.imageGenService.downloadImage(
    result.images[0],
    'ai-generated-image.png'
  );
}
```

## 🔍 API Response Format

### Success Response
```javascript
{
  success: true,
  images: [
    {
      base64: "iVBORw0KGgo...",  // Base64 encoded image
      mimeType: "image/png",      // Image format
      description: "Generated image description" // Optional
    }
  ],
  message: "Successfully generated 1 image(s)"
}
```

### Error Response
```javascript
{
  success: false,
  error: ErrorObject,
  message: "Detailed error message"
}
```

## 🛡️ Error Handling

### Automatic Fallbacks
1. **Primary Model Failure**: Falls back to Gemini Flash
2. **API Unavailable**: Generates canvas-based placeholder
3. **SDK Loading Issues**: Auto-loads from CDN
4. **Network Errors**: Retry logic with exponential backoff

### Common Error Scenarios
- **Invalid Prompt**: Prompt validation before API call
- **Quota Exceeded**: Clear error message with retry guidance
- **Network Issues**: Automatic retry with delay
- **Unsupported Aspect Ratio**: Falls back to default 1:1

## 📊 Service Status

### Check Service Health
```javascript
const status = window.imageGenService.getStatus();
console.log('Service Status:', status);
// Returns:
// {
//   isInitialized: true,
//   hasGenAI: true,
//   sdkAvailable: true,
//   config: { model, apiEndpoint, apiKey }
// }
```

## 🚦 Rate Limits

### API Quotas
- **Requests per minute**: 60
- **Requests per hour**: 1000
- **Max images per request**: 4
- **Max prompt length**: 1000 characters

### Best Practices
- Cache generated images when possible
- Use appropriate aspect ratios for content type
- Provide clear, descriptive prompts
- Include negative prompts for better quality

## 💡 Tips for Better Results

### Prompt Engineering
1. **Be Specific**: Include details about style, colors, composition
2. **Art Style**: Mention desired art style (photorealistic, cartoon, etc.)
3. **Lighting**: Specify lighting conditions (sunset, studio light, etc.)
4. **Composition**: Describe camera angle and framing

### Example Prompts
```javascript
// Good prompt
"Professional business team meeting in modern office, bright natural lighting, photorealistic style, 4K quality"

// Better prompt with negative
prompt: "Elegant website hero image with abstract technology elements",
negativePrompt: "text, logos, watermarks, low quality"
```

## 🔗 Related Documentation
- [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Imagen 3 Documentation](https://ai.google.dev/gemini-api/docs/imagen)
- [API Pricing](https://ai.google.dev/pricing)

## 📝 Notes

### Current Limitations
- Imagen 3 direct access may require API approval
- Fallback to Gemini Flash provides descriptions, not actual images
- Canvas placeholders are used when API is unavailable
- Maximum 4 images per generation request

### Future Enhancements
- Add support for image editing/variations
- Implement caching layer for repeated prompts
- Add more sophisticated placeholder generation
- Support for batch processing

## 🧑‍💻 Development

### Environment Setup
```bash
# No npm packages required - uses CDN
# Service auto-initializes on page load
```

### Testing Locally
1. Start the local server: `python3 -m http.server 3005`
2. Navigate to the test page
3. Check service status
4. Generate test images

### Debug Mode
```javascript
// Enable debug logging
IMAGE_GEN_CONFIG.SETTINGS.DEBUG_MODE = true;
```

---

**Service Status**: ✅ Ready for Integration
**API Key**: Configured and Active
**Test Suite**: Available and Functional