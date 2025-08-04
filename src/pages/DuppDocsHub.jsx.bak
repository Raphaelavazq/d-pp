import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Shield,
  Code,
  Database,
  Rocket,
  TestTube,
  Settings,
  Book,
  Users,
  Search,
  Star,
  AlertTriangle,
  FileText,
  Lock,
  Globe,
  Server,
  Zap,
  Eye,
} from "lucide-react";

const DuppDocsHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedSubSections, setExpandedSubSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleSubSection = (subSectionId) => {
    setExpandedSubSections((prev) => ({
      ...prev,
      [subSectionId]: !prev[subSectionId],
    }));
  };

  // Documentation content organized by sections
  const documentationSections = [
    {
      id: "security",
      title: "Security & Compliance",
      icon: Shield,
      description:
        "Enterprise-grade security implementation and compliance guidelines",
      subsections: [
        {
          id: "security-overview",
          title: "Security Architecture Overview",
          content: `
**Executive Summary**
The düpp e-commerce platform implements enterprise-grade security with defense-in-depth architecture, ensuring comprehensive protection of customer data, payment information, and business operations while maintaining full GDPR compliance.

**Security Score:** 96/100
**Compliance Status:** GDPR/DSGVO Compliant, PCI-DSS Ready
**Risk Level:** Low

**Key Security Features:**
• Multi-layer authentication with Firebase Auth
• Role-based access control (RBAC)
• HTTPS everywhere with security headers
• PCI-DSS compliant payment processing via Stripe
• GDPR-compliant data handling and user rights
• Real-time security monitoring and incident response

**Authentication Architecture:**
• Firebase Authentication with custom claims
• Google OAuth integration
• Protected routes with role verification
• Session management with secure tokens

**Data Protection:**
• Encryption at rest and in transit
• Data minimization principles
• User consent management
• Automated data retention policies
• Regular security audits and compliance reviews
          `,
        },
        {
          id: "security-guidelines",
          title: "Security Guidelines & Best Practices",
          content: `
**Development Security Requirements**

**Authentication & Authorization:**
• Always validate user authentication on both client and server
• Use Firebase Auth custom claims for role-based access
• Implement proper session management
• Never store sensitive data in localStorage/sessionStorage

**Input Validation & Sanitization:**
• Validate all user inputs on both frontend and backend
• Use Firestore security rules for database-level validation
• Sanitize all data before storing or displaying
• Implement proper error handling without exposing system details

**API Security:**
• All API keys must be stored server-side only
• Use environment variables for sensitive configuration
• Implement rate limiting on all endpoints
• Validate all incoming requests and responses

**GDPR Compliance Checklist:**
✅ Data minimization - collect only necessary data
✅ User consent management with clear opt-in/opt-out
✅ Right to access - user dashboard with all stored data
✅ Right to rectification - profile editing capabilities
✅ Right to erasure - account deletion functionality
✅ Right to portability - data export functionality
✅ Data retention policies with automatic cleanup
✅ Privacy policy and terms clearly accessible

**Security Testing Requirements:**
• Run security linting before each commit
• Perform dependency vulnerability scanning
• Test authentication and authorization flows
• Validate input sanitization and output encoding
• Test CORS and security headers configuration
          `,
        },
      ],
    },
    {
      id: "development",
      title: "Development & Architecture",
      icon: Code,
      description: "Technical documentation for developers and architects",
      subsections: [
        {
          id: "project-structure",
          title: "Project Structure & Guidelines",
          content: `
**Technology Stack**
• Frontend: React 18 + Vite + Tailwind CSS
• Backend: Firebase (Auth, Firestore, Cloud Functions)
• Payments: Stripe integration
• Animations: GSAP + ScrollTrigger
• State Management: Context API + Custom Hooks
• API Integration: BigBuy dropshipping API

**Project Structure:**
\`\`\`
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── [ComponentName].jsx
├── pages/              # Main page components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── config/             # Configuration files
└── data/               # Mock data and constants
\`\`\`

**Development Rules:**
🚨 ALWAYS analyze existing structure before creating new files
🚨 NEVER duplicate functionality that already exists
🚨 ALWAYS follow accessibility requirements (ARIA attributes)
🚨 ALWAYS read SECURITY_GUIDELINES.md before making changes

**Component Structure Template:**
\`\`\`jsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

// 2. Component definition
const MyComponent = ({ prop1, className = "" }) => {
  // 3. State and hooks
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 4. Effects and handlers
  useEffect(() => {
    // Side effects
  }, []);

  // 5. Return with accessibility
  return (
    <article 
      className={\`component-wrapper \${className}\`}
      aria-label="Component description"
    >
      {/* JSX content */}
    </article>
  );
};

export default MyComponent;
\`\`\`
          `,
        },
        {
          id: "api-documentation",
          title: "API Documentation & Integration",
          content: `
**Firebase Cloud Functions API**

**Authentication Endpoints:**
• \`createUser\` - User registration with profile creation
• \`updateUserProfile\` - Profile updates with validation
• \`deleteUser\` - Account deletion with GDPR compliance

**E-commerce Endpoints:**
• \`processOrder\` - Order processing with inventory checks
• \`updateInventory\` - Stock level management
• \`syncProducts\` - BigBuy product synchronization

**Admin Endpoints:**
• \`adminUserManagement\` - User administration
• \`adminProductManagement\` - Product catalog management
• \`adminOrderProcessing\` - Order fulfillment
• \`adminAnalytics\` - Business intelligence data

**BigBuy API Integration:**
\`\`\`javascript
// Product import workflow
const importProducts = async (categoryId) => {
  try {
    const products = await bigbuyApi.getProducts({
      category: categoryId,
      language: 'en',
      country: 'DE'
    });
    
    // Validate and sanitize data
    const validatedProducts = products.map(validateProduct);
    
    // Store in Firestore with admin approval required
    await Promise.all(
      validatedProducts.map(product => 
        createPendingProduct(product)
      )
    );
  } catch (error) {
    logger.error('Product import failed', { error: error.message });
  }
};
\`\`\`

**Stripe Payment Integration:**
\`\`\`javascript
// Secure payment processing
const processPayment = async (paymentIntent) => {
  try {
    // Verify payment intent
    const payment = await stripe.paymentIntents.retrieve(paymentIntent.id);
    
    if (payment.status === 'succeeded') {
      // Create order in Firestore
      await createOrder({
        userId: payment.metadata.userId,
        amount: payment.amount,
        items: JSON.parse(payment.metadata.items)
      });
    }
  } catch (error) {
    logger.error('Payment processing failed', { error: error.message });
  }
};
\`\`\`
          `,
        },
      ],
    },
    {
      id: "firebase",
      title: "Firebase Backend",
      icon: Database,
      description:
        "Backend infrastructure, Cloud Functions, and database management",
      subsections: [
        {
          id: "firebase-setup",
          title: "Firebase Configuration & Setup",
          content: `
**Firebase Project Configuration**

**Services Used:**
• Authentication (Email/Password + Google OAuth)
• Firestore Database (EU region for GDPR compliance)
• Cloud Functions (TypeScript-based)
• Hosting (Static site deployment)
• Analytics (Privacy-compliant implementation)

**Environment Setup:**
\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and select project
firebase login
firebase use dupp-ecommerce-prod

# Deploy functions
cd functions
npm install
npm run build
firebase deploy --only functions

# Deploy frontend
npm run build
firebase deploy --only hosting
\`\`\`

**Firestore Security Rules:**
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin-only access to sensitive collections
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // User-specific data access
    match /users/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
    }
    
    // Public read access to active products
    match /products/{productId} {
      allow read: if resource.data.status == 'active';
      allow write: if isAdmin();
    }
    
    // Orders restricted to owner and admins
    match /orders/{orderId} {
      allow read, write: if isOwner(resource.data.userId) || isAdmin();
    }
  }
  
  // Helper functions
  function isAdmin() {
    return request.auth != null && 
           request.auth.token.admin == true;
  }
  
  function isOwner(userId) {
    return request.auth != null && 
           request.auth.uid == userId;
  }
}
\`\`\`

**Cloud Functions Structure:**
\`\`\`
functions/src/
├── index.ts              # Main exports
├── userTriggers.ts       # User management functions
├── orderProcessing.ts    # E-commerce workflow
├── productSync.ts        # BigBuy integration
├── notifications.ts      # Email/SMS notifications
└── analytics.ts          # Business intelligence
\`\`\`
          `,
        },
        {
          id: "database-schema",
          title: "Database Schema & Data Models",
          content: `
**Firestore Collections Schema**

**Users Collection:**
\`\`\`javascript
/users/{userId}
{
  email: string,
  displayName: string,
  photoURL?: string,
  role: 'customer' | 'admin',
  profile: {
    firstName: string,
    lastName: string,
    phone?: string,
    address?: {
      street: string,
      city: string,
      zipCode: string,
      country: string
    }
  },
  preferences: {
    newsletter: boolean,
    analytics: boolean,
    marketing: boolean
  },
  createdAt: timestamp,
  lastLogin: timestamp,
  gdprConsent: {
    given: boolean,
    timestamp: timestamp,
    version: string
  }
}
\`\`\`

**Products Collection:**
\`\`\`javascript
/products/{productId}
{
  title: string,
  description: string,
  price: number,
  currency: 'EUR',
  images: string[],
  category: string,
  subcategory?: string,
  brand?: string,
  sku: string,
  bigbuyId?: string,
  stock: {
    available: number,
    reserved: number,
    threshold: number
  },
  status: 'active' | 'inactive' | 'pending',
  seo: {
    metaTitle: string,
    metaDescription: string,
    keywords: string[]
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  adminApproved: boolean,
  approvedBy?: string,
  approvedAt?: timestamp
}
\`\`\`

**Orders Collection:**
\`\`\`javascript
/orders/{orderId}
{
  userId: string,
  items: [{
    productId: string,
    title: string,
    price: number,
    quantity: number,
    sku: string
  }],
  totals: {
    subtotal: number,
    tax: number,
    shipping: number,
    total: number
  },
  shipping: {
    address: Address,
    method: string,
    trackingNumber?: string
  },
  payment: {
    stripePaymentIntentId: string,
    status: 'pending' | 'paid' | 'failed' | 'refunded',
    method: string
  },
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  timestamps: {
    created: timestamp,
    confirmed?: timestamp,
    shipped?: timestamp,
    delivered?: timestamp
  },
  bigbuyOrders?: [{
    orderId: string,
    status: string,
    trackingNumber?: string
  }]
}
\`\`\`

**Data Validation Functions:**
\`\`\`javascript
const validateUser = (userData) => {
  const schema = {
    email: { type: 'string', required: true, format: 'email' },
    displayName: { type: 'string', required: true, minLength: 2 },
    profile: {
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true }
    }
  };
  
  return validateSchema(userData, schema);
};
\`\`\`
          `,
        },
      ],
    },
    {
      id: "deployment",
      title: "Deployment & Operations",
      icon: Rocket,
      description:
        "Deployment processes, monitoring, and operational procedures",
      subsections: [
        {
          id: "deployment-guide",
          title: "Deployment Guide & CI/CD",
          content: `
**Production Deployment Process**

**Prerequisites:**
• Firebase CLI installed and authenticated
• Node.js 18+ installed
• Access to Firebase project
• Environment variables configured

**Step-by-Step Deployment:**

**1. Pre-deployment Checks:**
\`\`\`bash
# Run tests
npm test

# Security audit
npm audit --audit-level moderate

# Build optimization
npm run build

# Lighthouse performance check
npm run lighthouse
\`\`\`

**2. Firebase Functions Deployment:**
\`\`\`bash
cd functions
npm install
npm run build
npm run test

# Deploy functions
firebase deploy --only functions --project production
\`\`\`

**3. Frontend Deployment:**
\`\`\`bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting --project production
\`\`\`

**4. Database Rules & Indexes:**
\`\`\`bash
# Deploy Firestore rules
firebase deploy --only firestore:rules --project production

# Deploy indexes
firebase deploy --only firestore:indexes --project production
\`\`\`

**Environment Management:**
\`\`\`bash
# Set environment variables
firebase functions:config:set \\
  bigbuy.api_key="YOUR_API_KEY" \\
  stripe.secret_key="sk_live_..." \\
  --project production

# View current config
firebase functions:config:get --project production
\`\`\`

**Rollback Procedures:**
\`\`\`bash
# Rollback to previous hosting version
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION_ID TARGET_SITE_ID

# Rollback functions (manual process)
# 1. Checkout previous git commit
# 2. Redeploy functions
# 3. Test functionality
\`\`\`

**Health Checks:**
• Frontend accessibility via HTTPS
• API endpoints responding correctly
• Database queries performing within limits
• Payment processing functional
• BigBuy integration active
          `,
        },
        {
          id: "monitoring",
          title: "Monitoring & Performance",
          content: `
**System Monitoring Setup**

**Firebase Monitoring:**
• Performance monitoring enabled for web app
• Real-time database performance metrics
• Function execution logs and errors
• Authentication success/failure rates
• Hosting bandwidth and request metrics

**Custom Analytics:**
\`\`\`javascript
// Performance tracking
import { getPerformance } from 'firebase/performance';

const perf = getPerformance();

// Track custom metrics
const trace = perf.trace('checkout_process');
trace.start();
// ... checkout logic
trace.stop();
\`\`\`

**Error Monitoring:**
\`\`\`javascript
// Function error logging
import { logger } from 'firebase-functions';

export const processOrder = functions.https.onCall(async (data, context) => {
  try {
    // Order processing logic
  } catch (error) {
    logger.error('Order processing failed', {
      userId: context.auth?.uid,
      orderId: data.orderId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    throw new functions.https.HttpsError(
      'internal',
      'Order processing failed'
    );
  }
});
\`\`\`

**Performance Metrics:**
• Page load times (target: <3 seconds)
• API response times (target: <500ms)
• Database query performance
• Image optimization and CDN usage
• Mobile performance scores

**Alerting Configuration:**
• Function error rates >5%
• Database quota usage >80%
• Authentication failure spikes
• Payment processing failures
• Unusual traffic patterns

**Business Metrics Dashboard:**
• Daily/weekly/monthly order volumes
• Conversion rates by traffic source
• Average order values
• Customer acquisition costs
• Product performance analytics
• BigBuy import success rates
          `,
        },
      ],
    },
    {
      id: "testing",
      title: "Testing & Quality Assurance",
      icon: TestTube,
      description:
        "Testing strategies, quality assurance, and validation procedures",
      subsections: [
        {
          id: "testing-strategy",
          title: "Testing Strategy & Framework",
          content: `
**Testing Philosophy**
Comprehensive testing ensures reliability, security, and user experience quality across all platform components.

**Testing Pyramid:**
• **Unit Tests (70%)**: Individual functions and components
• **Integration Tests (20%)**: API endpoints and data flow
• **End-to-End Tests (10%)**: Complete user workflows

**Testing Tools & Framework:**
• **Vitest**: Fast unit testing framework
• **React Testing Library**: Component testing
• **Firebase Test SDK**: Cloud Functions testing
• **Cypress**: End-to-end testing
• **Jest**: Snapshot and mock testing

**Unit Testing Examples:**
\`\`\`javascript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthContext } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';

describe('ProductCard', () => {
  test('displays product information correctly', () => {
    const mockProduct = {
      id: '1',
      title: 'Test Product',
      price: 29.99,
      images: ['test-image.jpg']
    };
    
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('€29.99')).toBeInTheDocument();
  });
  
  test('handles add to cart functionality', () => {
    const mockAddToCart = jest.fn();
    const mockUser = { uid: 'test-user' };
    
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <ProductCard product={mockProduct} onAddToCart={mockAddToCart} />
      </AuthContext.Provider>
    );
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
\`\`\`

**Cloud Functions Testing:**
\`\`\`javascript
import { test } from 'firebase-functions-test';
import * as functions from '../src/index';

const testEnv = test();

describe('orderProcessing', () => {
  test('processes valid order correctly', async () => {
    const mockData = {
      userId: 'test-user',
      items: [{ productId: 'prod-1', quantity: 2 }]
    };
    
    const mockContext = {
      auth: { uid: 'test-user' }
    };
    
    const result = await functions.processOrder(mockData, mockContext);
    
    expect(result.success).toBe(true);
    expect(result.orderId).toBeDefined();
  });
});
\`\`\`

**Testing Commands:**
\`\`\`bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run function tests
cd functions && npm test
\`\`\`
          `,
        },
        {
          id: "quality-assurance",
          title: "Quality Assurance & Code Review",
          content: `
**Code Quality Standards**

**Linting & Formatting:**
• ESLint configuration with security rules
• Prettier for consistent code formatting
• Husky pre-commit hooks for quality gates
• SonarQube for code quality analysis

**Code Review Checklist:**
✅ **Security**: No exposed secrets, proper input validation
✅ **Performance**: Optimized queries, efficient algorithms
✅ **Accessibility**: ARIA attributes, keyboard navigation
✅ **Testing**: Adequate test coverage, edge cases covered
✅ **Documentation**: Clear comments, updated docs
✅ **GDPR**: Privacy compliance, data handling correct

**Automated Quality Gates:**
\`\`\`json
// package.json scripts
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "security-audit": "npm audit --audit-level moderate",
    "accessibility-test": "axe-core src",
    "pre-commit": "npm run lint && npm run test && npm run security-audit"
  }
}
\`\`\`

**Performance Testing:**
• Lighthouse CI for web vitals
• Load testing for Firebase Functions
• Database performance monitoring
• Mobile device testing
• Cross-browser compatibility

**Security Testing:**
• OWASP dependency scanning
• Static application security testing (SAST)
• Firebase security rules validation
• Input sanitization verification
• Authentication flow testing

**Quality Metrics:**
• Code coverage >80%
• Lighthouse performance score >90
• Security vulnerability count: 0 critical
• Accessibility compliance: WCAG 2.1 AA
• Code duplication <5%

**Bug Tracking & Resolution:**
• GitHub Issues for bug tracking
• Severity classification (P0-P3)
• Root cause analysis documentation
• Fix verification and testing
• Regression prevention measures
          `,
        },
      ],
    },
    {
      id: "admin",
      title: "Admin & Management",
      icon: Settings,
      description:
        "Administrative interfaces, user management, and business operations",
      subsections: [
        {
          id: "admin-system",
          title: "Admin System Overview",
          content: `
**Admin Dashboard Architecture**

**Access Control:**
• Multi-layer authentication system
• Role-based permissions (admin vs customer)
• Firebase custom claims for server-side validation
• Protected routes with real-time auth checks

**Admin Routes:**
• \`/admin\` - Admin login page
• \`/admin/dashboard\` - Main administrative interface
• \`/admin/products\` - Product catalog management
• \`/admin/orders\` - Order processing and fulfillment
• \`/admin/users\` - User account management
• \`/admin/analytics\` - Business intelligence dashboard
• \`/admin/settings\` - System configuration

**Dashboard Features:**
• **Real-time Metrics**: Orders, revenue, user activity
• **Product Management**: BigBuy import, catalog editing
• **Order Processing**: Status updates, fulfillment tracking
• **User Administration**: Account management, role assignment
• **Analytics**: Sales reports, customer insights
• **System Health**: Performance monitoring, error tracking

**BigBuy Integration Management:**
\`\`\`javascript
// Admin product import workflow
const importBigBuyProducts = async (categoryId) => {
  try {
    // Fetch products from BigBuy API
    const products = await bigbuyApi.getProducts({
      category: categoryId,
      language: 'en',
      country: 'DE'
    });
    
    // Process and validate products
    const processedProducts = products.map(product => ({
      ...product,
      status: 'pending', // Requires admin approval
      importedAt: new Date(),
      adminApproved: false
    }));
    
    // Batch create in Firestore
    await batchCreateProducts(processedProducts);
    
    return { success: true, imported: products.length };
  } catch (error) {
    logger.error('BigBuy import failed', { error: error.message });
    throw error;
  }
};
\`\`\`

**Admin Security Features:**
• Session timeout and automatic logout
• Activity logging and audit trails
• IP-based access restrictions (optional)
• Two-factor authentication (planned)
• Privileged action confirmation dialogs
          `,
        },
        {
          id: "user-management",
          title: "User Management & Support",
          content: `
**User Administration**

**User Account Management:**
• View all registered users with search/filter
• Edit user profiles and preferences
• Manage user roles and permissions
• Handle account deletion requests (GDPR)
• Monitor user activity and engagement

**Customer Support Tools:**
• Order history and status tracking
• Payment and refund management
• Address and profile updates
• Communication log and notes
• Escalation to technical support

**GDPR Compliance Tools:**
\`\`\`javascript
// User data export for GDPR compliance
const exportUserData = async (userId) => {
  try {
    const userData = await db.collection('users').doc(userId).get();
    const orders = await db.collection('orders')
      .where('userId', '==', userId)
      .get();
    
    const exportData = {
      profile: userData.data(),
      orders: orders.docs.map(doc => doc.data()),
      exportDate: new Date().toISOString(),
      format: 'JSON'
    };
    
    return exportData;
  } catch (error) {
    logger.error('User data export failed', { userId, error: error.message });
    throw error;
  }
};

// User account deletion
const deleteUserAccount = async (userId) => {
  try {
    // 1. Anonymize order data (keep for business records)
    await anonymizeUserOrders(userId);
    
    // 2. Delete personal data
    await db.collection('users').doc(userId).delete();
    
    // 3. Delete Firebase Auth account
    await admin.auth().deleteUser(userId);
    
    // 4. Log deletion for audit
    logger.info('User account deleted', { userId, timestamp: new Date() });
    
    return { success: true };
  } catch (error) {
    logger.error('User deletion failed', { userId, error: error.message });
    throw error;
  }
};
\`\`\`

**User Analytics:**
• Registration and retention metrics
• Purchase behavior analysis
• Geographic distribution
• Device and browser usage
• Customer lifetime value calculations

**Communication Management:**
• Newsletter subscription management
• Marketing email preferences
• SMS notification settings
• Push notification controls
• Privacy consent tracking
          `,
        },
      ],
    },
  ];

  const filteredSections = documentationSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.subsections.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Book className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  düpp Documentation
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Complete Developer Documentation Hub
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Everything you need to develop, deploy, and maintain the düpp
            e-commerce platform. From security guidelines to API documentation,
            all in one place.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Section Header */}
              <div
                className="p-6 border-b bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <section.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Section Content */}
              {expandedSections[section.id] && (
                <div className="p-6">
                  <div className="space-y-4">
                    {section.subsections.map((subsection) => (
                      <div
                        key={subsection.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        {/* Subsection Header */}
                        <div
                          className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-b"
                          onClick={() => toggleSubSection(subsection.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-600" />
                              <h4 className="font-medium text-gray-900">
                                {subsection.title}
                              </h4>
                            </div>
                            {expandedSubSections[subsection.id] ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </div>

                        {/* Subsection Content */}
                        {expandedSubSections[subsection.id] && (
                          <div className="p-6 bg-white">
                            <div className="prose prose-blue max-w-none">
                              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                                {subsection.content}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Start Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Rocket className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">New Developer Setup</h4>
              <p className="text-sm text-gray-600 mt-1">
                Get started with the development environment
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Shield className="h-6 w-6 text-green-600 mb-2" />
              <h4 className="font-medium text-gray-900">Security Checklist</h4>
              <p className="text-sm text-gray-600 mt-1">
                Essential security requirements for all developers
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Database className="h-6 w-6 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-900">
                Deploy to Production
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Step-by-step deployment guide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            düpp Documentation Hub - Internal Developer Resources
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Last updated: August 3, 2025 • Need help? Contact the development
            team
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DuppDocsHub;
