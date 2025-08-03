<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# düpp E-Commerce Project Instructions

This is a premium e-commerce web application built with React + Vite, featuring:

## Tech Stack

- React 18 with functional components and hooks
- Vite for build tooling and development server
- Tailwind CSS for styling with custom design system
- GSAP + ScrollTrigger for advanced animations
- React Router for client-side routing
- Context API for state management (cart, user preferences)
- Firebase (Auth, Firestore, Cloud Functions, Hosting)
- Stripe integration for payments
- BigBuy API for dropshipping integration

## Key Features

- Professional GSAP animations and scroll-triggered effects
- Responsive design with mobile-first approach
- Shopping cart with persistent storage
- Product filtering and sorting
- Image galleries with hover effects
- Smooth page transitions
- Complete admin dashboard system
- Real-time inventory management
- Multi-layer authentication & authorization

## 🚨 CRITICAL DEVELOPMENT RULES

### 1. ALWAYS ANALYZE FIRST - NEVER ASSUME

Before making ANY changes:

- 🔍 Read existing project structure
- 📖 Understand current implementation
- 🎯 Identify the specific goal/requirement
- 🧩 Check if solution already exists
- 💭 Plan minimal necessary changes

### 2. FILE CREATION POLICY - STRICT

❌ NEVER CREATE NEW FILES WITHOUT CHECKING:

- Does this functionality already exist?
- Can this be added to an existing file?
- Is this truly a separation of concerns?
- Is there absolutely no other way?

✅ ONLY CREATE NEW FILES FOR:

- True separation of concerns
- New major features/components
- Documentation (when missing)
- Configuration files (when needed)

### 3. MODIFICATION OVER CREATION

- ✅ FIRST: Look for existing files to modify
- ✅ SECOND: Extend existing functionality
- ✅ LAST RESORT: Create new files

## Code Style Guidelines

- Use functional components with hooks
- Implement proper accessibility features (ARIA attributes MANDATORY)
- Follow Tailwind CSS utility-first approach
- Use semantic HTML elements
- Use GSAP for complex animations and ScrollTrigger for scroll-based effects
- Keep components modular and reusable
- Clean and professional code with descriptive naming

## File Structure

- `/src/components` - Reusable UI components (Navbar, Footer, CartDrawer, ProductCard, etc.)
- `/src/pages` - Main page components (Home, Shop, About, Profile, Admin, etc.)
- `/src/contexts` - React Context providers (AuthContext, CartContext, FirestoreContext)
- `/src/hooks` - Custom React hooks (useAuth, useCart, useFirestore, etc.)
- `/src/utils` - Utility functions
- `/src/data` - Mock data and constants
- `/src/config` - Configuration files (firebase.js)
- `/functions/src` - Firebase Cloud Functions (TypeScript)

## Existing Architecture - DO NOT RECREATE

### Authentication System (COMPLETE)

- ✅ Email/Password + Google OAuth
- ✅ User registration with profiles
- ✅ Protected routes (ProtectedRoute.jsx)
- ✅ Admin authentication system
- ✅ Role-based access control
- ✅ Context: AuthContext.jsx
- ✅ Hook: useAuth.js

### E-commerce System (COMPLETE)

- ✅ Shopping cart (CartContext.jsx, useCart.js)
- ✅ Product catalog with filtering
- ✅ Stripe checkout integration
- ✅ Order management system
- ✅ Inventory tracking
- ✅ BigBuy dropshipping API

### Admin System (COMPLETE)

- ✅ Admin login (/admin)
- ✅ Complete dashboard (/admin/dashboard)
- ✅ User management
- ✅ Product management
- ✅ Order processing
- ✅ Analytics
- ✅ BigBuy integration

### Firebase Backend (COMPLETE)

- ✅ Cloud Functions (userTriggers, orderProcessing, productSync, etc.)
- ✅ Firestore with security rules
- ✅ Authentication with custom claims
- ✅ Real-time data synchronization

## Animation Guidelines

- Use GSAP for entrance animations and micro-interactions
- Implement ScrollTrigger for scroll-based reveals
- Keep animations smooth and professional
- Use consistent timing and easing functions
- Ensure animations are accessible and can be disabled

## Design System

- Primary colors: Various shades defined in tailwind.config.js
- Typography: Chillax font family (premium custom typeface) used consistently throughout
- Spacing: Tailwind's default spacing scale
- Shadows and borders: Consistent with the luxury aesthetic
- Use gradient text for brand elements

## Accessibility Requirements (MANDATORY)

All interactive elements MUST have ARIA attributes:

```jsx
// REQUIRED: Proper ARIA labeling
<button
  aria-label="Add to cart"
  aria-describedby="product-price"
  onClick={handleAddToCart}
>
  Add to Cart
</button>

<input
  aria-label="Search products"
  aria-required="true"
  role="searchbox"
/>

<nav aria-label="Main navigation">
  <ul role="list">
    <li role="listitem">
      <a href="/shop" aria-current="page">Shop</a>
    </li>
  </ul>
</nav>
```

## Component Structure Template

```jsx
// 1. Imports (React, hooks, components, styles)
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

// 2. Component definition with proper naming
const MyComponent = ({ product, onAction, className = "" }) => {
  // 3. State and hooks
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 4. Effects
  useEffect(() => {
    // Side effects
  }, []);

  // 5. Event handlers
  const handleSubmit = () => {
    // Handler logic
  };

  // 6. Return with proper accessibility
  return (
    <article
      className={`component-wrapper ${className}`}
      aria-label={`Component: ${product?.title}`}
    >
      {/* JSX content */}
    </article>
  );
};

// 7. Export
export default MyComponent;
```

## Integration Patterns

### Use Existing Contexts

```jsx
// ✅ USE THESE - DON'T CREATE NEW ONES
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useFirestore } from "../contexts/FirestoreContext";
```

### Extend Existing Components

```jsx
// ✅ GOOD: Extend existing functionality
const EnhancedProductCard = ({ product, onQuickView, ...props }) => {
  // Add new props to existing component
};

// ❌ BAD: Don't create duplicates
// const ProductCardNew = () => { ... }
```

## Question Framework

Before ANY development work, ask:

1. **WHAT** am I trying to achieve?
2. **WHERE** does this fit in existing structure?
3. **HOW** can I extend existing code?
4. **WHY** is a new file necessary?
5. **WHO** will be affected by this change?

## Golden Rules Summary

### NEVER:

- Create files without checking existing structure
- Duplicate functionality that already exists
- Ignore accessibility requirements
- Create new contexts/hooks without necessity
- Skip the analysis phase

### ALWAYS:

- Analyze existing project structure first
- Understand the specific requirement
- Look for existing solutions to extend
- Add proper ARIA attributes
- Follow existing code patterns
- Use semantic HTML elements

**Remember: This project is already enterprise-grade. Enhance, don't recreate!**
