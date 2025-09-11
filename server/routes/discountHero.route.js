const express = require("express");
const router = express.Router();
const controller = require("../controllers/discountHero.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const imageService = require("../services/image.service");

router.get("/active", controller.getActive);

router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

router.get("/admin/all", controller.adminList);

router.post("/upload-image", imageService.uploadImage, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }
        res.status(200).json({
            success: true,
            message: "Image uploaded successfully to Cloudinary",
            imageUrl: req.file.path,
            publicId: req.file.filename,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;


