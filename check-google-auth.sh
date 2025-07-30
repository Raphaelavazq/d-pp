#!/bin/bash

echo "🔍 Google Authentication Setup Checker"
echo "======================================"

# Check if Firebase config exists
if [ -f "src/config/firebase.js" ]; then
    echo "✅ Firebase configuration found"
else
    echo "❌ Firebase configuration missing"
    exit 1
fi

# Check if .env file has Firebase config
if [ -f ".env" ]; then
    echo "✅ Environment file found"
    if grep -q "VITE_FIREBASE_API_KEY" .env; then
        echo "✅ Firebase API key configured"
    else
        echo "❌ Firebase API key missing in .env"
    fi
else
    echo "❌ .env file missing"
fi

# Check if authentication pages exist
if [ -f "src/pages/Login.jsx" ] && [ -f "src/pages/Signup.jsx" ]; then
    echo "✅ Login and Signup pages found"
else
    echo "❌ Authentication pages missing"
fi

# Check if Google auth is implemented
if grep -q "signInWithGoogle" src/pages/Login.jsx && grep -q "signInWithGoogle" src/pages/Signup.jsx; then
    echo "✅ Google authentication implemented in both pages"
else
    echo "❌ Google authentication not properly implemented"
fi

# Check AuthContext
if grep -q "GoogleAuthProvider\|signInWithPopup" src/contexts/AuthContext.jsx; then
    echo "✅ Google OAuth provider configured"
else
    echo "❌ Google OAuth not configured in AuthContext"
fi

echo ""
echo "🚀 NEXT STEPS TO ENABLE GOOGLE SIGN-IN:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/"
echo "2. Enable Google provider in Authentication → Sign-in method"
echo "3. Add localhost:5173 to authorized domains"
echo "4. Update .env with your real Firebase credentials"
echo "5. Start app: npm run dev"
echo "6. Test Google buttons on /login and /signup pages"
echo ""
echo "📖 See GOOGLE_AUTH_SETUP.md for detailed instructions"
