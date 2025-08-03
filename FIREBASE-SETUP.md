# Firebase Configuration Setup

## Environment Variables Setup

### Required Firebase Function Configuration

To set up the BigBuy API integration, you need to configure the BigBuy API key in Firebase Functions.

#### Setting BigBuy API Key

Run this command in your terminal from the project root:

```bash
firebase functions:config:set bigbuy.api_key="YOUR_BIGBUY_API_KEY_HERE"
```

Replace `YOUR_BIGBUY_API_KEY_HERE` with your actual BigBuy API key.

#### Verify Configuration

To verify your configuration is set correctly:

```bash
firebase functions:config:get
```

This should show your BigBuy configuration.

#### Deploy Functions

After setting the configuration, deploy your functions:

```bash
cd functions
npm run build
firebase deploy --only functions
```

#### For Local Development

Create a `.runtimeconfig.json` file in your `functions` directory with:

```json
{
  "bigbuy": {
    "api_key": "YOUR_BIGBUY_API_KEY_HERE"
  }
}
```

**Important:** Add `.runtimeconfig.json` to your `.gitignore` file to keep your API key secret.

### Required Firestore Collections

Ensure these collections exist in your Firestore database:

1. **products** - For storing product data

   - Structure: `{ name, description, price, stock, images[], category, origin, bigBuyId?, ... }`

2. **orders** - For storing order data

   - Structure: `{ customerName, customerEmail, items[], total, status, createdAt, ... }`

3. **users** - For storing user data
   - Structure: `{ name, email, role, status, createdAt, orderCount?, totalSpent?, ... }`

### Admin Access Setup

To access the admin dashboard, users need the "admin" role. Run this script to create an admin user:

```bash
cd scripts
node createAdminSecure.js
```

Follow the prompts to create an admin user with the necessary permissions.

### Security Rules

Ensure your Firestore security rules allow admin access. Update your `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin access
    match /{document=**} {
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // User access to their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public read access to active products
    match /products/{productId} {
      allow read: if resource.data.status == 'active';
    }

    // User access to their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### BigBuy API Endpoints Used

The integration uses these BigBuy API endpoints:

1. **Search Products**: `GET /rest/catalog/products`
2. **Product Details**: `GET /rest/catalog/products/{id}`
3. **Categories**: `GET /rest/catalog/categories`
4. **Stock Levels**: `GET /rest/catalog/products/{id}/stock`

### Features Enabled

After setup, your admin dashboard will have:

✅ **Real Firebase Data Integration**

- Live product management from Firestore
- Real-time order tracking
- User management with role-based access

✅ **BigBuy Product Importer**

- Search BigBuy catalog by keyword/category
- Preview products before importing
- Automatic stock sync (hourly)
- Bulk import capabilities

✅ **GDPR Compliance**

- Secure API key handling
- Data protection features
- User consent management

### Troubleshooting

**Error: "BigBuy API key not configured"**

- Ensure you've set the API key using `firebase functions:config:set`
- Deploy functions after setting configuration

**Error: "Admin access required"**

- Ensure the user has admin role in Firestore
- Run the admin creation script

**Error: "Failed to search BigBuy products"**

- Check your BigBuy API key is valid
- Verify BigBuy API quota hasn't been exceeded
- Check function logs: `firebase functions:log`
