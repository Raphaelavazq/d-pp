#!/bin/bash

echo "🚀 Complete Firebase Deployment Setup & Deploy"
echo "=============================================="

# Change to project directory
cd /Users/rafaela/Desktop/d-pp

# Initialize Firebase Hosting (automated responses)
echo "📦 Initializing Firebase Hosting..."
echo "public" | firebase init hosting --project dupp-af67a

# Create firebase.json if it doesn't exist
if [ ! -f "firebase.json" ]; then
    echo "📝 Creating firebase.json configuration..."
    cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
EOF
    echo "✅ firebase.json created with SPA configuration"
fi

# Build the project
echo "🏗️ Building production version..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo ""
echo "🎉 Deployment Complete!"
echo "Your app is now live at: https://dupp-store.web.app"
echo ""
echo "📝 Don't forget to update authorized domains in Firebase Console:"
echo "   https://console.firebase.google.com/project/dupp-af67a/authentication/settings"
echo "   Add: dupp-store.web.app"
echo "   Add: dupp-store.firebaseapp.com"
