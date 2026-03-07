// controllers/FacultyController.js
const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ================= LOGIN ================= */
exports.loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const faculty = await Faculty.findOne({ email: cleanEmail }).select("+password");
    if (!faculty) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(cleanPassword, faculty.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: faculty._id, role: "faculty" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
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
    res.status(500).json({ error: err.message });
  }
};

/* ================= SEND OTP ================= */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail) {
      return res.status(400).json({ message: "Email required" });
    }

    const faculty = await Faculty.findOne({ email: cleanEmail });
    if (!faculty) return res.status(404).json({ message: "Email not registered" });

    const otp = generateOTP();
    faculty.otp = otp;
    faculty.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes (Admin match)
    await faculty.save();

    console.log("🔑 RESEND_API_KEY LOADED:", !!process.env.RESEND_API_KEY);

    // ✅ FIXED: Proper try-catch (Admin-style)
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [cleanEmail],
        subject: "🔐 Faculty Account Recovery - Your Secure OTP Code",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faculty Account Recovery OTP</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:20px;font-family:'Poppins',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:650px;margin:0 auto">
    <tr>
      <td style="padding:20px 0">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#FFDBBB;border-radius:24px;box-shadow:0 25px 60px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);overflow:hidden">
          
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:55px 40px;text-align:center;position:relative">
              <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(45deg,rgba(255,255,255,0.1) 0%,rgba(120,119,198,0.05) 100%);"></div>
              <div style="width:90px;height:90px;background:linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.1));border-radius:20px;margin:0 auto 25px;display:flex;align-items:center;justify-content:center;box-shadow:0 15px 35px rgba(255,255,255,0.1);backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.3)">
                <span style="font-size:40px">🔐</span>
              </div>
              <h1 style="margin:0;font-size:34px;font-weight:800;color:white;letter-spacing:-0.02em;text-shadow:0 4px 20px rgba(0,0,0,0.3)">Faculty Recovery</h1>
              <p style="margin:15px 0 0 0;color:rgba(255,255,255,0.9);font-size:17px;font-weight:500">Your Secure One-Time Password</p>
            </td>
          </tr>

          <tr>
            <td style="padding:60px 40px;text-align:center">
              <div style="margin-bottom:45px">
                <h2 style="font-size:26px;font-weight:700;color:#2d3748;margin:0 0 12px 0;letter-spacing:-0.01em">Verification Code</h2>
                <p style="color:#64748b;font-size:16px;line-height:1.6;margin:0;max-width:450px;margin:0 auto">
                  Use this 6-digit code to recover your faculty account. This code is valid for 
                  <strong>5 minutes only</strong> from now.
                </p>
              </div>

              <div style="background:linear-gradient(145deg,#ffffff 0%,#f8fafc 100%);max-width:360px;margin:0 auto 45px;border-radius:24px;position:relative;overflow:hidden;box-shadow:0 30px 60px rgba(102,126,234,0.2);border:2px solid rgba(102,126,234,0.1)">
                <div style="position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;background:linear-gradient(45deg,#667eea,#764ba2);border-radius:26px;z-index:-1;animation:glow 3s ease-in-out infinite alternate;opacity:0.6"></div>
                <div style="background:rgba(255,255,255,0.9);backdrop-filter:blur(20px);padding:55px 35px;border-radius:20px;position:relative;z-index:2">
                  <div style="font-size:52px;font-weight:900;letter-spacing:0.12em;color:#2d3748;font-family:'SF Mono','Courier New',monospace;text-shadow:0 2px 12px rgba(0,0,0,0.3);animation:pulse 2s ease-in-out infinite">
                    ${otp}
                  </div>
                  <div style="margin-top:25px;padding:12px 28px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50px;display:inline-block;font-size:14px;font-weight:600;color:white;letter-spacing:1px;text-transform:uppercase;box-shadow:0 8px 25px rgba(102,126,234,0.4)">
                    ⏱️ Expires in 5:00
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:linear-gradient(135deg,#2d3748,#4a5568);padding:45px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.1)">
              <p style="margin:0 0 25px 0;color:#94a3b8;font-size:16px;font-weight:500">Faculty Support Team</p>
              <p style="margin:0;color:#64748b;font-size:13px;letter-spacing:0.5px">
                © 2026 Faculty Portal. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <style>
    @keyframes glow {
      0% { opacity: 0.6; transform: rotate(0deg) scale(1); }
      100% { opacity: 0.8; transform: rotate(180deg) scale(1.02); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  </style>
</body>
</html>`
      });

      console.log(`✅ Faculty OTP sent via Resend to: ${cleanEmail}`);
    } catch (emailError) {
      console.error("❌ Resend Faculty error:", emailError);
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ OTP error:", err.message);
    res.status(500).json({ error: "OTP sending failed" });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and New Password required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be 8+ characters" });
    }

    const faculty = await Faculty.findOne({ email: cleanEmail }).select("+password");
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    if (faculty.otp !== String(otp) || faculty.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    faculty.password = await bcrypt.hash(newPassword, 12);
    faculty.otp = null;
    faculty.otpExpiry = null;
    await faculty.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= CREATE (Admin Only) ================= */
exports.createFaculty = async (req, res) => {
  try {
    const { name, contact, email, course, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!name || !contact || !cleanEmail || !course || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await Faculty.findOne({ $or: [{ email: cleanEmail }, { contact }] });
    if (exists) {
      return res.status(400).json({ message: "Email or contact already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const faculty = new Faculty({
      name: name.trim(),
      contact: contact.trim(),
      email: cleanEmail,
      course,
      password: hashedPassword,
    });
    await faculty.save();

    res.status(201).json({ message: "Faculty created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= READ ALL ================= */
exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find()
      .populate("course", "courseName")
      .select("-password -otp -otpExpiry -__v");

    res.json({
      message: "Faculties fetched successfully",
      data: faculties,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, email, course, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (contact) updateData.contact = contact.trim();
    if (cleanEmail) updateData.email = cleanEmail;
    if (course) updateData.course = course;
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const updated = await Faculty.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("course", "courseName");

    if (!updated) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.json({
      message: "Faculty updated successfully",
      faculty: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    await Faculty.findByIdAndDelete(id);

    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
