# düpp E-Commerce Project Instructions

This is a premium e-commerce web application built with React + Vite, featuring luxury design patterns and professional animations.

## Tech Stack & Architecture

- **React 18** with functional components and hooks
- **Vite** for build tooling and development server  
- **Tailwind CSS** with custom design system and luxury aesthetics
- **GSAP + ScrollTrigger** for premium animations and scroll effects
- **React Router** for client-side routing
- **Context API** for state management (auth, cart, firestore)
- **Stripe** integration for payments (demo mode with test keys)

## Key Architectural Patterns

### Context-Based State Management
- Multiple context providers: `AuthProvider`, `CartProvider`, `FirestoreProvider`
- Contexts are in `/src/contexts/` with corresponding hooks in `/src/hooks/`
- Example: `useAuth()` hook consumes `AuthContext` for authentication state
- Password protection system using `usePasswordProtection()` hook

### Component Structure
- **Pages**: Main route components in `/src/pages/`
- **Components**: Reusable UI in `/src/components/` (Navbar, Footer, ProtectedRoute)
- **Utils**: Helper functions in `/src/utils/` (lazyImports, designSystem)
- Premium loading states and error boundaries throughout

### Authentication & Protection
- Mock authentication system with localStorage persistence
- `ProtectedRoute` component wraps sensitive routes (checkout, profile)
- Password protection layer via `ComingSoon` component for demo access
- Auth state: `{ user, isAuthenticated, loading, login, logout, signup }`

## Development Workflows

### File Naming Conventions
- Use kebab-case for files: `auth-context.jsx`, `lazy-imports.js`
- Components use PascalCase: `ProductDetail.jsx`, `ProtectedRoute.jsx`
- Hooks use camelCase with `use` prefix: `useAuth.js`, `usePasswordProtection.js`

### Import Patterns
- Lazy loading via `React.lazy()` in `/src/utils/lazyImports.js`
- Preloading on hover for performance optimization
- Context imports: `import { AuthProvider } from "./contexts/auth-context"`
- Hook imports: `import { useAuth } from "./hooks/useAuth"`

### Animation Implementation
- GSAP for entrance animations and micro-interactions
- ScrollTrigger for scroll-based reveals and parallax effects
- Service worker cleanup via `/public/sw-cleanup.js` for development
- Consistent luxury timing and easing functions

## Critical Integration Points

### Stripe Integration
- Demo mode with test key: `pk_test_demo_key`
- `<Elements>` provider wraps cart functionality
- Checkout flow protected by authentication

### Router Structure
- Nested routes: `/shop/:category`, `/product/:id`
- Protected routes wrapped in `<ProtectedRoute>`
- ScrollToTop component for navigation UX

### State Persistence
- Auth state via localStorage with key `dupp_user`
- Cart state persistence (via CartContext)
- Error handling with düpp-branded console logs

## Debugging & Development

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run clean        # Clean cache and dependencies
```

### Performance Optimization
- Lazy imports for route-based code splitting
- Hover-based preloading for critical routes
- Service worker cleanup for development issues
- Error fallback components for failed lazy loads

## Design System Patterns

- **Colors**: Custom Tailwind config with luxury gradients
- **Typography**: Inter font family with Chillax for brand elements
- **Animations**: Professional GSAP-based with accessibility considerations
- **Components**: Consistent luxury aesthetic with smooth transitions
- **Responsive**: Mobile-first approach with Tailwind breakpoints

## Common Patterns to Follow

1. **Context + Hook Pattern**: Create context, export provider, consume via custom hook
2. **Lazy Loading**: Use `lazyImports.js` for route components, implement preloading
3. **Error Boundaries**: Include fallback components for failed imports
4. **Protected Routes**: Wrap sensitive components with `ProtectedRoute`
5. **Loading States**: Implement luxury loading animations for async operations
