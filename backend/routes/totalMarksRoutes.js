const express = require("express");
const router = express.Router();
const totalMarksController = require("../controllers/totalMarksController");

// ✅ Add or update total marks
router.post("/add", totalMarksController.addOrUpdateTotalMarks);

// ✅ Get total marks (course + sem filter optional)
router.get("/", totalMarksController.getTotalMarks);

// ✅ Delete total marks (optional)
router.delete("/:id", totalMarksController.deleteTotalMarks);

module.exports = router;
