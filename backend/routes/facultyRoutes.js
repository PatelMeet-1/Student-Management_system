const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

// ================= PUBLIC ROUTES (Faculty Panel) =================
router.post("/login/faculty", facultyController.loginFaculty);
router.post("/forgot-password", facultyController.sendResetOTPEmail);     // First OTP
router.post("/resend-otp", facultyController.resendOtp);                 // 🔥 RESEND OTP ADDED
router.post("/reset-password-otp", facultyController.verifyOTPAndResetPassword);

// ================= ADMIN ROUTES (Admin Panel) =================
router.post("/", facultyController.createFaculty);
router.get("/", facultyController.getFaculties);
router.put("/:id", facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;
