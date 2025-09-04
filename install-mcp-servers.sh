#!/bin/bash

# MCP Server Installation Script
# This script helps you set up Context7, Playwright, and Brave Search MCP servers

echo "🚀 MCP Server Setup Script"
echo "=========================="
echo ""

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    echo "✅ Detected macOS"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    CONFIG_PATH="$APPDATA/Claude/claude_desktop_config.json"
    echo "✅ Detected Windows"
else
    CONFIG_PATH="$HOME/.config/Claude/claude_desktop_config.json"
    echo "✅ Detected Linux"
fi

echo "📁 Config path: $CONFIG_PATH"
echo ""

# Create config directory if it doesn't exist
CONFIG_DIR=$(dirname "$CONFIG_PATH")
mkdir -p "$CONFIG_DIR"

# Backup existing config if it exists
if [ -f "$CONFIG_PATH" ]; then
    echo "📦 Backing up existing config..."
    cp "$CONFIG_PATH" "$CONFIG_PATH.backup.$(date +%Y%m%d_%H%M%S)"
    echo "✅ Backup saved"
fi

# Create the new config
echo "📝 Writing MCP configuration..."
cat > "$CONFIG_PATH" << 'EOF'
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "context7-mcp"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "BSA-dOE-vdDUE0rHxEOggsmxqg8KE-c"
      }
    }
  }
}
EOF

echo "✅ Configuration written successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Completely quit Claude Desktop application"
echo "2. Restart Claude Desktop"
echo "3. The MCP servers will be available automatically"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "Available MCP servers:"
echo "  • context7 - Context management"
echo "  • playwright - Browser automation"
echo "  • brave-search - Web search with Brave"