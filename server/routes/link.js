// Login and registration authorization
const express = require("express");

// Create router
const router = express.Router();

// Import Validators
const {
  linkCreateValidator,
  linkUpdateValidator,
} = require("../validators/link");
const { runValidation } = require("../validators/index");

// Import from controllers
const {
  reqSignin,
  authMiddleware,
  adminMiddleware,
  canUpdateDeleteLink,
} = require("../controllers/auth");
const {
  create,
  list,
  read,
  update,
  remove,
  clickCount,
  popularInCategory,
  popular,
  listAll,
} = require("../controllers/link");

// Routes
// Use post because we want req.body
router.post(
  "/link",
  linkCreateValidator,
  runValidation,
  reqSignin,
  authMiddleware,
  create
);
router.get("/allLinks", listAll);
router.post("/links", reqSignin, adminMiddleware, list);
router.put("/click-count", clickCount);
router.get("/link/popular", popular);
router.get("/link/popular/:slug", popularInCategory);
router.get("/link/:id", read);
router.put(
  "/link/:id",
  linkUpdateValidator,
  runValidation,
  reqSignin,
  authMiddleware,
  update,
  canUpdateDeleteLink
);
router.put(
  "/link/admin/:id",
  linkUpdateValidator,
  runValidation,
  reqSignin,
  adminMiddleware,
  update
);
router.delete(
  "/link/:id",
  reqSignin,
  authMiddleware,
  canUpdateDeleteLink,
  remove
);
router.delete("/link/admin/:id", reqSignin, adminMiddleware, remove);

module.exports = router;
