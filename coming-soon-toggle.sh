#!/bin/bash

echo "🔐 düpp Coming Soon Mode Setup"
echo "=============================="

# Function to enable coming soon mode
enable_coming_soon() {
    echo "🚧 Enabling Coming Soon mode..."
    
    # Update .env file
    sed -i '' 's/VITE_COMING_SOON_MODE=false/VITE_COMING_SOON_MODE=true/' .env 2>/dev/null || \
    echo "VITE_COMING_SOON_MODE=true" >> .env
    
    # Build and deploy
    echo "🏗️ Building with Coming Soon protection..."
    npm run build
    
    echo "🚀 Deploying protected version..."
    firebase deploy --only hosting:dupp-store
    
    echo "✅ Coming Soon mode is now ACTIVE!"
    echo "🔑 Access passwords: dupp2025, preview, admin"
    echo "🌐 Live at: https://dupp-store.web.app"
}

# Function to disable coming soon mode
disable_coming_soon() {
    echo "🔓 Disabling Coming Soon mode..."
    
    # Update .env file
    sed -i '' 's/VITE_COMING_SOON_MODE=true/VITE_COMING_SOON_MODE=false/' .env 2>/dev/null || \
    echo "VITE_COMING_SOON_MODE=false" >> .env
    
    # Build and deploy
    echo "🏗️ Building public version..."
    npm run build
    
    echo "🚀 Deploying public version..."
    firebase deploy --only hosting:dupp-store
    
    echo "✅ Site is now PUBLIC!"
    echo "🌐 Live at: https://dupp-store.web.app"
}

# Menu
echo "Choose an option:"
echo "1) Enable Coming Soon Mode (Password Protected)"
echo "2) Disable Coming Soon Mode (Public Access)"
echo "3) Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        enable_coming_soon
        ;;
    2)
        disable_coming_soon
        ;;
    3)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Operation completed successfully!"
