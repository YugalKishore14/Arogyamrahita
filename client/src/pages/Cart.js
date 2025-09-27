import React, { useState } from "react";
import PaymentModal from "../components/PaymentModal";
import CheckoutStepper from "../components/CheckoutStepper";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaArrowLeft,
} from "react-icons/fa";
import styles from "../css/Cart.module.css";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const {
    cartItems,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    loading,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [updating, setUpdating] = useState({});
  const [showPayment, setShowPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ek click pe sirf ek hi increment/decrement hoga, ab variant bhi pass hoga
  const handleQuantityChange = async (productId, currentQuantity, change, variant = null) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    const updateKey = variant && variant.name ? `${productId}_${variant.name}` : productId;
    setUpdating((prev) => ({ ...prev, [updateKey]: true }));
    try {
      await updateQuantity(productId, newQuantity, variant);
    } catch (error) {
      console.error("Failed to update quantity", error);
    } finally {
      setUpdating((prev) => ({ ...prev, [updateKey]: false }));
    }
  };

  // Remove item by productId and variant (for unique variant delete)
  const handleRemoveItem = async (productId, variant = null) => {
    try {
      await removeFromCart(productId, variant);
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    setShowPayment(true);
    setOrderSuccess(false);
  };

  if (loading) {
    return (
      <motion.div
        className={styles.loadingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className={styles.spinner}></div>
        <p>Loading your cart...</p>
      </motion.div>
    );
  }

  if (cartCount === 0) {
    return (
      <motion.div
        className={styles.emptyCart}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <FaShoppingCart className={styles.emptyCartIcon} />
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <motion.button
          className={styles.continueShopping}
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Shopping
        </motion.button>
      </motion.div>
    );
  }

  const handleAddressSubmit = (address, onSuccess, onError) => {
    setShowPayment(false);
    navigate("/payment", {
      state: {
        address,
        cartItems,
        total: getCartTotal(),
      },
    });
    onSuccess && onSuccess();
  };

  let currentStep = 0;
  if (showPayment && !orderSuccess) currentStep = 1;
  if (orderSuccess) currentStep = 2;

  return (
    <>
      <CheckoutStepper currentStep={currentStep} />
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onPlaceOrder={handleAddressSubmit}
        cartItems={cartItems}
        total={getCartTotal()}
      />
      <motion.div
        className={styles.cartContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className={styles.cartHeader}>
          <motion.button
            className={styles.backButton}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Back
          </motion.button>
          <h1>Shopping Cart ({cartCount} items)</h1>
          <motion.button
            className={styles.clearCartButton}
            onClick={handleClearCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Cart
          </motion.button>
        </div>

        {/* Cart Items */}
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <AnimatePresence>
              {cartItems.map((item, idx) => {
                // Always generate a unique key for each cart item, including variant info if present
                let itemKey = item._id;
                if (item.variant) {
                  if (item.variant.sku) {
                    itemKey += `_${item.variant.sku}`;
                  } else {
                    // Use all variant properties for uniqueness
                    itemKey += `_${item.variant.name || ''}_${item.variant.weight || ''}_${item.variant.weightUnit || ''}`;
                  }
                }

                const price =
                  item.variant && item.variant.newPrice !== undefined
                    ? item.variant.newPrice
                    : item.newPrice;
                const oldPrice =
                  item.variant && item.variant.oldPrice !== undefined
                    ? item.variant.oldPrice
                    : item.oldPrice;
                const weight =
                  item.variant && item.variant.weight
                    ? item.variant.weight
                    : item.weight;
                const weightUnit =
                  item.variant && item.variant.weightUnit
                    ? item.variant.weightUnit
                    : item.weightUnit;

                return (
                  <motion.div
                    key={itemKey}
                    className={styles.cartItem}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={styles.itemImage}>
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className={styles.itemDetails}>
                      <h3>
                        {item.name}
                        {weight ? (
                          <span className={styles.itemWeight}>
                            {weight} {weightUnit || ""}
                          </span>
                        ) : null}
                      </h3>
                      <p className={styles.itemCategory}>{item.category}</p>
                      <div className={styles.itemPrice}>
                        <span className={styles.currentPrice}>₹{price}</span>
                        {oldPrice && oldPrice > price && (
                          <span className={styles.oldPrice}>₹{oldPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.quantityControls}>
                      {/* Quantity Controls */}
                      <div className={styles.itemQuantity}>
                        <motion.button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity, -1, item.variant)
                          }
                          disabled={updating[item.variant && item.variant.name ? `${item._id}_${item.variant.name}` : item._id]}
                          className={styles.quantityBtn}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaMinus />
                        </motion.button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <motion.button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity, +1, item.variant)
                          }
                          disabled={updating[item.variant && item.variant.name ? `${item._id}_${item.variant.name}` : item._id]}
                          className={styles.quantityBtn}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaPlus />
                        </motion.button>
                      </div>

                      {/* Total Price */}
                      <div className={styles.itemTotal}>
                        <span>₹{price * item.quantity}</span>
                      </div>

                      {/* Remove Item */}
                      <motion.button
                        onClick={() => handleRemoveItem(item._id, item.variant)}
                        className={styles.removeButton}
                        title="Remove item"
                        whileHover={{ rotate: 15, scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Cart Summary */}
          <motion.div
            className={styles.cartSummary}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal ({cartCount} items):</span>
              <span>₹{getCartTotal()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delhivery:</span>
              <span>Free</span>
            </div>
            <hr />
            <div className={styles.summaryRow}>
              <strong>Total:</strong>
              <strong>₹{getCartTotal()}</strong>
            </div>

            <motion.button
              className={styles.checkoutButton}
              onClick={handleCheckout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Proceed to Checkout
            </motion.button>

            <motion.button
              className={styles.continueShopping}
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Cart;
