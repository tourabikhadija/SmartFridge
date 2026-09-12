const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getMonthlyLoss } = require("../controllers/lossController");

router.get("/monthly", authMiddleware, getMonthlyLoss);

module.exports = router;