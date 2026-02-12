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
  from: `"🔒 Admin Support" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "🔐 Account Recovery - Your Secure OTP Code",
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Recovery OTP</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:20px;font-family:'Poppins',sans-serif;background:linear-gradient(135deg,#0f0f23 0%,#1a1a2e 50%,#16213e 100%);min-height:100vh">
  
  <!-- MAIN CONTAINER -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:650px;margin:0 auto">
    <tr>
      <td style="padding:20px 0">
        
        <!-- 🔥 HERO CARD -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:24px;box-shadow:0 25px 60px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);overflow:hidden">
          
          <!-- ✨ METALLIC GRADIENT HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);padding:55px 40px;text-align:center;position:relative">
              <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(45deg,rgba(255,255,255,0.1) 0%,rgba(120,119,198,0.05) 100%);"></div>
              
              <!-- LOGO EFFECT -->
              <div style="width:90px;height:90px;background:linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.1));border-radius:20px;margin:0 auto 25px;display:flex;align-items:center;justify-content:center;box-shadow:0 15px 35px rgba(255,255,255,0.1);backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.3)">
                <span style="font-size:40px">🔐</span>
              </div>
              
              <h1 style="margin:0;font-size:34px;font-weight:800;color:white;letter-spacing:-0.02em;text-shadow:0 4px 20px rgba(0,0,0,0.3)">Account Recovery</h1>
              <p style="margin:15px 0 0 0;color:rgba(255,255,255,0.9);font-size:17px;font-weight:500">Your Secure One-Time Password</p>
            </td>
          </tr>

          <!-- 🔥 OTP DISPLAY SECTION -->
          <tr>
            <td style="padding:60px 40px;text-align:center">
              
              <!-- Welcome Text -->
              <div style="margin-bottom:45px">
                <h2 style="font-size:26px;font-weight:700;color:#1e293b;margin:0 0 12px 0;letter-spacing:-0.01em">Verification Code</h2>
                <p style="color:#64748b;font-size:16px;line-height:1.6;margin:0;max-width:450px;margin:0 auto">
                  Use this 6-digit code to recover your account. This code is valid for 
                  <strong>5 minutes only</strong> from now.
                </p>
              </div>

              <!-- 🔥 3D NEON OTP BOX -->
              <div style="background:linear-gradient(145deg,#ffffff 0%,#f8fafc 100%);max-width:360px;margin:0 auto 45px;border-radius:24px;position:relative;overflow:hidden;box-shadow:0 30px 60px rgba(99,102,241,0.2);border:2px solid rgba(99,102,241,0.1)">
                
                <!-- GLOW EFFECT -->
                <div style="position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;background:linear-gradient(45deg,#6366f1,#8b5cf6,#a855f7);border-radius:26px;z-index:-1;animation:glow 3s ease-in-out infinite alternate;opacity:0.6"></div>
                
                <!-- OTP CONTAINER -->
                <div style="background:rgba(255,255,255,0.9);backdrop-filter:blur(20px);padding:55px 35px;border-radius:20px;position:relative;z-index:2">
                  <div style="font-size:52px;font-weight:900;letter-spacing:0.12em;color:#1e293b;font-family:'SF Mono','Courier New',monospace;text-shadow:0 2px 12px rgba(99,102,241,0.3);animation:pulse 2s ease-in-out infinite">
                    ${otp}
                  </div>
                  
                  <!-- COUNTDOWN BADGE -->
                  <div style="margin-top:25px;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50px;display:inline-block;font-size:14px;font-weight:600;color:white;letter-spacing:1px;text-transform:uppercase;box-shadow:0 8px 25px rgba(99,102,241,0.4)">
                    ⏱️ Expires in 5:00
                  </div>
                </div>
              </div>

              <!-- 🔥 QUICK STEPS -->
              <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:2px solid #e2e8f0;border-radius:20px;padding:40px 30px;margin:35px 0">
                <h3 style="margin:0 0 30px 0;color:#1e293b;font-size:22px;font-weight:700;text-align:center">
                  📋 How to use this code
                </h3>
                <div style="display:grid;gap:20px;font-size:15px;color:#475569;line-height:1.6">
                  <div style="display:flex;align-items:flex-start;gap:15px;padding:18px 0;border-bottom:1px solid #e5e7eb">
                    <div style="width:32px;height:32px;background:linear-gradient(135deg,#10b981,#34d399);color:white;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0">1</div>
                    <span>Enter this code in the account recovery form</span>
                  </div>
                  <div style="display:flex;align-items:flex-start;gap:15px;padding:18px 0;border-bottom:1px solid #e5e7eb">
                    <div style="width:32px;height:32px;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:white;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0">2</div>
                    <span><strong>Valid for 5 minutes only</strong> - don't refresh or share</span>
                  </div>
                  <div style="display:flex;align-items:flex-start;gap:15px;padding:18px 0">
                    <div style="width:32px;height:32px;background:linear-gradient(135deg,#3b82f6,#60a5fa);color:white;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0">3</div>
                    <span>Set new strong password (8+ characters recommended)</span>
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <!-- ⚠️ SECURITY BOX -->
          <tr>
            <td style="padding:0 40px 50px">
              <div style="background:linear-gradient(135deg,#fef7f6,#fee2e2);border:2px solid #fecaca;border-radius:18px;padding:35px;text-align:center">
                <div style="width:60px;height:60px;background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:16px;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(239,68,68,0.3)">
                  <span style="font-size:26px">⚠️</span>
                </div>
                <h3 style="margin:0 0 10px 0;color:#dc2626;font-size:18px;font-weight:700">Not you?</h3>
                <p style="margin:0;color:#991b1b;font-size:15px;line-height:1.5">
                  Ignore this email. Your account remains secure. Code expires automatically.
                </p>
              </div>
            </td>
          </tr>

          <!-- ✨ FOOTER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:45px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.1)">
              <div style="margin-bottom:30px">
                <p style="margin:0 0 25px 0;color:#94a3b8;font-size:16px;font-weight:500">Admin Support Team</p>
                <div style="display:flex;justify-content:center;align-items:center;gap:30px;flex-wrap:wrap">
                  <div style="text-align:center">
                    <div style="width:52px;height:52px;background:linear-gradient(135deg,#3b82f6,#60a5fa);border-radius:14px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center">
                      <span style="font-size:20px">📧</span>
                    </div>
                    <p style="margin:0;color:white;font-size:14px;font-weight:600">support@adminportal.com</p>
                  </div>
                  <div style="text-align:center">
                    <div style="width:52px;height:52px;background:linear-gradient(135deg,#10b981,#34d399);border-radius:14px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center">
                      <span style="font-size:20px">📞</span>
                    </div>
                    <p style="margin:0;color:white;font-size:14px;font-weight:600">+91 93284 07114</p>
                  </div>
                </div>
              </div>
              <p style="margin:0;color:#64748b;font-size:13px;letter-spacing:0.5px">
                © 2026 Admin Portal. All rights reserved.
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
</html>
  `,
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
    admin.password = newPassword; // pre-save hook will hash
    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    res.json({ message: "Username and/or password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
