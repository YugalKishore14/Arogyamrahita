import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Fotter from "./components/Fotter";

import Login from "./pages/Login";
import Signup from "./pages/Singup";
import Dashboard from "./Admin/Dashboard";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Services from "./pages/Services";
import TermCondition from "./pages/TermCondition";
import Faq from "./pages/Faq";
import ReturnRefund from "./pages/ReturnRefund";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return isAdmin() ? children : <Navigate to="/" replace />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-layout">
          <ScrollToTop />
          <Header />

          <main className="app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/privacy" element={<Services />} />
              <Route path="/termCondition" element={<TermCondition />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/returnRefund" element={<ReturnRefund />} />

            </Routes>
          </main>

          <Fotter />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
