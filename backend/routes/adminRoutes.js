const express = require("express");
const router = express.Router();
const admin = require("../controllers/AdminController");

// Create & Login
router.post("/create", admin.createAdmin);
router.post("/login", admin.loginAdmin);

// Forgot / OTP
router.post("/send-otp", admin.sendOtp);
router.post("/reset-username-password", admin.resetUsernamePassword);

module.exports = router;
