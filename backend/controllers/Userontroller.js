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

// ---------------- CREATE USERS IN BULK ----------------
exports.createUsersBulk = async (req, res) => {
  try {
    const usersArray = req.body; // Expecting an array of student objects

    // Hash passwords for each user manually before insertMany
    const hashedUsers = await Promise.all(
      usersArray.map(async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
        return user;
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);

    const responseUsers = createdUsers.map((u) => {
      const obj = u.toObject();
      delete obj.password; // remove password from response
      return obj;
    });

    res.status(201).json({
      success: true,
      message: `${createdUsers.length} students added successfully`,
      data: responseUsers,
    });
  } catch (error) {
    console.error("❌ Bulk creation error:", error);
    res.status(500).json({ success: false, message: error.message });
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
  from: `🎓 Student Portal <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Password Reset - Your OTP Code",
  html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Password Reset OTP</title>
</head>

<body style="margin:0;padding:20px;background:#CCBEB1;font-family:Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="500" cellpadding="0" cellspacing="0" style="background:#FFDBBB;border-radius:10px;overflow:hidden">

<!-- HEADER -->
<tr>
<td style="background:#664930;color:white;padding:20px;text-align:center">
<h2 style="margin:0">🎓 Student Portal</h2>
<p style="margin:5px 0 0 0;font-size:14px">Password Reset OTP</p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:30px;text-align:center">

<p style="color:#664930;font-size:16px;margin-bottom:20px">
Use the OTP below to reset your password.
</p>

<!-- OTP BOX -->
<div style="
font-size:34px;
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

    // 🔥 IMPORTANT FIX — empty password hata do
    if (!updateData.password) {
      delete updateData.password;
    }

    if (req.file) {
  updateData.photo = `/uploads/${req.file.filename}`;
}

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update fields manually (pre-save hook chalega)
    Object.keys(updateData).forEach((key) => {
      user[key] = updateData[key];
    });

    await user.save(); // ✅ no validation error now

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    console.error("❌ Update user error:", err);
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
