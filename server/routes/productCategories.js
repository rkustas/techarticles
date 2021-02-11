// Login and registration authorization
const express = require("express");

// Create router
const router = express.Router();

// Import Validators
const {
  productCategoryCreateValidator,
} = require("../validators/productCategories");
const { runValidation } = require("../validators/index");

// Import from controllers
const {
  reqSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");
const {
  create,
  list,
  remove,
  update,
} = require("../controllers/productCategories");

// Routes
// Use post because we want req.body
router.post(
  "/productCategory",
  runValidation,
  reqSignin,
  adminMiddleware,
  productCategoryCreateValidator,
  create
);
router.get("/productCategories", list);
router.put("/productCategories/:id", reqSignin, adminMiddleware, update);
router.delete("/productCategories/:id", reqSignin, adminMiddleware, remove);

module.exports = router;
