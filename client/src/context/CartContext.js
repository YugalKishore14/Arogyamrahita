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
                const items = response.cart.items
                    .filter(item => item.product)
                    .map(item => ({
                        _id: item.product._id,
                        name: item.product.name,
                        newPrice: item.price,
                        oldPrice: item.product.oldPrice || item.price,
                        image: item.product.image,
                        category: item.product.category,
                        quantity: item.quantity,
                        weight: item.product.weight,
                        weightUnit: item.product.weightUnit
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


    useEffect(() => {
        setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
        if (!isAuthenticated()) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated]);

    const addToCart = async (product, quantity = 1) => {
        // Compose a unique key for product+variant (use all relevant variant properties)
        let variantKey = product._id;
        if (product.selectedVariant) {
            if (product.selectedVariant.sku) {
                variantKey += `_${product.selectedVariant.sku}`;
            } else {
                variantKey += `_${product.selectedVariant.name || ''}_${product.selectedVariant.weight || ''}_${product.selectedVariant.weightUnit || ''}`;
            }
        }
        if (isAuthenticated()) {
            try {
                // Send variant info to backend if present
                const response = await cartAPI.addToCart(product._id, quantity, product.selectedVariant || null);
                if (response.cart && response.cart.items) {
                    const items = response.cart.items.map(item => ({
                        _id: item.product._id,
                        name: item.product.name,
                        newPrice: item.price,
                        oldPrice: item.product.oldPrice || item.price,
                        image: item.product.image,
                        category: item.product.category,
                        quantity: item.quantity,
                        weight: item.product.weight,
                        weightUnit: item.product.weightUnit,
                        variant: item.variant || null // If backend supports
                    }));
                    setCartItems(items);
                    setCartCount(items.reduce((total, item) => total + item.quantity, 0));
                }
            } catch (error) {
                console.error('Error adding to cart in database:', error);
                updateLocalCart(product, quantity, variantKey);
            }
        } else {
            updateLocalCart(product, quantity, variantKey);
        }
    };

    const updateLocalCart = (product, quantity, variantKey) => {
        setCartItems(prevItems => {
            // Find by product id and variant (if any)
            const existingItem = prevItems.find(item => {
                if (item._id !== product._id) return false;
                if (product.selectedVariant) {
                    return item.variant && item.variant.name === product.selectedVariant.name;
                }
                return !item.variant;
            });

            if (existingItem) {
                return prevItems.map(item =>
                    item._id === product._id && (
                        (!product.selectedVariant && !item.variant) ||
                        (product.selectedVariant && item.variant && item.variant.name === product.selectedVariant.name)
                    )
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [
                    ...prevItems,
                    {
                        ...product,
                        quantity,
                        variant: product.selectedVariant || null
                    }
                ];
            }
        });
    };

    // Remove by productId and optionally variant (for unique variant delete)
    const removeFromCart = async (productId, variant = null) => {
        const matchFn = (item) => {
            if (item._id !== productId) return true;
            if (variant) {
                // Match by variant name (or sku if available)
                if (item.variant && variant.name && item.variant.name === variant.name) return false;
                if (item.variant && variant.sku && item.variant.sku === variant.sku) return false;
                // If both have no variant, treat as same
                if (!item.variant && !variant) return false;
                return true;
            }
            // If no variant provided, remove all with productId
            return false;
        };
        if (isAuthenticated()) {
            try {
                // Backend API may need to support variant removal, else fallback to local
                await cartAPI.removeFromCart(productId, variant);
                setCartItems(prevItems => prevItems.filter(matchFn));
                setCartCount(prevCount => {
                    const item = cartItems.find(item => item._id === productId && (!variant || (item.variant && item.variant.name === variant.name)));
                    return prevCount - (item ? item.quantity : 0);
                });
            } catch (error) {
                console.error('Error removing from cart in database:', error);
                setCartItems(prevItems => prevItems.filter(matchFn));
            }
        } else {
            setCartItems(prevItems => prevItems.filter(matchFn));
        }
    };

    // Update quantity by productId and variant (for unique variant update)
    const updateQuantity = async (productId, quantity, variant = null) => {
        if (quantity <= 0) {
            removeFromCart(productId, variant);
            return;
        }

        const matchFn = (item) => {
            if (item._id !== productId) return false;
            if (variant) {
                if (item.variant && variant.name && item.variant.name === variant.name) return true;
                if (item.variant && variant.sku && item.variant.sku === variant.sku) return true;
                if (!item.variant && !variant) return true;
                return false;
            }
            return true;
        };

        if (isAuthenticated()) {
            try {
                await cartAPI.updateCartItem(productId, quantity, variant);
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        matchFn(item) ? { ...item, quantity } : item
                    )
                );
                setCartCount(cartItems.reduce((total, item) => total + item.quantity, 0));
            } catch (error) {
                console.error('Error updating cart in database:', error);
                setCartItems(prevItems =>
                    prevItems.map(item =>
                        matchFn(item) ? { ...item, quantity } : item
                    )
                );
            }
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    matchFn(item) ? { ...item, quantity } : item
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
        return cartItems.reduce((total, item) => {
            const price = item.variant && item.variant.newPrice !== undefined ? item.variant.newPrice : item.newPrice;
            return total + (price * item.quantity);
        }, 0);
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
