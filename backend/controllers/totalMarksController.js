const TotalMarks = require("../models/TotalMarks");

// ✅ Add or Update Total Marks
exports.addOrUpdateTotalMarks = async (req, res) => {
  try {
    const { courseId, semester, internalMarks, practicalMarks, universityMarks } = req.body;

    if (!courseId || !semester) {
      return res.status(400).json({ success: false, message: "Course and Semester are required" });
    }

    // Check if already exists
    let existing = await TotalMarks.findOne({ courseId, semester });
    if (existing) {
      existing.internalMarks = internalMarks || existing.internalMarks;
      existing.practicalMarks = practicalMarks || existing.practicalMarks;
      existing.universityMarks = universityMarks || existing.universityMarks;
      await existing.save();
      return res.json({ success: true, message: "Total marks updated", data: existing });
    }

    // Create new
    const newMarks = await TotalMarks.create({ courseId, semester, internalMarks, practicalMarks, universityMarks });
    res.json({ success: true, message: "Total marks added", data: newMarks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Total Marks by Course & Semester
exports.getTotalMarks = async (req, res) => {
  try {
    const { courseId, semester } = req.query;

    let query = {};
    if (courseId) query.courseId = courseId;
    if (semester) query.semester = semester;

    const data = await TotalMarks.find(query).populate("courseId", "courseName");
    res.json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete Total Marks (Optional)
exports.deleteTotalMarks = async (req, res) => {
  try {
    const { id } = req.params;
    await TotalMarks.findByIdAndDelete(id);
    res.json({ success: true, message: "Total marks deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
