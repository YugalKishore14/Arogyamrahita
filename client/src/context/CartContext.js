import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/Api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const loadCartFromLocalStorage = useCallback(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
                setCartCount(parsedCart.reduce((total, item) => total + item.quantity, 0));
            } catch (error) {
                console.error('Error parsing cart from localStorage:', error);
            }
        }
    }, []);

    const loadCartFromDB = useCallback(async () => {
        try {
            setLoading(true);
            const response = await cartAPI.getCart();
            if (response.cart && response.cart.items) {
                const items = response.cart.items.map(item => ({
                    _id: item.product._id,
                    name: item.product.name,
                    newPrice: item.price,
                    oldPrice: item.product.oldPrice || item.price,
                    image: item.product.image,
                    category: item.product.category,
                    quantity: item.quantity
                }));
                setCartItems(items);
                setCartCount(items.reduce((total, item) => total + item.quantity, 0));
            }
        } catch (error) {
            console.error('Error loading cart from database:', error);
            loadCartFromLocalStorage();
        } finally {
            setLoading(false);
        }
    }, [loadCartFromLocalStorage]);

    useEffect(() => {
        if (isAuthenticated()) {
            loadCartFromDB();
        } else {
            loadCartFromLocalStorage();
        }
    }, [isAuthenticated, loadCartFromDB, loadCartFromLocalStorage]);


    // Always keep cartCount in sync with cartItems
    useEffect(() => {
        setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
        if (!isAuthenticated()) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated]);

    const addToCart = async (product, quantity = 1) => {
        if (isAuthenticated()) {
            try {
                const response = await cartAPI.addToCart(product._id, quantity);
                if (response.cart && response.cart.items) {
                    const items = response.cart.items.map(item => ({
                        _id: item.product._id,
                        name: item.product.name,
                        newPrice: item.price,
                        oldPrice: item.product.oldPrice || item.price,
                        image: item.product.image,
                        category: item.product.category,
                        quantity: item.quantity
                    }));
                    setCartItems(items);
                    setCartCount(items.reduce((total, item) => total + item.quantity, 0));
                }
            } catch (error) {
                console.error('Error adding to cart in database:', error);
                updateLocalCart(product, quantity);
            }
        } else {
            updateLocalCart(product, quantity);
        }
    };

    const updateLocalCart = (product, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);

            if (existingItem) {
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = async (productId) => {
        if (isAuthenticated()) {
            try {
                await cartAPI.removeFromCart(productId);
                setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
                setCartCount(prevCount => {
                    const item = cartItems.find(item => item._id === productId);
                    return prevCount - (item ? item.quantity : 0);
                });
            } catch (error) {
                console.error('Error removing from cart in database:', error);
                setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
            }
        } else {
            setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (isAuthenticated()) {
            try {
                await cartAPI.updateCartItem(productId, quantity);
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item._id === productId ? { ...item, quantity } : item
                    )
                );
                setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
            } catch (error) {
                console.error('Error updating cart in database:', error);
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item._id === productId ? { ...item, quantity } : item
                    )
                );
            }
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    const clearCart = async () => {
        if (isAuthenticated()) {
            try {
                await cartAPI.clearCart();
                setCartItems([]);
                setCartCount(0);
            } catch (error) {
                console.error('Error clearing cart in database:', error);
                setCartItems([]);
                setCartCount(0);
            }
        } else {
            setCartItems([]);
            setCartCount(0);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.newPrice * item.quantity), 0);
    };

    const value = {
        cartItems,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
