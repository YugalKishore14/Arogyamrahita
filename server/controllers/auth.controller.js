// controllers/auth.controller.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Otp = require("../models/otp.model");
const { sendEmail } = require("../services/email.service");
const { sendOTP } = require("../services/sms.service");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

const generateTokens = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
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

        // find user once and reuse the variable (avoid duplicate declarations)
        let user = await User.findOne({
            email: email.toLowerCase().trim(),
            isActive: true,
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.create({
            email: email.toLowerCase().trim(),
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            used: false,
            resend: false,
        });

        // Send OTP via SMS (best-effort)
        try {
            if (user.number) {
                await sendOTP(user.number, otp);
            } else {
                console.warn("User has no phone number set; skipping SMS send.");
            }
        } catch (e) {
            console.warn("SMS send failed, proceeding for dev:", e.message || e);
        }

        const isProd = process.env.NODE_ENV === "production";
        return res.status(200).json({
            message: "OTP sent to your phone number",
            email,
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
        const record = await Otp.findOne({
            email: email.toLowerCase().trim(),
            otp,
            used: false,
        }).sort({ createdAt: -1 });
        if (!record) return res.status(400).json({ message: "Invalid OTP" });

        if (record.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        record.used = true;
        await record.save();

        user.lastLogin = new Date();
        const { accessToken, refreshToken } = generateTokens(user);

        // initialize refreshTokens array if missing
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

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newOtp = await Otp.create({
            email: normalizedEmail,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            used: false,
            resend: true,
            createdAt: new Date(),
        });

        try {
            if (user.number) {
                await sendOTP(user.number, otp);
            } else {
                console.warn("User has no phone number set; skipping SMS resend.");
            }
        } catch (e) {
            console.warn("SMS resend failed, proceeding for dev:", e.message || e);
        }

        const isProd = process.env.NODE_ENV === "production";
        return res.status(200).json({
            message: "New OTP sent to your phone number",
            email: normalizedEmail,
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

        res.json({ user: getUserData(user) });
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
            user: getUserData(user)
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error during profile update" });
    }
};
