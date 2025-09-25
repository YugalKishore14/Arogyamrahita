const Order = require("../models/Order");
const User = require("../models/User");
const { sendEmail } = require("../services/email.service");
const { sendSMS } = require("../services/sms.service");
const Product = require("../models/Product");
const { getNextInvoiceNumber } = require("../utils/getNextInvoiceNumber");

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, totalAmount, shippingAddress, paymentInfo } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items are required" });
        }

        // Fetch product names and variant info for each item
        const itemsWithNames = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) throw new Error(`Product not found: ${item.product}`);
                let variant = null;
                if (item.variant && Array.isArray(product.variants)) {
                    // Try to find the matching variant by name, weight, and weightUnit
                    variant = product.variants.find(
                        (v) =>
                            v.name === item.variant.name &&
                            Number(v.weight) === Number(item.variant.weight) &&
                            v.weightUnit === item.variant.weightUnit
                    );
                }
                return {
                    ...item,
                    name: product.name,
                    price: item.price || product.newPrice,
                    image: item.image || product.image,
                    variant: variant
                        ? {
                            name: variant.name,
                            weight: variant.weight,
                            weightUnit: variant.weightUnit,
                        }
                        : undefined,
                };
            })
        );

        // 👇 Yahan se invoice number generate hoga
        const invoiceNumber = await getNextInvoiceNumber();

        const order = await Order.create({
            user: userId,
            items: itemsWithNames,
            totalAmount,
            shippingAddress,
            paymentInfo,
            invoiceNumber, // 👈 add kiya
            status: "PLACED",
        });

        // Send order confirmation email to user
        try {
            const user = await User.findById(userId);
            if (user && user.email) {
                const productList = itemsWithNames
                    .map((item) => `<li>${item.name} x ${item.quantity}</li>`)
                    .join("");
                const emailHtml = `
                    <p>Dear ${user.name || "Customer"},</p>
                    <p>Thank you for your order #${order._id}.</p>
                    <p><b>Order Details:</b></p>
                    <ul>${productList}</ul>
                    <p>Total Amount: ₹${order.totalAmount}</p>
                    <p>We will notify you when your order is ready for delivery.</p>
                    <p>— Arogya Rahita</p>
                `;
                await sendEmail(user.email, "Order Confirmation", emailHtml);
            }
        } catch (e) {
            console.warn("Order confirmation email failed:", e.message || e);
        }
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
                         <p>Your order #${order._id
                        } is ready for delivery. We will update you with tracking soon.</p>
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
