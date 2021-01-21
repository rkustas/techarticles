// Validate data coming from frontend
const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("cf_password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom(async (cf_password, { req }) => {
      const password = req.body.password;

      // If password and confirm password not same
      // don't allow to sign up and throw error
      if (password !== cf_password) {
        throw new Error("Passwords must be same");
      }
    }),
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
