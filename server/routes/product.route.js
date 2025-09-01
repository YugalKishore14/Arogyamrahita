const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const imageService = require("../services/image.service");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/categories", productController.getCategories);
router.get("/:id", productController.getProductById);

// Protected admin routes
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.isAdmin);

// Route for image upload
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

router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/admin/all", productController.getAdminProducts);

module.exports = router;
