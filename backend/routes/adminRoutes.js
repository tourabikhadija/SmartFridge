const express = require("express");

const router = express.Router();

const { getStatistics, getUsers,toggleUserStatus, } = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/statistics",
  authMiddleware,
  adminMiddleware,
  getStatistics
);
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getUsers
);

router.put(
  "/users/:id/status",
  authMiddleware,
  adminMiddleware,
  toggleUserStatus
);

module.exports = router;