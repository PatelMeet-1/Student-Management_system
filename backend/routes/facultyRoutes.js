const express = require("express");
const router = express.Router();
const facultyController = require("../controllers/facultyController");

// Faculty login route (email + password only)
router.post("/login/faculty", facultyController.loginFaculty);

// Admin routes
router.post("/", facultyController.createFaculty);
router.get("/", facultyController.getFaculties);
router.put("/:id", facultyController.updateFaculty);
router.delete("/:id", facultyController.deleteFaculty);

module.exports = router;
