const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ---------------- GET ALL USERS ----------------
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- CREATE USER ----------------
exports.createUser = async (req, res) => {
  try {
    const userData = {
      name: req.body.name,
      age: req.body.age ? Number(req.body.age) : undefined,
      contact: req.body.contact,
      email: req.body.email,
      course: req.body.course,
      department: req.body.department,
      EnrollmentNo: req.body.EnrollmentNo,
    };

    if (req.file) {
      userData.photo = `/uploads/${req.file.filename}`;
    }

    if (req.body.password) {
      userData.password = req.body.password; // pre-save hook will hash it
    }

    const user = await User.create(userData);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------- LOGIN USER ----------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret_key", {
      expiresIn: "7d",
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ success: true, token, user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- SEND OTP (CORRECT SYNTAX) ----------------
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log(`📤 OTP for ${email}: ${otp}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
    });

    await transporter.sendMail({
  from: `"🎓 Student Portal" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "🔐 Password Reset - Your Secure 6-Digit Code",
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%);min-height:100vh;padding:20px 10px">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin:0 auto">
    <tr>
      <td style="padding:10px 0">
        
        <!-- 🔥 MAIN HERO CARD -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:28px;box-shadow:0 35px 70px rgba(0,0,0,0.25);overflow:hidden;border:1px solid rgba(255,255,255,0.1)">
          
          <!-- ✨ GRADIENT HEADER WITH GLASSMORPHISM -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f093fb 100%);padding:60px 40px;text-align:center;position:relative;overflow:hidden">
              <!-- Animated particles -->
              <div style="position:absolute;top:0;left:0;right:0;bottom:0;background-image:radial-gradient(circle at 20% 80%,rgba(255,255,255,0.3) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(255,255,255,0.2) 0%,transparent 50%),radial-gradient(circle at 40% 40%,rgba(255,255,255,0.1) 0%,transparent 50%);animation:particles 20s ease-in-out infinite alternate;"></div>
              <div style="position:absolute;top:20px;right:20px;width:60px;height:60px;background:linear-gradient(45deg,rgba(255,255,255,0.2),rgba(255,255,255,0.05));border-radius:20px;backdrop-filter:blur(10px);"></div>
              
              <div style="display:inline-block;width:100px;height:100px;background:linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.1));border-radius:24px;margin-bottom:25px;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 40px rgba(255,255,255,0.1);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2)">
                <span style="font-size:44px">🔐</span>
              </div>
              
              <h1 style="margin:0;font-size:36px;font-weight:800;color:white;letter-spacing:-0.02em;text-shadow:0 4px 20px rgba(0,0,0,0.3)">Secure Reset Code</h1>
              <p style="margin:15px 0 0 0;color:rgba(255,255,255,0.95);font-size:18px;font-weight:500;letter-spacing:-0.01em">Student Portal Verification</p>
            </td>
          </tr>

          <!-- 🔥 OTP CONTAINER - 3D EFFECT -->
          <tr>
            <td style="padding:60px 40px;text-align:center">
              
              <!-- Welcome message -->
              <div style="margin-bottom:50px">
                <h2 style="font-size:28px;font-weight:700;color:#1e293b;margin:0 0 15px 0;letter-spacing:-0.02em">Your 6-Digit Code</h2>
                <p style="color:#64748b;font-size:17px;line-height:1.6;margin:0;font-weight:400;max-width:400px;margin:0 auto">
                  Enter this one-time code in the app to reset your password. 
                  <strong>Valid for 5 minutes only.</strong>
                </p>
              </div>

              <!-- 🔥 MAIN OTP BOX - GLASS + NEON GLOW -->
              <div style="background:linear-gradient(145deg,#ffffff,#f8fafc);margin:0 auto 50px;padding:0;border-radius:28px;text-align:center;max-width:380px;box-shadow:0 35px 70px rgba(16,185,129,0.15),inset 0 1px 0 rgba(255,255,255,0.8);position:relative;overflow:hidden;border:2px solid rgba(16,185,129,0.2)">
                
                <!-- Neon glow effect -->
                <div style="position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;background:linear-gradient(45deg,#10b981,#34d399,#059669,#10b981);border-radius:30px;z-index:-1;animation:glow 2s ease-in-out infinite alternate;filter:blur(8px);opacity:0.7"></div>
                
                <!-- Glass inner container -->
                <div style="background:rgba(255,255,255,0.85);backdrop-filter:blur(20px);padding:50px 40px;border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,0.1);position:relative;z-index:1;border:3px solid rgba(255,255,255,0.9)">
                  
                  <!-- 🔥 ANIMATED OTP DISPLAY -->
                  <div style="font-size:56px;font-weight:900;letter-spacing:0.1em;color:#1e293b;text-shadow:0 2px 10px rgba(16,185,129,0.3);font-family:'SF Mono','Courier New',monospace;animation:fadeInUp 1s ease-out;">
                    ${otp}
                  </div>
                  
                  <!-- Timer indicator -->
                  <div style="margin-top:25px;padding:12px 24px;background:linear-gradient(135deg,#10b981,#34d399);border-radius:50px;display:inline-block;font-size:14px;font-weight:600;color:white;text-transform:uppercase;letter-spacing:0.5px;box-shadow:0 8px 25px rgba(16,185,129,0.3)">
                    Expires in 5:00
                  </div>
                  
                </div>
              </div>

              <!-- 🔥 STEP-BY-STEP GUIDE -->
              <div style="background:linear-gradient(135deg,#f8fafc,#f1f5f9);border:2px solid #e2e8f0;border-radius:24px;padding:45px;margin:40px 0;position:relative;overflow:hidden">
                
                <!-- Decorative badge -->
                <div style="position:absolute;top:25px;right:25px;background:linear-gradient(135deg,#3b82f6,#60a5fa);color:white;width:50px;height:50px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;box-shadow:0 8px 25px rgba(59,130,246,0.3)">i</div>
                
                <h3 style="margin:0 0 30px 0;color:#1e293b;font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center">
                  <span style="width:10px;height:10px;background:linear-gradient(135deg,#3b82f6,#60a5fa);border-radius:50%;margin-right:15px;box-shadow:0 0 20px rgba(59,130,246,0.5)"></span>
                  How to use this code
                </h3>
                
                <!-- Steps grid -->
                <div style="display:grid;gap:25px;font-size:16px;color:#475569;line-height:1.7;max-width:500px;margin:0 auto">
                  <div style="display:flex;align-items:flex-start;gap:18px;padding:20px 0;border-bottom:1px solid #e2e8f0">
                    <div style="width:36px;height:36px;background:linear-gradient(135deg,#3b82f6,#60a5fa);color:white;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0;margin-top:2px;box-shadow:0 6px 20px rgba(59,130,246,0.3)">1</div>
                    <span>Paste this code in the password reset form on Student Portal</span>
                  </div>
                  <div style="display:flex;align-items:flex-start;gap:18px;padding:20px 0;border-bottom:1px solid #e2e8f0">
                    <div style="width:36px;height:36px;background:linear-gradient(135deg,#f59e0b,#fbbf24);color:white;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0;margin-top:2px;box-shadow:0 6px 20px rgba(245,158,11,0.3)">2</div>
                    <span><strong>This code expires in 5 minutes</strong> - enter quickly!</span>
                  </div>
                  <div style="display:flex;align-items:flex-start;gap:18px;padding:20px 0">
                    <div style="width:36px;height:36px;background:linear-gradient(135deg,#10b981,#34d399);color:white;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;flex-shrink:0;margin-top:2px;box-shadow:0 6px 20px rgba(16,185,129,0.3)">3</div>
                    <span>Create strong password (8+ chars, mix of letters + numbers)</span>
                  </div>
                </div>
              </div>

            </td>
          </tr>

          <!-- ⚠️ SECURITY ALERT -->
          <tr>
            <td style="padding:0 40px 50px">
              <div style="background:linear-gradient(135deg,#fef7f6,#fde8e3);border:2px solid #fed7d7;border-radius:20px;padding:35px;margin:0;text-align:center;position:relative;overflow:hidden">
                <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 35px rgba(239,68,68,0.3)">
                  <span style="font-size:32px">⚠️</span>
                </div>
                <h3 style="margin:0 0 12px 0;color:#dc2626;font-size:20px;font-weight:700">Didn't request password reset?</h3>
                <p style="margin:0;color:#991b1b;font-size:16px;line-height:1.6">
                  No worries! Your account is safe. This request will 
                  <strong>automatically expire</strong> in 5 minutes.
                </p>
              </div>
            </td>
          </tr>

          <!-- ✨ PREMIUM FOOTER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a,#1e293b);border-top:1px solid rgba(255,255,255,0.1);padding:45px 40px;text-align:center">
              
              <!-- Support section -->
              <div style="margin-bottom:30px">
                <p style="margin:0 0 25px 0;color:#94a3b8;font-size:16px;font-weight:500">Need help? We're here 24/7</p>
                <div style="display:flex;justify-content:center;align-items:center;gap:35px;flex-wrap:wrap">
                  <div style="text-align:center">
                    <div style="width:56px;height:56px;background:linear-gradient(135deg,#3b82f6,#60a5fa);border-radius:16px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px rgba(59,130,246,0.3)">
                      <span style="font-size:22px">📧</span>
                    </div>
                    <p style="margin:0;color:white;font-size:15px;font-weight:600">support@studentportal.in</p>
                  </div>
                  <div style="text-align:center">
                    <div style="width:56px;height:56px;background:linear-gradient(135deg,#10b981,#34d399);border-radius:16px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 25px rgba(16,185,129,0.3)">
                      <span style="font-size:22px">📞</span>
                    </div>
                    <p style="margin:0;color:white;font-size:15px;font-weight:600">+91 93284 07114</p>
                  </div>
                </div>
              </div>
              
              <!-- Copyright -->
              <div style="padding:20px 0;border-top:1px solid rgba(255,255,255,0.1)">
                <p style="margin:0;color:#64748b;font-size:14px;letter-spacing:0.5px">
                  © 2026 <span style="color:#3b82f6;font-weight:600">Student Portal</span>. All rights reserved. | 
                  <a href="#" style="color:#94a3b8;text-decoration:none;font-weight:500">Privacy Policy</a> | 
                  <a href="#" style="color:#94a3b8;text-decoration:none;font-weight:500">Terms of Service</a>
                </p>
              </div>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>

  <style>
    @keyframes particles {
      0% { transform: translateY(0px) rotate(0deg); }
      100% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes glow {
      0% { opacity: 0.7; transform: rotate(0deg); }
      100% { opacity: 1; transform: rotate(180deg); }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  </style>
  
</body>
</html>
  `,
});


    res.json({ success: true, message: "OTP sent successfully (check your email)" });
  } catch (err) {
    console.error("❌ OTP Error:", err);
    res.status(500).json({ error: err.message });
  }
};



// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ error: "Email, OTP, and new password required" });

    const user = await User.findOne({ email }).select("+otp +otpExpiry +password");
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== String(otp) || user.otpExpiry < Date.now())
      return res.status(400).json({ error: "Invalid or expired OTP" });

    user.password = newPassword; // pre-save hook hashes it
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ success: true, message: "Password updated successfully", user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- UPDATE PASSWORD ----------------
exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword)
      return res.status(400).json({ error: "Email, old password, and new password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "Email not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Old password incorrect" });

    user.password = newPassword; // pre-save hook hashes it
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ message: "Password updated successfully", user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- UPDATE USER ----------------
exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.photo = `/uploads/${req.file.filename}`;
    if (updateData.password) updateData.password = updateData.password; // pre-save hook hashes it

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------- DELETE USER ----------------
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.photo) {
      const photoPath = path.join(__dirname, "..", user.photo);
      fs.unlink(photoPath, (err) => {
        if (err && err.code !== "ENOENT") console.error(err);
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
