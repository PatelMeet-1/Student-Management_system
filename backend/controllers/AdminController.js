// controllers/AdminController.js - COMPLETE UPDATED FILE
const Admin = require("../models/Admin");
const Faculty = require("../models/Faculty");  // ADD YE LINE
const User = require("../models/User");        // ADD YE LINE
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");          // ✅ RESEND ADD
const nodemailer = require("nodemailer");

const resend = new Resend(process.env.RESEND_API_KEY);  // ✅ RESEND INSTANCE

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ================= CREATE ADMIN ================= */
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await Admin.findOne({ $or: [{ username }, { email }] });
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ username, email, password });
    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= LOGIN ================= */
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).select("+password");
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= ADD FACULTY BY ADMIN (NEW) ✅ */
exports.addFaculty = async (req, res) => {
  try {
    const { name, email, department, phone } = req.body;

    const existing = await Faculty.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already exists" });

    const otp = generateOTP();
    const newFaculty = new Faculty({
      name, email, department, phone,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000  // 10 min
    });

    await newFaculty.save();

    // 🔥 RESEND EMAIL (Gmail se better!)
    await resend.emails.send({
      from: 'resend@resend.dev',
      to: [email],
      subject: `Welcome ${name} - Faculty OTP`,
      html: `
        <h2>🎓 Welcome Faculty ${name}!</h2>
        <h3 style="color:#2563eb">Your OTP: <b>${otp}</b></h3>
        <p>Valid for 10 minutes only</p>
        <p>Login: yourapp.com/faculty</p>
      `
    });

    console.log(`✅ FACULTY ADDED: ${name} | OTP: ${otp} | ${email}`);
    res.json({ success: true, message: `Faculty ${name} added! OTP sent to ${email}` });

  } catch (err) {
    console.error('Faculty Add Error:', err);
    res.status(500).json({ error: err.message });
  }
};

/* ================= ADD USER BY ADMIN (NEW) ✅ */
exports.addUser = async (req, res) => {
  try {
    const { name, email, rollNo, course } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already exists" });

    const otp = generateOTP();
    const newUser = new User({
      name, email, rollNo, course,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000
    });

    await newUser.save();

    await resend.emails.send({
      from: 'resend@resend.dev',
      to: [email],
      subject: `Welcome ${name} - Student OTP`,
      html: `
        <h2>🎓 Welcome Student ${name}!</h2>
        <h3 style="color:#10b981">Your OTP: <b>${otp}</b></h3>
        <p>Valid for 10 minutes only</p>
      `
    });

    console.log(`✅ USER ADDED: ${name} | OTP: ${otp} | ${email}`);
    res.json({ success: true, message: `Student ${name} added! OTP sent` });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= SEND OTP (RESEND VERSION - UPDATED) ✅ */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Email not registered" });

    const otp = generateOTP();
    admin.otp = otp;
    admin.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await admin.save();

    // ✅ RESEND instead of Nodemailer
    await resend.emails.send({
      from: 'resend@resend.dev',
      to: [email],
      subject: "Admin Recovery - Your OTP Code",
      html: `
        <h2>🔐 Admin Recovery OTP</h2>
        <div style="font-size:32px;font-weight:bold;letter-spacing:6px;background:#2563eb;color:white;padding:15px;border-radius:8px">
          ${otp}
        </div>
        <p>Valid for 5 minutes only</p>
      `
    });

    console.log(`🔥 ADMIN OTP: ${otp} → ${email}`);
    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error('Resend Error:', err);
    res.status(500).json({ error: "OTP sending failed" });
  }
};

/* ================= RESET PASSWORD / USERNAME ================= */
exports.resetUsernamePassword = async (req, res) => {
  try {
    const { email, otp, newUsername, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Email, OTP and New Password required" });

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.otp !== String(otp) || admin.otpExpiry < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (newUsername) {
      const usernameExists = await Admin.findOne({ username: newUsername });
      if (usernameExists) return res.status(400).json({ message: "Username already taken" });
      admin.username = newUsername;
    }

    admin.password = newPassword;
    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    res.json({ message: "Username and/or password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
