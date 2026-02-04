const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= LOGIN FACULTY =================
exports.loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const faculty = await Faculty.findOne({ email }).populate("course");

    if (!faculty) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: faculty._id },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        contact: faculty.contact,
        course: faculty.course?._id,
        courseName: faculty.course?.courseName,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ================= CREATE FACULTY =================
exports.createFaculty = async (req, res) => {
  try {
    const { name, contact, email, course, password } = req.body;

    if (!name || !contact || !email || !course ||  !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const exists = await Faculty.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await Faculty.create({
      name,
      contact,
      email,
      course,
      
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Faculty added successfully",
      faculty,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ================= GET ALL FACULTIES =================
exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find()
      .populate("course", "courseName")
      .select("-password");

    res.json({
      success: true,
      data: faculties,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ================= UPDATE FACULTY =================
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, email, course, password } = req.body;

    const updateData = {
      name,
      contact,
      email,
      course,
      
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await Faculty.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({
      success: true,
      message: "Faculty updated successfully",
      faculty: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ================= DELETE FACULTY =================
exports.deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
