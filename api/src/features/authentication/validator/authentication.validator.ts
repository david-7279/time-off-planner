import {body} from "express-validator";

const emailNormalizeOptions = {
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    all_lowercase: true,
}

export const registerValidator = [
    body("name")
        .isString().withMessage("Name must be a string").bail()
        .trim()
        .notEmpty().withMessage("Name is required").bail()
        .isLength({min: 2, max: 80}).withMessage("Name must be between 2 and 80 characters"),

    body("email")
        .isString().withMessage("Email must be a string").bail()
        .trim()
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Invalid email format").bail()
        .normalizeEmail(emailNormalizeOptions),

    body("password")
        .isString().withMessage("Password must be a string").bail()
        .notEmpty().withMessage("Password is required").bail()
        .isLength({min: 8, max: 72}).withMessage("Password must be between 8 and 72 characters").bail()
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter").bail()
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter").bail()
        .matches(/[0-9]/).withMessage("Password must contain at least one number"),
]

export const loginValidator = [
    body("email")
        .isString().withMessage("Email must be a string").bail()
        .trim()
        .notEmpty().withMessage("Email is required").bail()
        .isEmail().withMessage("Invalid email format").bail()
        .normalizeEmail(emailNormalizeOptions),

    body("password")
        .isString().withMessage("Password must be a string").bail()
        .notEmpty().withMessage("Password is required").bail()
        .isLength({max: 72}).withMessage("Password is too long"),
]