const Category = require("../models/Category");

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const category = new Category({
            name,
            description,
            image,
            createdBy: req.user.id
        });

        const savedCategory = await category.save();
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: savedCategory
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error.message
        });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching category",
            error: error.message
        });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, image, isActive } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                image,
                isActive
            },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error: error.message
        });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: error.message
        });
    }
};

// Get admin categories (including inactive ones)
exports.getAdminCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
};
