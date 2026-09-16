const express = require("express");

const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategory
);

router.get(
  "/",
  authMiddleware,
  getCategories
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory
);

module.exports = router;