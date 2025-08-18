// authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Protect signup route
router.post("/signup", signup);

// Login route remains public
router.post("/login", login);

module.exports = router;
