const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");
const User = require("../models/User");
const Order = require("../models/Order");

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshTokens");
        const now = Date.now();
        const withPresence = users.map((u) => {
            const lastSeen = u.lastSeen ? new Date(u.lastSeen).getTime() : 0;
            const online = lastSeen && now - lastSeen <= 2 * 60 * 1000;
            return {
                id: u._id,
                name: u.name,
                email: u.email,
                number: u.number,
                role: u.role,
                isVerified: u.isVerified,
                isActive: u.isActive,
                lastLogin: u.lastLogin,
                lastSeen: u.lastSeen,
                online,
                createdAt: u.createdAt,
            };
        });
        res.json(withPresence);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

// List orders for admin
router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email number phone")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
