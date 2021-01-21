// Validate data coming from frontend
const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("cf_password")
    .equals("password")
    .withMessage("Confirmed password does not match"),
  check("categories")
    .isLength({ min: 6 })
    .withMessage("Please choose at least one category"),
];

exports.userLoginValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Forgot password validation
exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
];

// Reset password validator
exports.resetPasswordValidator = [
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("resetPasswordLink").not().isEmpty().withMessage("Token is required"),
];

exports.userUpdateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
];
