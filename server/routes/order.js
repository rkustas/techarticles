// Login and registration authorization
const express = require("express");

// Create router
const router = express.Router();

// Import Validators
const { orderCreateValidator } = require("../validators/order");
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
  read,
  paymentUpdate,
  deliveredUpdate,
} = require("../controllers/order");

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
// router.get("/order/:id", read);
router.patch("/order/:id", reqSignin, authMiddleware, paymentUpdate);
router.patch(
  "/order/delivered/:id",
  reqSignin,
  adminMiddleware,
  deliveredUpdate
);

module.exports = router;
