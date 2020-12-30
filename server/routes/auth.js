// Login and registration authorization
const express = require("express");

// Create router
const router = express.Router();

// Import from controllers
const {
  register,
  registerActivate,
  login,
  reqSignin,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

// Import Validators
const {
  userRegisterValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators/index");

// Cleaner way to organize code, refactor using controllers and validators
router.post("/register", userRegisterValidator, runValidation, register);
router.post("/register/activate", registerActivate);
router.post("/login", userLoginValidator, runValidation, login);
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

// router.get("/secret", reqSignin, (req, res) => {
//   res.json({
//     data: "This is a secret page for logged in users only",
//   });
// });

// Add router to modules.exports, by default all module exports are empty, we are adding the router property
module.exports = router;
