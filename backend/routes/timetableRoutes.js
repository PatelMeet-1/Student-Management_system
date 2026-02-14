const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const adminAuth = require("../middleware/adminAuth");
const TimetableController = require("../controllers/TimetableController");

// Public routes (GET)
router.get("/", TimetableController.getTimetables);

// Admin protected routes (POST, PUT, DELETE)
router.post("/", adminAuth, upload.single("pdf"), TimetableController.createTimetable);
router.put("/:id", adminAuth, upload.single("pdf"), TimetableController.updateTimetable);
router.delete("/:id", adminAuth, TimetableController.deleteTimetable);

module.exports = router;
