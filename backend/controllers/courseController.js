const Course = require('../models/Course');

// ---------------- ADD COURSE ----------------
exports.addCourse = async (req, res) => {
  try {
    const { courseName, departments } = req.body;

    if (!courseName || !departments?.length) {
      return res.status(400).json({ success: false, message: "Course name and departments required" });
    }

    const newCourse = new Course({ courseName, departments });
    await newCourse.save();

    res.json({ success: true, data: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- GET COURSES ----------------
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- UPDATE COURSE ----------------
exports.updateCourse = async (req, res) => {
  try {
    const { courseName, departments } = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, departments },
      { new: true }
    );

    res.json({ success: true, data: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- DELETE COURSE ----------------
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
