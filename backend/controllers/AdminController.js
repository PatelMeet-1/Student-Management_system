// controllers/AdminController.js
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

/* ================= SEND OTP ================= */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    admin.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

 await transporter.sendMail({
  from: `🔒 Admin Support <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Account Recovery - Your OTP Code",
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Account Recovery OTP</title>
</head>

<body style="margin:0;padding:20px;background:#CCBEB1;font-family:Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="500" cellpadding="0" cellspacing="0" style="background:#FFDBBB;border-radius:10px;overflow:hidden">

<!-- HEADER -->
<tr>
<td style="background:#664930;color:white;padding:20px;text-align:center">
<h2 style="margin:0">🔐 Account Recovery</h2>
<p style="margin:5px 0 0 0;font-size:14px">Your One-Time Password</p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:30px;text-align:center">

<p style="color:#664930;font-size:16px;margin-bottom:20px">
Use the OTP below to recover your account.
</p>

<!-- OTP BOX -->
<div style="
font-size:32px;
font-weight:bold;
letter-spacing:6px;
background:#997E67;
color:white;
padding:15px 25px;
display:inline-block;
border-radius:8px;
margin-bottom:20px;
">
${otp}
</div>

<p style="color:#664930;font-size:14px">
This OTP is valid for <b>5 minutes only</b>.
</p>

</td>
</tr>

<!-- SUPPORT TEAM -->
<tr>
<td style="background:#664930;color:white;text-align:center;padding:20px;font-size:14px">

<b>Support Team</b><br><br>

Name: Meet Patel <br>
Email: patelmeetbhai6333@gmail.com <br>
Contact: +91 9328407114

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
});


    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
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

    // ✅ Only change username if newUsername is provided
    if (newUsername) {
      const usernameExists = await Admin.findOne({ username: newUsername });
      if (usernameExists) return res.status(400).json({ message: "Username already taken" });
      admin.username = newUsername;
    }

    // Always change password
    admin.password = newPassword;
    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    res.json({ message: "Username and/or password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
