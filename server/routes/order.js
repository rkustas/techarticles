// Login and registration authorization
const express = require("express");

// Create router
const router = express.Router();

// Import Validators
const { orderCreateValidator } = require("../validators/order");
const { runValidation } = require("../validators/index");

// Import from controllers
const { reqSignin, authMiddleware } = require("../controllers/auth");
const { create, list } = require("../controllers/order");

// Routes
// Use post because we want req.body
router.post(
  "/order",
  runValidation,
  reqSignin,
  authMiddleware,
  orderCreateValidator,
  create
);
router.get("/orders", runValidation, reqSignin, authMiddleware, list);

module.exports = router;
