# Firebase + React Dropshipping App Installation Guide

## Prerequisites

- Node.js 18+ installed
- Firebase account and project
- AliExpress API access (for product sync)

## 1. Install Dependencies

### Frontend Dependencies

```bash
npm install firebase
```

### Firebase Functions Dependencies

```bash
cd functions
npm install
```

## 2. Firebase Setup

### Configure Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Firestore Database
4. Enable Authentication (Email/Password and Google)
5. Enable Cloud Storage
6. Enable Cloud Functions

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ALIEXPRESS_API_KEY=your_aliexpress_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Create `functions/.env` file:

```env
ALIEXPRESS_API_KEY=your_aliexpress_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

## 3. Firebase Configuration

### Initialize Firebase (if not done)

```bash
firebase login
firebase init
```

Select:

- Firestore
- Functions
- Hosting
- Storage

### Deploy Security Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Deploy Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

## 4. Development Setup

### Start Firebase Emulators

```bash
firebase emulators:start
```

### Start Development Server

```bash
npm run dev
```

## 5. Stripe Setup

1. Create Stripe account
2. Get API keys from dashboard
3. Configure webhooks for order processing

## 6. Provider Setup

Update your `main.jsx` to include providers:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { FirestoreProvider } from "./contexts/FirestoreContext";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <FirestoreProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FirestoreProvider>
    </AuthProvider>
  </React.StrictMode>
);
```

## 7. Usage Examples

### Using Authentication

```jsx
import { useAuth } from "./hooks/useAuth";

function LoginComponent() {
  const { signIn, currentUser } = useAuth();

  if (currentUser) return <div>Welcome {currentUser.email}</div>;

  return (
    <button onClick={() => signIn("email@example.com", "password")}>
      Sign In
    </button>
  );
}
```

### Using Firestore

```jsx
import { useFirestore } from "./hooks/useFirestore";

function ProductList() {
  const { getProducts } = useFirestore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 8. Testing

```bash
# Run tests with emulators
npm test

# Test functions locally
cd functions
npm test
```

## 9. Production Deployment

```bash
# Build and deploy
npm run build
firebase deploy
```

## Troubleshooting

- Ensure Firebase config is correct
- Check emulator ports aren't in use
- Verify API keys are valid
- Check Firebase project permissions
