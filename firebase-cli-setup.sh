#!/bin/bash

# 🔥 Firebase CLI Google Auth Setup
# Automated Firebase configuration using Firebase CLI

echo "🔥 Firebase CLI Google Auth Setup"
echo "================================="
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

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    print_success "Firebase CLI installed"
fi

# Check if already logged in
if firebase projects:list &> /dev/null; then
    print_success "Already logged in to Firebase"
else
    print_info "Logging in to Firebase..."
    firebase login
fi

echo ""
print_info "Available Firebase projects:"
firebase projects:list

echo ""
read -p "Enter your Firebase project ID (or press Enter to create new): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    print_info "Creating new Firebase project..."
    echo "Please create a project manually at https://console.firebase.google.com/"
    echo "Then run this script again with the project ID."
    exit 1
fi

# Initialize Firebase in current directory
if [ ! -f "firebase.json" ]; then
    print_info "Initializing Firebase..."
    firebase init --project $PROJECT_ID
fi

# Set the project
firebase use $PROJECT_ID
print_success "Using Firebase project: $PROJECT_ID"

# Get Firebase config
print_info "Getting Firebase configuration..."
firebase apps:sdkconfig web --project $PROJECT_ID > firebase-config.json

# Extract config values and update .env
if [ -f "firebase-config.json" ]; then
    print_info "Updating .env file with Firebase configuration..."
    
    # Parse JSON and update .env
    API_KEY=$(grep -o '"apiKey": "[^"]*"' firebase-config.json | cut -d'"' -f4)
    AUTH_DOMAIN=$(grep -o '"authDomain": "[^"]*"' firebase-config.json | cut -d'"' -f4)
    PROJECT_ID_CONFIG=$(grep -o '"projectId": "[^"]*"' firebase-config.json | cut -d'"' -f4)
    STORAGE_BUCKET=$(grep -o '"storageBucket": "[^"]*"' firebase-config.json | cut -d'"' -f4)
    MESSAGING_SENDER_ID=$(grep -o '"messagingSenderId": "[^"]*"' firebase-config.json | cut -d'"' -f4)
    APP_ID=$(grep -o '"appId": "[^"]*"' firebase-config.json | cut -d'"' -f4)
    
    # Create or update .env
    cat > .env << EOF
# Firebase Configuration
VITE_FIREBASE_API_KEY=$API_KEY
VITE_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=$PROJECT_ID_CONFIG
VITE_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=$APP_ID

# Other
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_demo_key
VITE_ALIEXPRESS_API_KEY=your_aliexpress_api_key
EOF

    print_success "Updated .env file with Firebase configuration"
    rm firebase-config.json
fi

echo ""
print_warning "⚠️  MANUAL STEPS REQUIRED:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"
echo "2. Enable Authentication → Sign-in method → Google"
echo "3. Enable Firestore Database in test mode"
echo "4. Add 'localhost' to authorized domains in Authentication → Settings"
echo ""

read -p "Press Enter when you've completed the manual steps..."

print_success "🎉 Firebase CLI setup complete!"
echo ""
echo "🚀 Test your setup:"
echo "npm run dev"
echo "Then go to http://localhost:5173/d-pp/login"
