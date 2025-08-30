const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");
const User = require("../models/User");

// Admin get all users
router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshTokens");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
