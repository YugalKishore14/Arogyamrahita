const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, min: 1 },
                image: { type: String },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: [
                "PLACED",
                "PAID",
                "READY_FOR_DELIVERY",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PLACED",
        },
        shippingAddress: {
            address: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            phone: { type: String },
        },
        paymentInfo: {
            method: { type: String },
            transactionId: { type: String },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);


