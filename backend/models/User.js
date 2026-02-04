const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },           // ✅ Changed: required: false (controller handles)
    contact: { type: String },       // ✅ Changed: required: false (controller handles)
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    course: { type: String, required: true },      // ✅ CHANGED: Course → course
    department: { type: String, required: true },  // ✅ ADDED
    EnrollmentNo: { type: String, required: true, unique: true },
    photo: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
