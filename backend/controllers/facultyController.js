const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require('resend');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// =================================================
// ================ REGISTER + OTP =================
// =================================================
exports.registerFaculty = async (req, res) => {
  try {
    const { name, email, password, contact, course } = req.body;
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
    const otp = generateOTP();

    const newFaculty = new Faculty({
      name: name.trim(),
      contact: contact.trim(),
      email: cleanEmail,
      course,
      password: hashedPassword,
      otp: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });
    await newFaculty.save();

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Faculty Portal <onboarding@resend.dev>',
      to: [cleanEmail],
      subject: "🔐 Faculty Registration - Your OTP Code",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                ✅ Registration OTP
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                Faculty Portal
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="margin: 0 0 10px 0; color: #2d3748; font-size: 24px; font-weight: 600;">
                  Your OTP Code
                </h2>
                <p style="margin: 0; color: #718096; font-size: 16px; line-height: 1.6;">
                  Use this one-time password to verify your faculty account.
                </p>
              </div>

              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          margin: 30px 0; padding: 30px 20px; 
                          border-radius: 16px; text-align: center; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);">
                <div style="display: inline-block; background: white; padding: 20px 30px; 
                            border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                            font-size: 36px; font-weight: 800; letter-spacing: 8px; 
                            color: #2d3748; border: 4px solid #ffffff;">
                  ${otp}
                </div>
              </div>

              <div style="background-color: #f8f9ff; border-left: 5px solid #667eea; 
                          padding: 25px; margin: 30px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 12px 0; color: #2d3748; font-size: 18px; font-weight: 600;">
                  ⏰ How to use this code:
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 15px;">
                  <li>Enter this 6-digit code to verify your account</li>
                  <li>This code expires in <strong>10 minutes</strong></li>
                  <li>Don't share this code with anyone</li>
                </ul>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 15px 0; color: #4a5568; font-size: 14px;">
                Need help? Contact our support team:
              </p>
              <p style="margin: 0 0 5px 0; color: #2d3748; font-weight: 500;">
                📧 support@facultyportal.com | 📞 +91 93284 07114
              </p>
              <p style="margin: 20px 0 0 0; color: #a0aec0; font-size: 13px;">
                © 2026 Faculty Portal. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    console.log('✅ Faculty registration OTP sent!');
    res.json({
      success: true,
      message: "Registration successful! Check your email for OTP",
      email: cleanEmail
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// =================================================
// ================ VERIFY OTP =====================
// =================================================
exports.verifyFacultyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const cleanEmail = email?.toLowerCase().trim();

    if (!cleanEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
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

    faculty.isVerified = true;
    faculty.otp = null;
    faculty.otpExpiry = null;
    await faculty.save();

    const token = jwt.sign(
      { id: faculty._id, role: 'faculty' },
      process.env.JWT_SECRET || "facultySecretKey123",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Email verified successfully! You can now login.",
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
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

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
      { id: faculty._id },
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
// ================= SEND OTP ======================
// =================================================
exports.sendResetOTPEmail = async (req, res) => {
  // ... your existing code (unchanged)
};

// =================================================
// ============== RESET PASSWORD ===================
// =================================================
exports.verifyOTPAndResetPassword = async (req, res) => {
  // ... your existing code (unchanged)
};

// =================================================
// ================= CREATE ========================
// =================================================
exports.createFaculty = async (req, res) => {
  // ... your existing code (unchanged)
};

// =================================================
// ================= READ ==========================
// =================================================
exports.getFaculties = async (req, res) => {
  // ... your existing code (unchanged)
};

// =================================================
// ================= UPDATE ========================
// =================================================
exports.updateFaculty = async (req, res) => {
  // ... your existing code (unchanged)
};

// =================================================
// ================= DELETE ========================
// =================================================
exports.deleteFaculty = async (req, res) => {
  // ... your existing code (unchanged)
};
