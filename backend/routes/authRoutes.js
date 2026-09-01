const express = require("express");
const router = express.Router();

const {register, login, getProfile,} = require("../controllers/authController");

const validate = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const { registerSchema, loginSchema,} = require("../validation/authValidation");

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/profile", authMiddleware, getProfile);

module.exports = router;