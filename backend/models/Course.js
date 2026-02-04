const mongoose = require('mongoose');

// Subject schema: sirf total marks store honge
const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  internalTotal: { type: Number, required: true },
  practicalTotal: { type: Number, required: true },
  universityTotal: { type: Number, required: true }
});

// Semester schema
const semesterSchema = new mongoose.Schema({
  semesterName: { type: String, required: true },
  subjects: [subjectSchema]
});

// Department schema
const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  semesters: [semesterSchema]
});

// Course schema
const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  departments: [departmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
