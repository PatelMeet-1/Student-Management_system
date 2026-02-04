const mongoose = require("mongoose");

// Each subject stores name, marks, and maxMarks
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  marks: { type: Number, required: true, min: 0 },
  maxMarks: { type: Number, required: true, min: 0 },
});

// Result schema for a student semester ✅ UPDATED
const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: { type: String, required: true, trim: true },        // ✅ ADDED
    department: { type: String, required: true, trim: true },    // ✅ ADDED (already exists)
    Sem: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["internal", "practical", "university", "final"],
      required: true,
    },
    subjects: {
      type: [subjectSchema],
      required: true,
      validate: [v => v.length > 0, "At least one subject required"],
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
