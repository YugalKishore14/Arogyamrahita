const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");
const {
    createOrder,
    getMyOrders,
    listOrders,
    updateOrderStatus,
} = require("../controllers/order.controller");

// User routes
router.post("/", verifyToken, createOrder);
router.get("/my", verifyToken, getMyOrders);

// Admin routes
router.get("/", verifyToken, verifyAdmin, listOrders);
router.put("/:orderId/status", verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;


