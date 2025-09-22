const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
        }

        res.json({ cart });
    } catch (error) {
        console.error("Get Cart Error:", error);
        res.status(500).json({ message: "Server error while fetching cart" });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, variant } = req.body;
        const userId = req.user.id;

        console.log("[addToCart] Request body:", req.body);
        console.log("[addToCart] User:", req.user);

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Find by product and variant (if any)
        const existingItem = cart.items.find(item => {
            if (item.product.toString() !== productId) return false;
            if (variant && item.variant && item.variant.name === variant.name) return true;
            if (!variant && !item.variant) return true;
            return false;
        });

        let priceToUse = product.newPrice;
        if (variant && variant.newPrice) priceToUse = variant.newPrice;

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: priceToUse,
                variant: variant || undefined
            });
        }

        await cart.save();
        await cart.populate('items.product');

        res.json({
            message: "Item added to cart successfully",
            cart
        });
    } catch (error) {
        console.error("Add to Cart Error:", error);
        // Add more detailed error output
        console.error("[addToCart] Error stack:", error.stack);
        res.status(500).json({ message: "Server error while adding to cart", error: error.message, stack: error.stack });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(item =>
            item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = quantity;
        await cart.save();

        await cart.populate('items.product');

        res.json({
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        console.error("Update Cart Error:", error);
        res.status(500).json({ message: "Server error while updating cart" });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item =>
            item.product.toString() !== productId
        );

        await cart.save();

        await cart.populate('items.product');

        res.json({
            message: "Item removed from cart successfully",
            cart
        });
    } catch (error) {
        console.error("Remove from Cart Error:", error);
        res.status(500).json({ message: "Server error while removing from cart" });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        res.json({
            message: "Cart cleared successfully",
            cart
        });
    } catch (error) {
        console.error("Clear Cart Error:", error);
        res.status(500).json({ message: "Server error while clearing cart" });
    }
};
