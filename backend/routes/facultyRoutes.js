const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

// 🆕 NEW REGISTRATION ROUTES (ADD THESE)
router.post("/register", facultyController.registerFaculty);        // ✅ REGISTER
router.post("/verify-otp", facultyController.verifyFacultyOTP);     // ✅ VERIFY OTP

// Existing routes (perfect hain)
router.post("/login/faculty", facultyController.loginFaculty);
router.post("/forgot-password", facultyController.sendResetOTPEmail);
router.post("/reset-password-otp", facultyController.verifyOTPAndResetPassword);

router.post("/", facultyController.createFaculty);
router.get("/", facultyController.getFaculties);
router.put("/:id", facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;
