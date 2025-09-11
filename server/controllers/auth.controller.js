// controllers/auth.controller.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Otp = require("../models/otp.model");
const { sendEmail } = require("../services/email.service");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || ""; // optional, used for reset link

const generateTokens = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
        expiresIn: "30d",
    });

    return { accessToken, refreshToken };
};

const getUserData = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
});

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error) => {
                switch (error.path) {
                    case "name":
                        return "Name must be at least 2 characters long";
                    case "email":
                        return "Please provide a valid email address";
                    case "password":
                        return "Password must be at least 6 characters long";
                    default:
                        return error.msg;
                }
            });
            return res
                .status(400)
                .json({ message: errorMessages[0], errors: errorMessages });
        }

        const { name, email, number, password } = req.body;

        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ message: "Name, email and password are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this email already exists" });
        }

        const user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            number: number ? String(number).trim() : "",
            password,
            isVerified: true,
            isActive: true,
        });

        await user.save();

        res.status(201).json({
            message: "Account created successfully! You can now log in.",
            email: user.email,
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: "Validation failed", errors: errors.array() });
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        let user = await User.findOne({
            email: email.toLowerCase().trim(),
            isActive: true,
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({
            email: user.email,
            otp,
            // login OTP valid for 2 minutes
            expiresAt: new Date(Date.now() + 2 * 60 * 1000),
            used: false,
            resend: false,
        });

        // Send OTP via Email (best-effort)
        try {
            if (user.email) {
                await sendEmail(
                    user.email,
                    "Your OTP Code",
                    `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
                        <p>Dear ${user.name || "User"},</p>
                        <p>Your One-Time Password (OTP) is:</p>
                        <h2 style="margin:8px 0 16px;">${otp}</h2>
                        <p>This code is valid for 2 minutes. Do not share it with anyone.</p>
                        <p>— Arogya Rahita</p>
                    </div>`
                );
            }
        } catch (e) {
            console.warn("Email send failed, proceeding:", e.message || e);
        }

        const isProd = process.env.NODE_ENV === "production";
        return res.status(200).json({
            message: "OTP sent to your email",
            email: user.email,
            otp: isProd ? undefined : otp,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const record = await Otp.findOne({
            email: user.email,
            otp,
            used: false,
        }).sort({ createdAt: -1 });
        if (!record) return res.status(400).json({ message: "Invalid OTP" });

        if (record.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        record.used = true;
        await record.save();

        user.lastLogin = new Date();
        const { accessToken, refreshToken } = generateTokens(user);

        if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
        user.refreshTokens.push({ token: refreshToken });
        if (user.refreshTokens.length > 5) {
            user.refreshTokens = user.refreshTokens.slice(-5);
        }

        await user.save();

        return res.status(200).json({
            message: "OTP verified successfully",
            token: accessToken,
            refreshToken,
            user: getUserData(user),
        });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "Server error during OTP verification" });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newOtp = await Otp.create({
            email: user.email,
            otp,
            // resend OTP valid for 5 minutes (as the email states)
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            used: false,
            resend: true,
            createdAt: new Date(),
        });

        // Resend OTP via Email (best-effort)
        try {
            if (user.email) {
                await sendEmail(
                    user.email,
                    "Your OTP Code",
                    `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
                        <p>Dear ${user.name || "User"},</p>
                        <p>Your new One-Time Password (OTP) is:</p>
                        <h2 style="margin:8px 0 16px;">${otp}</h2>
                        <p>This code is valid for 5 minutes. Do not share it with anyone.</p>
                        <p>— Arogya Rahita</p>
                    </div>`
                );
            }
        } catch (e) {
            console.warn("Email resend failed, proceeding:", e.message || e);
        }

        const isProd = process.env.NODE_ENV === "production";
        return res.status(200).json({
            message: "New OTP sent to your email",
            email: user.email,
            otpId: newOtp._id,
            otp: isProd ? undefined : otp,
        });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return res
            .status(500)
            .json({ message: "Server error while resending OTP" });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(401).json({ message: "Refresh token is required" });

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        } catch (e) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive)
            return res.status(401).json({ message: "Invalid refresh token" });

        const tokenExists = Array.isArray(user.refreshTokens) && user.refreshTokens.some(
            (t) => t.token === refreshToken
        );
        if (!tokenExists)
            return res.status(401).json({ message: "Refresh token not found" });

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        user.refreshTokens = user.refreshTokens.filter(
            (t) => t.token !== refreshToken
        );
        user.refreshTokens.push({ token: newRefreshToken });
        await user.save();

        res.json({
            message: "Tokens refreshed successfully",
            token: accessToken,
            refreshToken: newRefreshToken,
            user: getUserData(user),
        });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const userId = req.user && req.user.id;

        if (!userId) return res.status(400).json({ message: "User not authenticated" });

        if (refreshToken) {
            await User.findByIdAndUpdate(userId, {
                $pull: { refreshTokens: { token: refreshToken } },
            });
        } else {
            await User.findByIdAndUpdate(userId, {
                $set: { refreshTokens: [] },
            });
        }

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error during logout" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user && req.user.id;
        if (!userId) return res.status(400).json({ message: "User not authenticated" });

        const user = await User.findById(userId);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                phone: user.phone || user.number || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
                role: user.role,
                lastLogin: user.lastLogin,
            },
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, address, city, state, pincode } = req.body;
        const userId = req.user && req.user.id;
        if (!userId) return res.status(400).json({ message: "User not authenticated" });

        const user = await User.findById(userId);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user profile
        user.name = name || user.name;
        // keep both phone & number compatibility
        user.phone = phone || user.phone || user.number || "";
        user.address = address || user.address;
        user.city = city || user.city;
        user.state = state || user.state;
        user.pincode = pincode || user.pincode;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                number: user.number,
                phone: user.phone || user.number || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                pincode: user.pincode || "",
                role: user.role,
                lastLogin: user.lastLogin,
            },
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error during profile update" });
    }
};

/**
 * Forgot password handler
 * Replaces the incorrect `exports.router.post('/forgot-password', ...)`
 * Creates a reset token (uses user.generatePasswordResetToken if available,
 * otherwise creates one via crypto) and sends an email with a reset link.
 */
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            // avoid revealing whether email exists? your earlier code returned 404 - keep the same behavior
            return res.status(404).json({ message: "User not found" });
        }

        // Try using model helper if available, else generate token here
        let token;
        if (typeof user.generatePasswordResetToken === "function") {
            token = await user.generatePasswordResetToken();
            // If generatePasswordResetToken sets fields and saves, ensure token variable is set
            // If it doesn't return the token, attempt to read from user.resetPasswordToken
            if (!token && user.resetPasswordToken) token = user.resetPasswordToken;
        } else {
            token = crypto.randomBytes(20).toString("hex");
            user.resetPasswordToken = token;
            // 1 hour expiry
            user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
            await user.save();
        }

        // Build reset URL - try to use FRONTEND_URL or origin header
        const origin = req.headers && req.headers.origin ? req.headers.origin : FRONTEND_URL;
        const resetUrl = origin
            ? `${origin.replace(/\/$/, "")}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`
            : `Please use this token to reset your password: ${token}`;

        // Send email with reset link (best-effort)
        const emailHtml = origin
            ? `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
                    <p>Dear ${user.name || "User"},</p>
                    <p>We received a request to reset your password. Click the link below to reset it:</p>
                    <p><a href="${resetUrl}">Reset your password</a></p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>— Arogya Rahita</p>
               </div>`
            : `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">
                    <p>Dear ${user.name || "User"},</p>
                    <p>We received a request to reset your password. Use this token to reset it:</p>
                    <pre style="padding:8px;background:#f5f5f5;border-radius:4px;">${token}</pre>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>This token will expire in 1 hour.</p>
                    <p>— Arogya Rahita</p>
               </div>`;

        try {
            await sendEmail(user.email, "Password reset request", emailHtml);
        } catch (e) {
            console.warn("Failed to send password reset email:", e.message || e);
            // don't fail the request because email failed to send; still return success (or you may want to return 500)
        }

        return res.json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
