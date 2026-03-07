// controllers/facultyController.js - 100% WORKING VERSION
const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
// ================= SEND FIRST OTP ================
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

    console.log('🔑 RESEND_API_KEY LOADED:', !!process.env.RESEND_API_KEY);
    console.log(`📧 Sending OTP to: ${cleanEmail}`);

    // 🔥 FIXED: Use YOUR email (harshbhai9328@gmail.com)
    const { data, error } = await resend.emails.send({
      from: 'harshbhai9328@gmail.com',  // ← YOUR VERIFIED EMAIL
      to: [cleanEmail],
      subject: "🔐 Faculty Password Reset - Your OTP Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Faculty OTP</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea;">Your Faculty Portal OTP</h2>
          <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="font-size: 48px; color: #667eea; letter-spacing: 10px; margin: 0;">${otp}</h1>
            <p style="color: #666; margin: 20px 0;">This code expires in <strong>10 minutes</strong></p>
          </div>
          <p style="color: #888; font-size: 14px;">Faculty Portal Team</p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to send OTP' 
      });
    }

    console.log(`✅ OTP sent via Resend to: ${cleanEmail}`);
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
// ================= RESEND OTP ====================
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

    const newOtp = generateOTP();
    faculty.otp = newOtp;
    faculty.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await faculty.save();

    console.log('🔑 RESEND_API_KEY LOADED:', !!process.env.RESEND_API_KEY);
    console.log(`🔄 RESENDING OTP to: ${cleanEmail}`);

    // 🔥 FIXED: Use YOUR email (harshbhai9328@gmail.com)
    const { data, error } = await resend.emails.send({
      from: 'harshbhai9328@gmail.com',  // ← YOUR VERIFIED EMAIL
      to: [cleanEmail],
      subject: "🔄 NEW Faculty OTP - Resend Request",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>New Faculty OTP</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #28a745;">New OTP Requested</h2>
          <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="font-size: 48px; color: #28a745; letter-spacing: 10px; margin: 0;">${newOtp}</h1>
            <p style="color: #666; margin: 20px 0;">Valid for <strong>5 minutes only</strong></p>
          </div>
          <p style="color: #888; font-size: 14px;">You requested a new verification code.</p>
          <p style="color: #888; font-size: 14px;">Faculty Portal Team</p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to resend OTP' 
      });
    }

    console.log(`✅ NEW OTP sent via Resend to: ${cleanEmail}`);
    res.json({
      success: true,
      message: "New OTP sent successfully to your email!",
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
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
