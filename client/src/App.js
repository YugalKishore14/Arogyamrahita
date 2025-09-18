import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Fotter from "./components/Fotter";
import Login from "./pages/Login";
import Signup from "./pages/Singup";
import Dashboard from "./Admin/Dashboard";
import DiscountHeroAdmin from "./Admin/DiscountHeroAdmin";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import PaymentPage from "./pages/PaymentPage";
import Services from "./pages/Services";
import TermCondition from "./pages/TermCondition";
import Faq from "./pages/Faq";
import ReturnRefund from "./pages/ReturnRefund";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import UserProfilePage from "./pages/UserProfilePage";
import { ordersAPI } from "./services/Api";
import "./App.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

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

function PaymentPageWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, cartItems, total } = location.state || {};
  const { clearCart } = useCart();

  const handlePayment = async (method) => {
    if (!address || !cartItems || !total) {
      navigate("/cart");
      return;
    }
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.newPrice,
          quantity: item.quantity,
          image: item.image || "",
        })),
        totalAmount: total,
        shippingAddress: {
          address: address.address,
          city: address.city,
          state: address.state || "",
          pincode: address.pincode,
          phone: address.phone,
        },
        paymentInfo: {
          method,
        },
      };
      await ordersAPI.create(orderData);
      await clearCart();
      navigate("/cart", { state: { orderSuccess: true } });
    } catch (err) {
      alert("Order failed. Try again.");
    }
  };

  return <PaymentPage onPayment={handlePayment} />;
}

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/discount-hero"
                element={
                  <AdminRoute>
                    <DiscountHeroAdmin />
                  </AdminRoute>
                }
              />

              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<PaymentPageWrapper />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfilePage />
                  </PrivateRoute>
                }
              />

              <Route path="/privacy" element={<Services />} />
              <Route path="/termCondition" element={<TermCondition />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/returnRefund" element={<ReturnRefund />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Fotter />
        </div>
        <ToastContainer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
