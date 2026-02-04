const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const TimetableController = require("../controllers/TimetableController");

router.post("/", upload.single("pdf"), TimetableController.createTimetable);
router.get("/", TimetableController.getTimetables);
router.put("/:id", upload.single("pdf"), TimetableController.updateTimetable);
router.delete("/:id", TimetableController.deleteTimetable);

module.exports = router;
