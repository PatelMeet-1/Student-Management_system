// controllers/facultyController.js
const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ================= EMAIL CONFIG - FIXED ✅ =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// =================================================
// =================== LOGIN =======================
// =================================================
exports.loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email?.toLowerCase().trim();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const faculty = await Faculty
      .findOne({ email: cleanEmail })
      .select("+password");

    if (!faculty) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(cleanPassword, faculty.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: faculty._id, role: 'faculty' },
      process.env.JWT_SECRET || "facultySecretKey123",
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
        course: faculty.course,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =================================================
// ================= SEND FIRST OTP (Forgot Pass) ===
// =================================================
exports.sendResetOTPEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const faculty = await Faculty.findOne({ email: cleanEmail });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    const otp = generateOTP();
    faculty.otp = otp;
    faculty.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await faculty.save();

    // Simple HTML email (same as your original)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "🔐 Faculty Password Reset - Your OTP Code",
      html: `
        <h1 style="color: #667eea;">Your OTP: ${otp}</h1>
        <p>This code expires in 10 minutes. Do not share this code with anyone.</p>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// =================================================
// ================= RESEND OTP - NEW FUNCTION 🔥 ===
// =================================================
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const faculty = await Faculty.findOne({ email: cleanEmail });
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found",
      });
    }

    // Generate NEW OTP
    const newOtp = generateOTP();
    faculty.otp = newOtp;
    faculty.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await faculty.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: cleanEmail,
      subject: "🔄 NEW OTP - Faculty Portal (Resend)",
      html: `
        <h1 style="color: #28a745;">New OTP: ${newOtp}</h1>
        <p>You requested a new verification code.</p>
        <p><strong>Valid for 5 minutes only!</strong></p>
      `,
    });

    console.log(`✅ NEW OTP sent to: ${cleanEmail}`);
    res.json({
      success: true,
      message: "New OTP sent successfully to your email!",
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again.",
    });
  }
};

// =================================================
// ================= VERIFY & RESET PASSWORD =======
// =================================================
exports.verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const faculty = await Faculty.findOne({
      email: cleanEmail,
      otp: otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Reset password
    faculty.password = await bcrypt.hash(newPassword, 12);
    faculty.otp = null;
    faculty.otpExpiry = null;
    await faculty.save();

    res.json({
      success: true,
      message: "Password reset successful! Please login with new password.",
    });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =================================================
// ================= CRUD OPERATIONS ===============
// =================================================
exports.createFaculty = async (req, res) => {
  try {
    const { name, contact, email, course, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!name || !contact || !cleanEmail || !course || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const exists = await Faculty.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const faculty = await Faculty.create({
      name: name.trim(),
      contact: contact.trim(),
      email: cleanEmail,
      course,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      faculty,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find()
      .populate("course", "courseName")
      .select("-password -otp -otpExpiry");

    res.json({
      success: true,
      data: faculties,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, email, course, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (contact) updateData.contact = contact.trim();
    if (course) updateData.course = course;
    if (email) updateData.email = email.toLowerCase().trim();
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const updated = await Faculty.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("course", "courseName");

    res.json({
      success: true,
      message: "Faculty updated successfully",
      faculty: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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
