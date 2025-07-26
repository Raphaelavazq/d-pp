# düpp - Premium E-Commerce Web Experience

A high-performance, production-ready e-commerce website for "düpp," a brand focused on stylish and affordable designer dupes. The site features stunning visuals, immersive animations, and showcases expert-level frontend development using modern tooling.

## 🚀 Features

- **Award-level User Experience**: Inspired by Awwwards and CSSDA winners
- **Advanced Animations**: GSAP + ScrollTrigger for scroll-based storytelling
- **Responsive Design**: Mobile-first approach with polished UI
- **Shopping Cart**: Real-time updates with persistent storage
- **Product Filtering**: Advanced filters for price, style, and categories
- **Stripe Integration**: Demo checkout with payment processing
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠 Tech Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **GSAP + ScrollTrigger** - Professional animations and scroll effects
- **React Router** - Client-side routing
- **Stripe** - Payment processing (demo mode)
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation with sticky behavior
│   ├── Footer.jsx      # Site footer with links
│   ├── CartDrawer.jsx  # Sliding cart sidebar
│   └── ProductCard.jsx # Product display component
├── pages/              # Main page components
│   ├── Home.jsx        # Landing page with hero section
│   ├── Shop.jsx        # Product listing with filters
│   ├── ProductDetail.jsx # Individual product pages
│   ├── Cart.jsx        # Shopping cart page
│   ├── Checkout.jsx    # Checkout process
│   ├── About.jsx       # About page
│   └── Contact.jsx     # Contact form
├── context/            # React Context providers
│   └── CartContext.jsx # Global cart state management
├── data/               # Mock data and constants
│   └── products.js     # Product catalog and categories
├── hooks/              # Custom React hooks (ready for expansion)
├── utils/              # Utility functions (ready for expansion)
└── assets/             # Static assets
```

## 🎨 Design System

- **Colors**: Custom primary/secondary palette with extensive shade variations
- **Typography**: Inter font family for modern, clean aesthetics
- **Animations**: Consistent timing and easing with GSAP
- **Components**: Modular, accessible, and reusable

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🎯 Key Features Implemented

### Homepage

- Animated hero section with gradient overlays
- Feature cards with scroll-triggered animations
- Category grid with hover effects
- Featured products showcase

### Shop Page

- Advanced filtering (price, color, size, category)
- Multiple view modes (grid/list)
- Sorting options (price, rating, newest, featured)
- Responsive product grid

### Product Detail

- Image gallery with hover previews
- Size and color selection
- Quantity controls
- Add to cart functionality
- Product information and features

### Shopping Cart

- Persistent cart storage
- Quantity updates
- Price calculations
- Shipping threshold indicators

### Checkout

- Multi-step form
- Address validation
- Payment method selection
- Order summary
- Demo payment processing

## 🎨 Animations & Interactions

- **GSAP Timeline Animations**: Coordinated entrance effects
- **ScrollTrigger**: Reveal animations on scroll
- **Hover Effects**: Smooth transitions and micro-interactions
- **Page Transitions**: Seamless navigation experience
- **Mobile Optimized**: Touch-friendly interactions

## 🔧 Development Notes

- Built with modern React patterns (hooks, context, functional components)
- Tailwind CSS for rapid, consistent styling
- GSAP for professional-grade animations
- Modular component architecture for maintainability
- Mock data structure ready for real API integration

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-optimized navigation and interactions
- Optimized images and performance

## 🚀 Deployment Ready

The project is configured for easy deployment to:

- Vercel (recommended)
- Netlify
- Any static hosting service

## 📄 License

This project is created for educational and portfolio purposes.

---

**düpp** - Luxury dupes, accessible style. ✨+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
