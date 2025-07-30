import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FirestoreProvider } from "./contexts/FirestoreContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import "./index.css";

// Initialize Stripe (use test key for demo)
const stripePromise = loadStripe("pk_test_demo_key");

function App() {
  return (
    <AuthProvider>
      <FirestoreProvider>
        <Elements stripe={stripePromise}>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <div className="min-h-screen bg-white">
                <Navbar />
                <main>
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </Elements>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
