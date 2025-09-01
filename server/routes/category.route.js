const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const imageService = require("../services/image.service");

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Protected admin routes
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.isAdmin);

// Route for category image upload
router.post("/upload-image", imageService.uploadImage, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        // Cloudinary returns the complete URL in req.file.path
        const imageUrl = req.file.path;
        res.status(200).json({
            success: true,
            message: "Image uploaded successfully to Cloudinary",
            imageUrl: imageUrl,
            publicId: req.file.filename
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error uploading image to Cloudinary",
            error: error.message
        });
    }
});

router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
router.get("/admin/all", categoryController.getAdminCategories);

module.exports = router;
