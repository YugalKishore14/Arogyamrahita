import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from '../css/Cart.module.css';

const Cart = () => {
    const { cartItems, cartCount, removeFromCart, updateQuantity, clearCart, getCartTotal, loading } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [updating, setUpdating] = useState({});

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdating(prev => ({ ...prev, [productId]: true }));
        try {
            await updateQuantity(productId, newQuantity);
        } catch (error) {
            toast.error('Failed to update quantity');
        } finally {
            setUpdating(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await removeFromCart(productId);
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await clearCart();
                toast.success('Cart cleared successfully');
            } catch (error) {
                toast.error('Failed to clear cart');
            }
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated()) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }
        toast.info('Checkout functionality coming soon!');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your cart...</p>
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <div className={styles.emptyCart}>
                <FaShoppingCart className={styles.emptyCartIcon} />
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <button
                    className={styles.continueShopping}
                    onClick={() => navigate('/products')}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            <div className={styles.cartHeader}>
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Back
                </button>
                <h1>Shopping Cart ({cartCount} items)</h1>
                <button
                    className={styles.clearCartButton}
                    onClick={handleClearCart}
                >
                    Clear Cart
                </button>
            </div>

            <div className={styles.cartContent}>
                <div className={styles.cartItems}>
                    {cartItems.map((item) => (
                        <div key={item._id} className={styles.cartItem}>
                            <div className={styles.itemImage}>
                                <img src={item.image} alt={item.name} />
                            </div>

                            <div className={styles.itemDetails}>
                                <h3>{item.name}</h3>
                                <p className={styles.itemCategory}>{item.category}</p>
                                <div className={styles.itemPrice}>
                                    <span className={styles.currentPrice}>₹{item.newPrice}</span>
                                    {item.oldPrice && item.oldPrice > item.newPrice && (
                                        <span className={styles.oldPrice}>₹{item.oldPrice}</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.itemQuantity}>
                                <button
                                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                    disabled={updating[item._id]}
                                    className={styles.quantityBtn}
                                >
                                    <FaMinus />
                                </button>
                                <span className={styles.quantity}>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                    disabled={updating[item._id]}
                                    className={styles.quantityBtn}
                                >
                                    <FaPlus />
                                </button>
                            </div>

                            <div className={styles.itemTotal}>
                                <span>₹{item.newPrice * item.quantity}</span>
                            </div>

                            <button
                                onClick={() => handleRemoveItem(item._id)}
                                className={styles.removeButton}
                                title="Remove item"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.cartSummary}>
                    <h3>Order Summary</h3>
                    <div className={styles.summaryRow}>
                        <span>Subtotal ({cartCount} items):</span>
                        <span>₹{getCartTotal()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Tax:</span>
                        <span>₹{Math.round(getCartTotal() * 0.18)}</span>
                    </div>
                    <hr />
                    <div className={styles.summaryRow}>
                        <strong>Total:</strong>
                        <strong>₹{getCartTotal() + Math.round(getCartTotal() * 0.18)}</strong>
                    </div>

                    <button
                        className={styles.checkoutButton}
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout
                    </button>

                    <button
                        className={styles.continueShopping}
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
