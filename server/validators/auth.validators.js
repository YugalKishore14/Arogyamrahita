const { body } = require("express-validator");

// Email regex to disallow emojis and limit to common ASCII email format
const strictEmailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

exports.validateRegister = [
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    body("email")
        .trim()
        .matches(strictEmailRegex)
        .withMessage("Please provide a valid email address"),
    body("number")
        .trim()
        .matches(/^\d{10}$/)
        .withMessage("Phone number must be exactly 10 digits"),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[a-z]/)
        .withMessage("Password must include at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must include at least one uppercase letter")
        .matches(/\d/)
        .withMessage("Password must include at least one number")
        .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
        .withMessage("Password must include at least one special character"),
];

exports.validateLogin = [
    body("email")
        .trim()
        .matches(strictEmailRegex)
        .withMessage("Please provide a valid email address"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
];