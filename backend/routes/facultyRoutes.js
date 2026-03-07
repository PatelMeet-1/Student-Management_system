// routes/facultyRoutes.js - FIXED TO MATCH YOUR CONTROLLER
const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

console.log("✅ Faculty Controller loaded:", Object.keys(facultyController));

// Public routes - MATCH YOUR ACTUAL CONTROLLER METHODS
router.post("/login/faculty", facultyController.loginFaculty);
router.post("/forgot-password", facultyController.sendOtp);           // ← FIXED
router.post("/reset-password-otp", facultyController.resetPassword);  // ← FIXED

// Admin routes
router.post("/", facultyController.createFaculty);
router.get("/", facultyController.getFaculties);
router.put("/:id", facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;
