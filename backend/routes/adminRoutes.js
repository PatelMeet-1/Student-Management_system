const express = require("express");
const router = express.Router();
const admin = require("../controllers/AdminController");

// Create & Login
router.post("/create", admin.createAdmin);
router.post("/login", admin.loginAdmin);

// NEW ROUTES - ADD YE 2 LINES ✅
router.post("/add-faculty", admin.addFaculty);
router.post("/add-user", admin.addUser);

// Forgot / OTP
router.post("/send-otp", admin.sendOtp);
router.post("/reset-username-password", admin.resetUsernamePassword);

module.exports = router;
