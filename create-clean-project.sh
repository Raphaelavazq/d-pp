#!/bin/bash

echo "🔄 Creating new Firebase project with clean domain name..."
echo "=================================================="

# Change to project directory
cd /Users/rafaela/Desktop/d-pp

echo "📝 Creating new Firebase project 'dupp'..."

# Create new Firebase project
firebase projects:create dupp --display-name "Dupp E-Commerce"

# Check if project was created successfully
if [ $? -eq 0 ]; then
    echo "✅ Project 'dupp' created successfully!"
    
    # Set the new project as default
    echo "🔧 Setting 'dupp' as default project..."
    firebase use dupp
    
    # Enable Authentication
    echo "🔐 Enabling Authentication..."
    firebase --project dupp --non-interactive auth:enable
    
    # Enable Firestore
    echo "💾 Enabling Firestore..."
    firebase --project dupp --non-interactive firestore:enable
    
    # Enable Hosting
    echo "🌐 Enabling Hosting..."
    firebase --project dupp --non-interactive hosting:enable
    
    echo "✅ All services enabled for project 'dupp'"
    echo ""
    echo "🔄 Next steps:"
    echo "1. Update .env file with new project credentials"
    echo "2. Enable Google Sign-in in Firebase Console"
    echo "3. Deploy to new domain: dupp.web.app"
    
else
    echo "❌ Failed to create project 'dupp'"
    echo "📝 The project name might already be taken."
    echo "Let's try with a variation..."
    
    # Try alternative names
    for suffix in "app" "store" "shop" "ecommerce" "premium"; do
        echo "🔄 Trying 'dupp-$suffix'..."
        firebase projects:create "dupp-$suffix" --display-name "Dupp E-Commerce"
        if [ $? -eq 0 ]; then
            echo "✅ Project 'dupp-$suffix' created successfully!"
            firebase use "dupp-$suffix"
            echo "Your new domain will be: dupp-$suffix.web.app"
            break
        fi
    done
fi

echo "🎉 Setup complete! Check Firebase Console for next steps."
