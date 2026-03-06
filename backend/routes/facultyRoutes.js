const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

// Public routes
router.post("/login/faculty", facultyController.loginFaculty);
router.post("/forgot-password", facultyController.sendResetOTPEmail);
router.post("/reset-password-otp", facultyController.verifyOTPAndResetPassword);

// Admin routes (protected in future)
router.post("/", facultyController.createFaculty);
router.get("/", facultyController.getFaculties);
router.put("/:id", facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;
