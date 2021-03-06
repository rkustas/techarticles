// Login and registration authorization
const express = require("express");

// Create router
const router = express.Router();

// Import middlewares
const {
  reqSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");

// Import validators
const { userUpdateValidator } = require("../validators/auth");
const { runValidation } = require("../validators/index");

// Import controllers
const {
  read,
  update,
  list,
  updateRole,
  remove,
} = require("../controllers/user");

// Routes
router.get("/user", reqSignin, authMiddleware, read);
router.get("/admin", reqSignin, adminMiddleware, read);
router.get("/users", reqSignin, adminMiddleware, list);
router.patch("/users/:id", reqSignin, adminMiddleware, updateRole);
router.post("/user/link", reqSignin, authMiddleware, read);
router.put(
  "/user",
  userUpdateValidator,
  runValidation,
  reqSignin,
  authMiddleware,
  update
);
router.delete("/users/:id", reqSignin, adminMiddleware, remove);

// Add router to modules.exports, by default all module exports are empty, we are adding the router property
module.exports = router;
