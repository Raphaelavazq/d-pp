#!/bin/bash

echo "🚀 Starting düpp E-Commerce Application"
echo "======================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if Firebase authentication pages exist
echo "✅ Checking authentication system..."

if [ -f "src/pages/Login.jsx" ] && [ -f "src/pages/Signup.jsx" ] && [ -f "src/pages/Profile.jsx" ]; then
    echo "✅ Authentication pages found"
else
    echo "❌ Authentication pages missing. Please run setup-auth.sh first"
    exit 1
fi

# Check if Firebase config exists
if [ -f "src/config/firebase.js" ]; then
    echo "✅ Firebase configuration found"
else
    echo "❌ Firebase configuration missing"
    exit 1
fi

# Start the development server
echo ""
echo "🌐 Starting development server..."
echo "📝 Note: Update your .env file with real Firebase credentials"
echo "📖 See firebase-config-template.txt for setup instructions"
echo ""

npm run dev
