#!/bin/bash

# 🔥 Complete Firebase Project Setup + Google Auth
# This script creates a Firebase project and sets up Google authentication

echo "🔥 Complete Firebase Project Setup + Google Auth"
echo "==============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_step() { echo -e "${BLUE}🔧 $1${NC}"; }

# Function to open URL in browser
open_url() {
    if command -v open &> /dev/null; then
        open "$1"  # macOS
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$1"  # Linux
    elif command -v start &> /dev/null; then
        start "$1"  # Windows
    else
        print_info "Please open this URL manually: $1"
    fi
}

print_step "Step 1: Create Firebase Project"
print_info "Opening Firebase Console to create project..."

open_url "https://console.firebase.google.com/"

echo ""
echo "📋 In Firebase Console:"
echo "   1. Click 'Create a project' (or 'Add project')"
echo "   2. Enter project name: 'dupp-ecommerce' (or your preferred name)"
echo "   3. Continue through the setup (disable Google Analytics for now)"
echo "   4. Wait for project creation to complete"
echo "   5. Note your Project ID (usually shows under project name)"
echo ""

read -p "Enter your new Firebase Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    print_error "Project ID is required. Please run the script again."
    exit 1
fi

print_success "Using Project ID: $PROJECT_ID"

# Set Firebase project
print_step "Step 2: Configure Firebase CLI"
firebase use $PROJECT_ID --add
print_success "Firebase project configured"

print_step "Step 3: Get Firebase Web App Config"
echo ""
echo "📋 In Firebase Console for project '$PROJECT_ID':"
echo "   1. Click the gear icon (⚙️) → Project settings"
echo "   2. Scroll down to 'Your apps' section"
echo "   3. Click '</>' (Add app) to add a web app"
echo "   4. App nickname: 'düpp-web-app'"
echo "   5. Check 'Also set up Firebase Hosting' (optional)"
echo "   6. Click 'Register app'"
echo "   7. Copy the firebaseConfig object from the code"
echo ""

read -p "Press Enter when you've registered the web app..."

print_step "Step 4: Enable Authentication"
echo ""
echo "📋 In Firebase Console:"
echo "   1. Click 'Authentication' in left sidebar"
echo "   2. Click 'Get started'"
echo "   3. Go to 'Sign-in method' tab"
echo "   4. Click on 'Google' provider"
echo "   5. Toggle 'Enable' to ON"
echo "   6. Project public-facing name: 'düpp E-Commerce'"
echo "   7. Support email: your email"
echo "   8. Click 'Save'"
echo ""

read -p "Press Enter when you've enabled Google authentication..."

print_step "Step 5: Enable Firestore Database"
echo ""
echo "📋 In Firebase Console:"
echo "   1. Click 'Firestore Database' in left sidebar"
echo "   2. Click 'Create database'"
echo "   3. Choose 'Start in test mode'"
echo "   4. Select location (choose closest to you)"
echo "   5. Click 'Done'"
echo ""

read -p "Press Enter when you've created Firestore database..."

print_step "Step 6: Configure Authorized Domains"
echo ""
echo "📋 In Firebase Console → Authentication:"
echo "   1. Go to 'Settings' tab"
echo "   2. Scroll to 'Authorized domains'"
echo "   3. Make sure 'localhost' is listed"
echo "   4. If not, click 'Add domain' and add 'localhost'"
echo ""

read -p "Press Enter when you've configured authorized domains..."

print_step "Step 7: Update .env File"
echo ""
echo "📝 Now update your .env file with Firebase config:"
echo ""
echo "In Firebase Console → Project Settings → Your apps:"
echo "Copy the config values and update .env file:"
echo ""
echo "VITE_FIREBASE_API_KEY=your_api_key_from_config"
echo "VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com"
echo "VITE_FIREBASE_PROJECT_ID=$PROJECT_ID"
echo "VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com"
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
echo "VITE_FIREBASE_APP_ID=your_app_id"
echo ""

# Open .env file if VS Code is available
if command -v code &> /dev/null; then
    read -p "Open .env file in VS Code now? (y/n): " open_env
    if [ "$open_env" = "y" ] || [ "$open_env" = "Y" ]; then
        code .env
    fi
fi

read -p "Press Enter when you've updated the .env file..."

print_step "Step 8: Test the Setup"
print_info "Starting development server..."

# Kill any existing dev server
pkill -f "vite" 2>/dev/null || true

# Start dev server in background
npm run dev &
DEV_PID=$!

sleep 3

print_success "🎉 Setup Complete!"
echo ""
echo "📱 Your app is running at:"
echo "   👉 http://localhost:5174/d-pp/ (or check the port shown above)"
echo ""
echo "🧪 Test Google Authentication:"
echo "   1. Open the login page"
echo "   2. Click 'Sign in with Google'"
echo "   3. Complete Google OAuth"
echo "   4. You should be logged in!"
echo ""

read -p "Open the app automatically? (y/n): " open_app
if [ "$open_app" = "y" ] || [ "$open_app" = "Y" ]; then
    sleep 2
    open_url "http://localhost:5174/d-pp/login"
fi

echo ""
print_success "🎉 Firebase project and Google auth setup complete!"
echo ""
echo "📚 Your Firebase Project: $PROJECT_ID"
echo "🔗 Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"
echo ""
echo "🔧 If Google auth doesn't work:"
echo "   • Check browser console for errors"
echo "   • Verify .env file has correct values"
echo "   • Make sure Google provider is enabled"
echo "   • Check that localhost is in authorized domains"
