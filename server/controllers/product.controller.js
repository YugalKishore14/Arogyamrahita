const Product = require("../models/Product");
const imageService = require("../services/image.service");

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, image, oldPrice, newPrice, category, stock } = req.body;

        // Use Cloudinary URL directly (already complete URL)
        let imageUrl = image;

        const product = new Product({
            name,
            description,
            image: imageUrl,
            oldPrice,
            newPrice,
            category,
            stock,
            createdBy: req.user.id
        });

        const savedProduct = await product.save();
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: savedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message
        });
    }
};

// Get all products (optionally filtered by category or search query)
exports.getAllProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, image, oldPrice, newPrice, category, stock, isActive } = req.body;

        // Use Cloudinary URL directly (already complete URL)
        let imageUrl = image;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                image: imageUrl,
                oldPrice,
                newPrice,
                category,
                stock,
                isActive
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating product",
            error: error.message
        });
    }
};

// Delete product (permanent delete with image cleanup)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let imageDeleted = false;
        if (product.image) {
            try {
                // Extract filename from full URL or relative path
                // Examples:
                // - https://arogyamrahita.onrender.com/uploads/filename.png -> filename.png
                const uploadsIndex = product.image.indexOf("/uploads/");
                if (uploadsIndex !== -1) {
                    const filename = product.image.substring(uploadsIndex + "/uploads/".length);
                    imageDeleted = imageService.deleteImage(filename);
                }
            } catch (e) {
                // Non-fatal: proceed even if image deletion fails
                imageDeleted = false;
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product permanently deleted",
            imageDeleted
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message
        });
    }
};

// Get admin products (including inactive ones)
exports.getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
};

// Get all unique categories
exports.getCategories = async (req, res) => {
    try {
        const Category = require("../models/Category");
        const categories = await Category.find({ isActive: true }).select('name').sort({ name: 1 });
        const categoryNames = categories.map(cat => cat.name);
        res.status(200).json({
            success: true,
            categories: categoryNames
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
};
