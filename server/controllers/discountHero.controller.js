const DiscountHero = require("../models/DiscountHero");

exports.create = async (req, res) => {
    try {
        const { image, productName, discountValue, isActive } = req.body;
        const created = await DiscountHero.create({
            image,
            productName,
            discountValue,
            isActive,
            createdBy: req.user.id,
        });
        res.status(201).json({ success: true, data: created });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await DiscountHero.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await DiscountHero.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getActive = async (_req, res) => {
    try {
        const doc = await DiscountHero.findOne({ isActive: true }).sort({ updatedAt: -1 });
        if (!doc) return res.status(200).json({ success: true, data: null });
        res.json({ success: true, data: doc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.adminList = async (_req, res) => {
    try {
        const items = await DiscountHero.find().sort({ createdAt: -1 });
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


