const express = require("express");
const router = express.Router();
const controller = require("../controllers/Userontroller");
const upload = require("../middleware/upload"); // multer setup

// USERS CRUD
router.get("/", controller.getUsers); // Get all users
router.post("/", upload.single("photo"), controller.createUser); // Create user
router.put("/:id", upload.single("photo"), controller.updateUser); // Update user
router.delete("/:id", controller.deleteUser); // Delete user

// LOGIN + PASSWORD
router.post("/login", controller.loginUser);
router.put("/password", controller.updatePassword);

// OTP / RESET
router.post("/send-otp", controller.sendOtp);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
