#!/bin/bash

echo "🔄 Updating Firebase authorized domains for production..."

# Add the Firebase Hosting domain as an authorized domain
echo "Adding dupp-af67a.web.app to authorized domains..."

# Open Firebase Console for manual domain configuration
echo "Please visit Firebase Console to add authorized domains:"
echo "1. Go to: https://console.firebase.google.com/project/dupp-af67a/authentication/settings"
echo "2. Scroll to 'Authorized domains'"
echo "3. Add: dupp-af67a.web.app"
echo "4. Add: dupp-af67a.firebaseapp.com"
echo ""
echo "Press Enter when you've added the domains..."
read -p ""

echo "✅ Domains should now be configured!"
