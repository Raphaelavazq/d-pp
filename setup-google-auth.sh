#!/bin/bash

# 🔑 Google Authentication CLI Setup Tool
# This script helps you set up Google authentication step by step

set -e  # Exit on any error

echo "🔑 Google Authentication CLI Setup Tool"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to open URL in browser
open_url() {
    if command_exists open; then
        open "$1"  # macOS
    elif command_exists xdg-open; then
        xdg-open "$1"  # Linux
    elif command_exists start; then
        start "$1"  # Windows
    else
        print_info "Please open this URL manually: $1"
    fi
}

# Function to wait for user confirmation
wait_for_confirmation() {
    echo ""
    read -p "Press Enter when you've completed this step..."
    echo ""
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if [ ! -f "package.json" ]; then
    print_error "Not in a Node.js project directory. Please run this from your project root."
    exit 1
fi

if [ ! -f "src/config/firebase.js" ]; then
    print_error "Firebase configuration not found. Please run the authentication setup first."
    exit 1
fi

print_success "Prerequisites check passed"
echo ""

# Step 1: Check current Firebase configuration
print_step "Step 1: Checking current Firebase configuration"

if [ -f ".env" ]; then
    if grep -q "demo-api-key-replace-me\|your_api_key_here" .env; then
        print_warning "Using demo Firebase credentials. You'll need real credentials for Google auth."
        echo ""
        echo "Do you want to:"
        echo "1) Continue with Firebase Console setup to get real credentials"
        echo "2) Skip and use demo mode (Google auth won't work)"
        echo ""
        read -p "Choose (1 or 2): " choice
        
        if [ "$choice" = "2" ]; then
            print_info "Skipping Firebase setup. Google auth will not work until you configure real credentials."
            exit 0
        fi
    else
        print_success "Firebase credentials found in .env file"
    fi
else
    print_error ".env file not found. Creating template..."
    cat > .env << 'EOF'
# Firebase Configuration - REPLACE WITH YOUR ACTUAL VALUES
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Other
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_demo_key
VITE_ALIEXPRESS_API_KEY=your_aliexpress_api_key
EOF
    print_success "Created .env template. You'll need to fill in real Firebase credentials."
fi

echo ""

# Step 2: Open Firebase Console
print_step "Step 2: Opening Firebase Console"
print_info "Opening Firebase Console in your browser..."

open_url "https://console.firebase.google.com/"

echo ""
echo "📋 In the Firebase Console, please:"
echo "   1. Select your project (or create a new one)"
echo "   2. Note down your project ID"
echo "   3. If you don't have a project, create one now"
wait_for_confirmation

# Step 3: Get Firebase configuration
print_step "Step 3: Get Firebase Configuration"
echo ""
echo "📋 To get your Firebase configuration:"
echo "   1. In Firebase Console, go to Project Settings (gear icon)"
echo "   2. Scroll down to 'Your apps' section"
echo "   3. If no web app exists, click 'Add app' and choose web (</>) icon"
echo "   4. Register your app with name 'düpp E-Commerce'"
echo "   5. Copy the firebaseConfig object values"
wait_for_confirmation

# Step 4: Update .env file
print_step "Step 4: Update .env file with Firebase credentials"
echo ""
echo "📝 Please update your .env file with the Firebase configuration:"
echo ""
echo "Open .env file in your editor and replace these values:"
echo "VITE_FIREBASE_API_KEY=your_actual_api_key"
echo "VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com"
echo "VITE_FIREBASE_PROJECT_ID=your_actual_project_id"
echo "VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com"
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
echo "VITE_FIREBASE_APP_ID=your_app_id"
echo ""

if command_exists code; then
    read -p "Open .env file in VS Code? (y/n): " open_vscode
    if [ "$open_vscode" = "y" ] || [ "$open_vscode" = "Y" ]; then
        code .env
    fi
fi

wait_for_confirmation

# Step 5: Enable Authentication
print_step "Step 5: Enable Firebase Authentication"
echo ""
echo "📋 In Firebase Console:"
echo "   1. Click 'Authentication' in the left sidebar"
echo "   2. Click 'Get started' if you see it"
echo "   3. Go to 'Sign-in method' tab"
wait_for_confirmation

# Step 6: Enable Google Provider
print_step "Step 6: Enable Google Sign-in Provider"
echo ""
echo "📋 In the Sign-in method tab:"
echo "   1. Find 'Google' in the providers list"
echo "   2. Click on 'Google'"
echo "   3. Toggle the 'Enable' switch to ON"
echo "   4. Add 'düpp E-Commerce' as Project public-facing name"
echo "   5. Add your email as Project support email"
echo "   6. Click 'Save'"
wait_for_confirmation

# Step 7: Configure authorized domains
print_step "Step 7: Configure Authorized Domains"
echo ""
echo "📋 Still in Authentication section:"
echo "   1. Go to 'Settings' tab"
echo "   2. Scroll down to 'Authorized domains'"
echo "   3. Make sure 'localhost' is in the list"
echo "   4. If not, click 'Add domain' and add 'localhost'"
wait_for_confirmation

# Step 8: Create Firestore Database
print_step "Step 8: Create Firestore Database"
echo ""
echo "📋 Create Firestore Database:"
echo "   1. In Firebase Console, click 'Firestore Database'"
echo "   2. Click 'Create database'"
echo "   3. Choose 'Start in test mode' for now"
echo "   4. Select a location (choose closest to your users)"
echo "   5. Click 'Done'"
wait_for_confirmation

# Step 9: Test the setup
print_step "Step 9: Test Google Authentication"
echo ""
echo "🚀 Let's test your Google authentication setup!"
echo ""

# Start development server
print_info "Starting development server..."
echo ""
echo "Starting the app in the background..."

# Check if dev server is already running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_info "Development server already running on port 5173"
else
    npm run dev &
    DEV_PID=$!
    print_info "Development server started (PID: $DEV_PID)"
    sleep 3
fi

echo ""
print_success "🎉 Setup Complete!"
echo ""
echo "📱 Your app should now be running at:"
echo "   👉 http://localhost:5173/d-pp/"
echo ""
echo "🧪 Test Google Authentication:"
echo "   1. Go to: http://localhost:5173/d-pp/login"
echo "   2. Click 'Sign in with Google' button"
echo "   3. Complete Google OAuth flow"
echo "   4. You should be logged in and redirected"
echo ""
echo "   Or test signup:"
echo "   1. Go to: http://localhost:5173/d-pp/signup"
echo "   2. Click 'Sign up with Google' button"
echo ""

# Open the app automatically
read -p "Open the app in your browser automatically? (y/n): " open_app
if [ "$open_app" = "y" ] || [ "$open_app" = "Y" ]; then
    open_url "http://localhost:5173/d-pp/login"
fi

echo ""
print_success "Google Authentication setup complete! 🎉"
echo ""
echo "📚 Troubleshooting:"
echo "   • If Google button doesn't work, check browser console for errors"
echo "   • Make sure popup blockers are disabled for localhost"
echo "   • Verify all Firebase configuration values are correct"
echo "   • Check that Google provider is enabled in Firebase Console"
echo ""
echo "📖 For detailed instructions, see: GOOGLE_AUTH_SETUP.md"
