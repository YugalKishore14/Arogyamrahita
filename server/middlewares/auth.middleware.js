const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access token is required",
                code: "NO_TOKEN",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || !user.isActive) {
            return res.status(401).json({
                message: "User not found or inactive",
                code: "USER_NOT_FOUND",
            });
        }

        // Update presence on each authenticated request
        user.lastSeen = new Date();
        await user.save();

        req.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired",
                code: "TOKEN_EXPIRED",
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token",
                code: "INVALID_TOKEN",
            });
        } else {
            console.error("Token verification error:", error);
            return res.status(500).json({
                message: "Token verification failed",
                code: "VERIFICATION_ERROR",
            });
        }
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Admin access required",
            code: "ADMIN_REQUIRED",
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Admin access required",
            code: "ADMIN_REQUIRED",
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdmin,
    isAdmin,
};