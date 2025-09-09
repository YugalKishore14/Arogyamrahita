const mongoose = require("mongoose");

const discountHeroSchema = new mongoose.Schema(
    {
        image: {
            type: String, // Cloudinary URL
            required: true,
            trim: true,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        discountValue: {
            type: Number, // percentage like 70
            required: true,
            min: 0,
            max: 100,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("DiscountHero", discountHeroSchema);


