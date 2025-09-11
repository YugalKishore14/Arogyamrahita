const express = require("express");
const router = express.Router();
const {
    register,
    login,
    verifyOtp,
    resendOtp,
    refreshToken,
    logout,
    getProfile,
    updateProfile,
    forgotPassword,
    resetPassword
} = require("../controllers/auth.controller");
const {
    validateRegister,
    validateLogin,
} = require("../validators/auth.validators");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/refresh-token", refreshToken);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;