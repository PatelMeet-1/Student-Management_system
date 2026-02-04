const mongoose = require("mongoose");

const totalMarksSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  semester: { type: String, required: true },
  internalMarks: { type: Number, default: 0 },
  practicalMarks: { type: Number, default: 0 },
  universityMarks: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("TotalMarks", totalMarksSchema);
