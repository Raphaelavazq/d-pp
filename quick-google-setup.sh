#!/bin/bash

# 🚀 One-Command Google Auth Setup
# Run this single command to set up everything

echo "🚀 One-Command Google Auth Setup"
echo "================================"

# Make scripts executable
chmod +x setup-google-auth.sh firebase-cli-setup.sh

echo ""
echo "Choose setup method:"
echo "1) Interactive GUI setup (opens Firebase Console in browser)"
echo "2) Firebase CLI setup (requires Firebase CLI)"
echo "3) Manual setup instructions only"
echo ""

read -p "Choose (1, 2, or 3): " choice

case $choice in
    1)
        echo "🌐 Starting interactive setup..."
        ./setup-google-auth.sh
        ;;
    2)
        echo "🔥 Starting Firebase CLI setup..."
        ./firebase-cli-setup.sh
        ;;
    3)
        echo "📖 Manual setup instructions:"
        echo ""
        echo "1. Go to https://console.firebase.google.com/"
        echo "2. Create/select project"
        echo "3. Enable Authentication → Google sign-in"
        echo "4. Enable Firestore Database"
        echo "5. Add localhost to authorized domains"
        echo "6. Update .env with Firebase config"
        echo "7. Run: npm run dev"
        echo "8. Test at: http://localhost:5173/d-pp/login"
        echo ""
        echo "📚 See GOOGLE_AUTH_SETUP.md for detailed instructions"
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac
