const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getMonthlyConsumption } = require("../controllers/consumptionController");

router.get("/monthly", authMiddleware, getMonthlyConsumption);

module.exports = router;