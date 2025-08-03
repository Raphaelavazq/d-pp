# 🔒 Security Guidelines for Developers

**Last Updated:** August 3, 2025  
**Maintainer:** Security Team  
**Status:** Mandatory for All Developers

---

## 🎯 Purpose

This document provides mandatory security guidelines for all developers working on the düpp e-commerce platform. These guidelines ensure we maintain enterprise-grade security and GDPR compliance.

---

## 1. 🛡️ Input Validation & Output Escaping

### Rules

- **Always validate and sanitize all user input** before processing
- Use strict type checking and validation schemas
- Never trust external API data without validation
- Escape all output rendered in React components

### Implementation

```javascript
// ✅ GOOD: Proper input validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// ✅ GOOD: Sanitize product data from BigBuy
const sanitizeProduct = (product) => ({
  id: parseInt(product.id) || 0,
  name: String(product.name || "").slice(0, 200),
  price: Math.max(0, parseFloat(product.price) || 0),
  // ...
});

// ❌ BAD: Direct use without validation
const unsafeProduct = externalApiData.product; // Never do this
```

### Checklist

- [ ] All form inputs validated with proper regex/schemas
- [ ] External API responses validated before use
- [ ] User input sanitized before database storage
- [ ] Output properly escaped in React components

---

## 2. 🔑 Secrets, Tokens, and API Keys

### Rules

- **Never commit secrets to source code**
- Store all secrets in environment variables
- Use server-side configuration for sensitive data
- Rotate keys quarterly and after suspected breaches

### File Structure

```
.env                    # Frontend environment (PUBLIC keys only)
functions/.env          # Backend secrets (PRIVATE keys)
.gitignore             # Must include both .env files
```

### Implementation

```javascript
// ✅ GOOD: Using environment variables
const BIGBUY_API_KEY = functions.config().bigbuy?.api_key;
const STRIPE_SECRET = functions.config().stripe?.secret_key;

// ✅ GOOD: Frontend public keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // ... other public config
};

// ❌ BAD: Hardcoded secrets
const SECRET_KEY = "sk_test_123456789"; // Never do this
```

### Checklist

- [ ] No hardcoded API keys in source code
- [ ] All secrets in appropriate .env files
- [ ] .env files properly git-ignored
- [ ] Server-side secrets use Firebase Functions config
- [ ] Keys rotated quarterly

---

## 3. 🔐 Access Control & Authentication

### Rules

- **Enforce role-based access control everywhere**
- Validate authentication on both client and server
- Use Firebase Auth with custom claims for roles
- Never rely solely on client-side authentication

### Implementation

```javascript
// ✅ GOOD: Server-side admin validation
export const adminOnlyFunction = functions.https.onCall(
  async (data, context) => {
    // Validate authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    // Validate admin role
    const userRecord = await admin.auth().getUser(context.auth.uid);
    if (!userRecord.customClaims?.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Admin access required"
      );
    }

    // Function logic here
  }
);

// ✅ GOOD: Client-side route protection
const ProtectedAdminRoute = ({ children }) => {
  const { user, userProfile } = useAuth();

  if (!user || userProfile?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
```

### Firestore Rules

```javascript
// ✅ GOOD: Secure Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin-only write access
    match /{document=**} {
      allow read, write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // User-specific data access
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Public product read access
    match /products/{productId} {
      allow read: if resource.data.status == 'active';
    }
  }
}
```

### Checklist

- [ ] All admin functions validate authentication and role
- [ ] Firestore rules restrict write access appropriately
- [ ] Client-side routes protected with guards
- [ ] Custom claims used for role management
- [ ] No sensitive operations rely solely on client-side checks

---

## 4. 🌐 Secure API Integration

### Rules

- **Always validate external API responses**
- Use timeouts and error handling for all requests
- Never expose internal errors to users
- Log security events appropriately

### BigBuy API Integration

```javascript
// ✅ GOOD: Secure BigBuy integration
export const searchBigBuyProducts = functions.https.onCall(
  async (data, context) => {
    await validateAdminAccess(context);

    const { query, limit = 50 } = data;

    // Input validation
    if (typeof query !== "string" || query.length > 100) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid search query"
      );
    }

    try {
      const response = await axios.get(
        `${BIGBUY_API_BASE}/rest/catalog/products`,
        {
          headers: getBigBuyHeaders(),
          params: { search: query, limit: Math.min(limit, 100) },
          timeout: 30000,
        }
      );

      // Validate response
      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error("Invalid API response format");
      }

      return {
        success: true,
        products: response.data.data.map(sanitizeProduct),
      };
    } catch (error) {
      functions.logger.error("BigBuy search error:", {
        message: error.message,
      });
      throw new functions.https.HttpsError("internal", "Search failed");
    }
  }
);
```

### Checklist

- [ ] All external API calls have timeouts
- [ ] API responses validated before use
- [ ] Errors logged securely (no sensitive data)
- [ ] Rate limiting implemented where needed
- [ ] CORS configured restrictively

---

## 5. 📱 React Component Security

### Rules

- **Never store sensitive data in component state**
- Use Context API for authentication state
- Avoid direct DOM manipulation for security-critical features
- Implement proper accessibility attributes

### Implementation

```jsx
// ✅ GOOD: Secure component patterns
const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useAuth();

  const handleAddToCart = useCallback(() => {
    if (!user) {
      // Redirect to login
      return;
    }

    // Validate product data
    if (!product?.id || product.price <= 0) {
      showError("Invalid product data");
      return;
    }

    onAddToCart(product);
  }, [user, product, onAddToCart]);

  return (
    <div
      className="product-card"
      role="article"
      aria-label={`Product: ${product.name}`}
    >
      {/* Component content */}
      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        aria-label={`Add ${product.name} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
};

// ❌ BAD: Unsafe patterns
const UnsafeComponent = () => {
  const [userToken, setUserToken] = useState(localStorage.getItem("token")); // Never do this

  useEffect(() => {
    // Direct DOM manipulation without validation
    document.getElementById("content").innerHTML = userInput; // XSS vulnerability
  }, []);
};
```

### Checklist

- [ ] No sensitive data in localStorage/sessionStorage
- [ ] Authentication state managed via Context API
- [ ] Proper ARIA attributes for accessibility
- [ ] No use of dangerouslySetInnerHTML without sanitization
- [ ] Input validation in form components

---

## 6. 🇪🇺 GDPR & Privacy Compliance

### Rules

- **Minimize data collection and storage**
- Obtain explicit user consent for data processing
- Provide clear privacy notices and controls
- Never log personal data in production

### Implementation

```javascript
// ✅ GOOD: GDPR-compliant data handling
const createUserProfile = async (userData) => {
  // Only store necessary data
  const profile = {
    name: userData.name,
    email: userData.email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    // Don't store IP, device info, etc. unless necessary
  };

  await db.collection("users").doc(userData.uid).set(profile);

  // Log action without personal data
  functions.logger.info("User profile created", {
    userId: userData.uid.substring(0, 8) + "...",
    timestamp: new Date().toISOString(),
  });
};

// ✅ GOOD: User consent tracking
const CookieConsent = () => {
  const [consent, setConsent] = useState(null);

  const handleAccept = () => {
    setConsent(true);
    localStorage.setItem("cookieConsent", "accepted");
    // Initialize analytics only after consent
    initializeAnalytics();
  };

  const handleDecline = () => {
    setConsent(false);
    localStorage.setItem("cookieConsent", "declined");
    // Don't initialize tracking
  };

  return <div className="cookie-banner">{/* Consent UI */}</div>;
};
```

### Data Processing Rules

- **EU users**: Process and store data only in EU regions
- **Consent**: Required for analytics, marketing, non-essential cookies
- **Retention**: Delete user data upon request within 30 days
- **Logging**: Never log emails, IPs, or personal identifiers

### Checklist

- [ ] Cookie consent banner implemented
- [ ] Privacy policy accessible and clear
- [ ] User data deletion functionality available
- [ ] No personal data in production logs
- [ ] EU region processing for EU users

---

## 7. 🚀 Pre-Deployment Security Checklist

Before deploying any feature, verify:

### Code Security

- [ ] No secrets exposed in code or environment variables
- [ ] All input validated and sanitized
- [ ] Authentication and authorization properly implemented
- [ ] Error handling doesn't leak sensitive information
- [ ] Dependencies updated and security-scanned

### Infrastructure Security

- [ ] Firestore rules deployed and tested
- [ ] Cloud Functions have proper authentication
- [ ] CORS configured restrictively
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured

### Compliance

- [ ] GDPR requirements met
- [ ] Privacy policy updated if needed
- [ ] Cookie consent properly implemented
- [ ] User data handling documented

### Testing

- [ ] Security validation script passes
- [ ] Manual security testing completed
- [ ] Access control tested with different user roles
- [ ] Error scenarios tested

---

## 8. 🚨 Security Incident Response

### Immediate Actions

1. **Isolate** the affected system/component
2. **Document** the incident with timestamps
3. **Notify** the security team immediately
4. **Preserve** logs and evidence
5. **Communicate** with stakeholders as appropriate

### Escalation

- **Critical**: Data breach, exposed secrets → Immediate escalation
- **High**: Authentication bypass, privilege escalation → 2-hour escalation
- **Medium**: XSS, CSRF, information disclosure → 24-hour escalation
- **Low**: Outdated dependencies, minor misconfigurations → Weekly review

### Contact Information

- **Security Team Lead**: security@dupp.com
- **Emergency Contact**: +49-XXX-XXX-XXXX
- **Incident Portal**: [Internal Security Portal]

---

## 9. 📚 Additional Resources

### Security Tools

- **ESLint Security Plugin**: Automated security linting
- **npm audit**: Dependency vulnerability scanning
- **Firebase Security Rules**: Database access control
- **Security Check Script**: `./security-check.sh`

### Training & Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/secure-data)
- [React Security Guidelines](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [GDPR Compliance Guide](https://gdpr.eu/compliance/)

### Internal Documentation

- `SECURITY_OVERVIEW.md` - Platform security architecture
- `API_REFERENCE.md` - Secure API usage
- `DATA_MODELS.md` - Data structure and access patterns
- `DEPLOYMENT.md` - Secure deployment procedures

---

**Remember: Security is everyone's responsibility. When in doubt, ask the security team before proceeding.**

---

**Document Version:** 1.0  
**Next Review:** November 3, 2025  
**Approved By:** Senior Security Engineer
