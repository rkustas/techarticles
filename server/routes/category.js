// Login and registration authorization
const express = require("express");

// Create router
const router = express.Router();

// Import Validators
const {
  categoryCreateValidator,
  categoryUpdateValidator,
} = require("../validators/category");
const { runValidation } = require("../validators/index");

// Import from controllers
const { reqSignin, adminMiddleware } = require("../controllers/auth");
const {
  create,
  list,
  read,
  update,
  remove,
} = require("../controllers/category.js");

// Routes
router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  reqSignin,
  adminMiddleware,
  create
);
router.get("/categories", list);
router.post("/category/:slug", read);
router.put(
  "/category/:slug",
  categoryUpdateValidator,
  runValidation,
  reqSignin,
  adminMiddleware,
  update
);
router.delete("/category/:slug", reqSignin, adminMiddleware, remove);

module.exports = router;
