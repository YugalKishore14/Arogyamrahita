const { body } = require("express-validator");

exports.validateRegister = [
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("number")
        .trim()
        .isLength({ min: 7, max: 15 })
        .withMessage("Please provide a valid phone number"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

exports.validateLogin = [
    body("number")
        .trim()
        .isLength({ min: 7, max: 15 })
        .withMessage("Please provide a valid phone number"),
    body("password").notEmpty().withMessage("Password cannot be empty"),
];