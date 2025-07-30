#!/bin/bash

# 🔧 Firebase Config Helper
# This script helps you update your .env file with Firebase configuration

echo "🔧 Firebase Configuration Helper"
echo "==============================="
echo ""
echo "📋 Follow these steps to get your Firebase config:"
echo ""
echo "1. Go to: https://console.firebase.google.com/project/dupp-af67a"
echo "2. Click gear icon (⚙️) → Project settings"
echo "3. Scroll to 'Your apps' section"
echo "4. If no web app exists:"
echo "   - Click '</>' (Add app)"
echo "   - App nickname: 'dupp-web-app'"
echo "   - Click 'Register app'"
echo "5. Copy the firebaseConfig values"
echo ""
echo "📝 Then update these values in your .env file:"
echo ""
echo "Current .env file location: $(pwd)/.env"
echo ""

# Check if VS Code is available
if command -v code &> /dev/null; then
    read -p "Open .env file in VS Code? (y/n): " open_vscode
    if [ "$open_vscode" = "y" ] || [ "$open_vscode" = "Y" ]; then
        code .env
        echo "✅ Opened .env in VS Code"
    fi
fi

echo ""
echo "🔍 Update these values in .env:"
echo "VITE_FIREBASE_API_KEY=your_api_key_from_config"
echo "VITE_FIREBASE_AUTH_DOMAIN=dupp-af67a.firebaseapp.com"
echo "VITE_FIREBASE_PROJECT_ID=dupp-af67a"
echo "VITE_FIREBASE_STORAGE_BUCKET=dupp-af67a.appspot.com"
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
echo "VITE_FIREBASE_APP_ID=your_app_id"
echo "VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id"
echo ""
echo "💡 Tip: Copy each value exactly from the Firebase config object"
echo "⚠️  Don't include quotes - just the values"
echo ""
echo "🚀 After updating, restart your dev server: npm run dev"
