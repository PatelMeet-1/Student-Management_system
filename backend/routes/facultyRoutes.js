const express = require("express");
const router = express.Router();
const {
  createFaculty,
  loginFaculty,
  sendOtp,           
  resetPassword,     
  getFaculties,
  updateFaculty,
  deleteFaculty
} = require("../controllers/FacultyController"); // ✅ Destructuring

// Public routes
router.post("/login", loginFaculty);           // ✅ Admin style
router.post("/send-otp", sendOtp);             // ✅ नया Resend OTP
router.post("/reset-password", resetPassword); // ✅ नया Resend reset

// Admin routes
router.post("/create", createFaculty);
router.get("/", getFaculties);
router.put("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);

module.exports = router;
