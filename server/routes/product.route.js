const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const imageService = require("../services/image.service");

// Public routes
router.get("/", productController.getAllProducts);
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

        const imageUrl = imageService.getImageUrl(req.file.filename);
        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error uploading image",
            error: error.message
        });
    }
});

router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/admin/all", productController.getAdminProducts);

module.exports = router;
