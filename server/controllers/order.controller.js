const Order = require("../models/Order");
const User = require("../models/User");
const { sendEmail } = require("../services/email.service");
const { sendSMS } = require("../services/sms.service");

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, totalAmount, shippingAddress, paymentInfo } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items are required" });
        }

        const order = await Order.create({
            user: userId,
            items,
            totalAmount,
            shippingAddress,
            paymentInfo,
            status: "PLACED",
        });

        res.status(201).json({ message: "Order placed", order });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get orders for current user
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Get My Orders Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin: list all orders
exports.listOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email number phone")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("List Orders Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const allowed = [
            "PLACED",
            "PAID",
            "READY_FOR_DELIVERY",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate("user", "name email number phone");

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Notify user when ready for delivery
        if (status === "READY_FOR_DELIVERY" && order.user) {
            try {
                if (order.user.email) {
                    await sendEmail(
                        order.user.email,
                        "Your order is ready for delivery",
                        `<p>Dear ${order.user.name || "Customer"},</p>
                         <p>Your order #${order._id} is ready for delivery. We will update you with tracking soon.</p>
                         <p>— Arogya Rahita</p>`
                    );
                }
            } catch (e) {
                console.warn("Order email notify failed:", e.message || e);
            }

            try {
                const phone = order.user.phone || order.user.number;
                if (phone) {
                    await sendSMS(
                        phone,
                        `Your order ${order._id} is ready for delivery. Thank you for shopping with us!`
                    );
                }
            } catch (e) {
                console.warn("Order SMS notify failed:", e.message || e);
            }
        }

        res.json({ message: "Order updated", order });
    } catch (error) {
        console.error("Update Order Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


