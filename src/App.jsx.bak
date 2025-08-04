import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { FirestoreProvider } from "./contexts/FirestoreContext";
import { usePasswordProtection } from "./hooks/usePasswordProtection";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminAccess from "./components/AdminAccess";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import "./index.css";

// Lazy load pages for better code splitting
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Impact = lazy(() => import("./pages/Impact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Cookie = lazy(() => import("./pages/Cookie"));
const CookiePreferences = lazy(() => import("./pages/CookiePreferences"));
const Terms = lazy(() => import("./pages/Terms"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const AuthenticationPage = lazy(() => import("./pages/AuthenticationPage"));
const Profile = lazy(() => import("./pages/Profile"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const DuppDocsHub = lazy(() => import("./pages/DuppDocsHub"));

// Initialize Stripe (use environment variable)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Loading component for lazy loaded routes
const PageLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal mx-auto mb-3"></div>
      <p
        className="text-charcoal/70 text-sm"
        style={{ fontFamily: "Chillax, sans-serif" }}
      >
        Loading...
      </p>
    </div>
  </div>
);

// Layout component to conditionally show/hide navbar and footer
function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = ["/auth", "/login", "/signup"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const isDocsHub = location.pathname === "/düppdoc";
  const isHomePage = location.pathname === "/";
  const hasInlineFooter =
    ["/about", "/contact", "/shop"].includes(location.pathname) ||
    location.pathname.startsWith("/shop/");

  return (
    <div className="min-h-screen bg-white">
      {!isAuthPage && !isAdminPage && !isDocsHub && <Navbar />}
      <main>{children}</main>
      {!isAuthPage &&
        !isAdminPage &&
        !isHomePage &&
        !hasInlineFooter &&
        !isDocsHub && <Footer />}
      {!isAdminPage && !isDocsHub && <AdminAccess />}
    </div>
  );
}

function App() {
  const { hasAccess, isLoading, grantAccess } = usePasswordProtection();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p style={{ fontFamily: "Chillax, sans-serif" }}>Loading düpp...</p>
        </div>
      </div>
    );
  }

  // Show Coming Soon page if no access
  if (!hasAccess) {
    return (
      <Suspense fallback={<PageLoader />}>
        <ComingSoon onPasswordSubmit={grantAccess} />
      </Suspense>
    );
  }

  // Show main app if access granted
  return (
    <AuthProvider>
      <FirestoreProvider>
        <Elements stripe={stripePromise}>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:category" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-confirmation"
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/impact" element={<Impact />} />
                    <Route path="/our-values" element={<Impact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/cookie" element={<Cookie />} />
                    <Route
                      path="/cookie-preferences"
                      element={<CookiePreferences />}
                    />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/accessibility" element={<Accessibility />} />
                    <Route path="/auth" element={<AuthenticationPage />} />
                    <Route path="/login" element={<AuthenticationPage />} />
                    <Route path="/signup" element={<AuthenticationPage />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Documentation Hub */}
                    <Route path="/düppdoc" element={<DuppDocsHub />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route
                      path="/admin/dashboard/*"
                      element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </Layout>
            </Router>
          </CartProvider>
        </Elements>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
