const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // RESEND (NO MORE GMAIL SMTP ERRORS!)
    await resend.emails.send({  
      from: 'Admin Support <onboarding@resend.dev>',
      to: [email],
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
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:650px;margin:0 auto">
    <tr>
      <td style="padding:20px 0">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:24px;box-shadow:0 25px 60px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);overflow:hidden">
          
          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);padding:55px 40px;text-align:center">
              <div style="width:90px;height:90px;background:linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.1));border-radius:20px;margin:0 auto 25px;display:flex;align-items:center;justify-content:center;box-shadow:0 15px 35px rgba(255,255,255,0.1);backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.3)">
                <span style="font-size:40px">🔐</span>
              </div>
              <h1 style="margin:0;font-size:34px;font-weight:800;color:white;letter-spacing:-0.02em">Account Recovery</h1>
              <p style="margin:15px 0 0 0;color:rgba(255,255,255,0.9);font-size:17px;font-weight:500">Your Secure One-Time Password</p>
            </td>
          </tr>

          <!-- OTP -->
          <tr>
            <td style="padding:60px 40px;text-align:center">
              <h2 style="font-size:26px;font-weight:700;color:#1e293b;margin:0 0 12px 0">Verification Code</h2>
              <p style="color:#64748b;font-size:16px;line-height:1.6;margin:0 0 30px 0;max-width:450px;margin:0 auto">
                Use this 6-digit code to recover your account. Valid for <strong>5 minutes only</strong>.
              </p>
              
              <div style="background:linear-gradient(145deg,#ffffff 0%,#f8fafc 100%);max-width:360px;margin:0 auto;border-radius:24px;box-shadow:0 30px 60px rgba(99,102,241,0.2);border:2px solid rgba(99,102,241,0.1);position:relative;overflow:hidden">
                <div style="position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;background:linear-gradient(45deg,#6366f1,#8b5cf6,#a855f7);border-radius:26px;z-index:-1;opacity:0.6"></div>
                <div style="background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);padding:55px 35px;border-radius:20px;position:relative;z-index:2">
                  <div style="font-size:52px;font-weight:900;letter-spacing:0.12em;color:#1e293b;font-family:'SF Mono','Courier New',monospace;text-shadow:0 2px 12px rgba(99,102,241,0.3)">
                    ${otp}
                  </div>
                  <div style="margin-top:25px;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50px;display:inline-block;font-size:14px;font-weight:600;color:white;letter-spacing:1px">
                    ⏱️ Expires in 5 minutes
                  </div>
                </div>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:45px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.1)">
              <p style="margin:0 0 25px 0;color:#94a3b8;font-size:16px;font-weight:500">Admin Support Team</p>
              <p style="margin:0;color:#64748b;font-size:13px">© 2026 Student Management System</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log('✅ OTP sent via Resend to:', email);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error('❌ Resend error:', err.message);
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
