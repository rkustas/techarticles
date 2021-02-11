// Login and registration authorization
const express = require("express");

// Create router
const router = express.Router();

// Import Validators
const {
  storeCreateValidator,
  storeUpdateValidator,
} = require("../validators/store");
const { runValidation } = require("../validators/index");

// Import from controllers
const { reqSignin, adminMiddleware } = require("../controllers/auth");
const { create, list, read, update, remove } = require("../controllers/store");

// Routes
// Use post because we want req.body
router.post(
  "/create",
  storeCreateValidator,
  runValidation,
  reqSignin,
  adminMiddleware,
  create
);
router.get("/store/products", list);
router.get("/store/:id", read);
router.put(
  "/edit/:id",
  storeUpdateValidator,
  runValidation,
  reqSignin,
  adminMiddleware,
  update
);
router.delete("/store/:id", reqSignin, adminMiddleware, remove);

module.exports = router;
