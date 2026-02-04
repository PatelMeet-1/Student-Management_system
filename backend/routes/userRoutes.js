const express = require("express");
const router = express.Router();
const controller = require("../controllers/Userontroller");
const upload = require("../middleware/upload"); // multer setup

// ================== USERS ==================
router.get("/", controller.getUsers); // Get all users
router.post("/", upload.single("photo"), controller.createUser); // Create new user
router.post("/login", controller.loginUser); // Login endpoint
router.put("/password", controller.updatePassword); // Update password

// ================== STUDENT DETAILS UPDATE WITH PHOTO ==================
router.put("/student-details", upload.single("photo"), controller.updateStudentDetails);

// ================== USER CRUD ==================
router.put("/:id", upload.single("photo"), controller.updateUser); // Update user
router.delete("/:id", controller.deleteUser); // Delete user

module.exports = router;
