const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");
const {
    createOrder,
    getMyOrders,
    listOrders,
    updateOrderStatus,
} = require("../controllers/order.controller");

router.post("/", verifyToken, createOrder);
router.get("/my", verifyToken, getMyOrders);

router.get("/", verifyToken, verifyAdmin, listOrders);
router.put("/:orderId/status", verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;


