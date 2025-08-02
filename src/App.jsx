import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FirestoreProvider } from "./contexts/FirestoreContext";
import { usePasswordProtection } from "./hooks/usePasswordProtection";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminAccess from "./components/AdminAccess";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ComingSoon from "./pages/ComingSoon";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Impact from "./pages/Impact";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Cookie from "./pages/Cookie";
import CookiePreferences from "./pages/CookiePreferences";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";
import AuthenticationPage from "./pages/AuthenticationPage";
import Profile from "./pages/Profile";
import OrderConfirmation from "./pages/OrderConfirmation";
import "./index.css";

// Initialize Stripe (use test key for demo)
const stripePromise = loadStripe("pk_test_demo_key");

// Layout component to conditionally show/hide navbar and footer
function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = ["/auth", "/login", "/signup"].includes(location.pathname);
  const isHomePage = location.pathname === "/";
  const hasInlineFooter =
    ["/about", "/contact", "/shop"].includes(location.pathname) ||
    location.pathname.startsWith("/shop/");

  return (
    <div className="min-h-screen bg-white">
      {!isAuthPage && <Navbar />}
      <main>{children}</main>
      {!isAuthPage && !isHomePage && !hasInlineFooter && <Footer />}
      <AdminAccess />
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
    return <ComingSoon onPasswordSubmit={grantAccess} />;
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
                </Routes>
              </Layout>
            </Router>
          </CartProvider>
        </Elements>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
