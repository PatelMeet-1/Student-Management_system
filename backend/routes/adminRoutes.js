const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------- LOGIN ----------------
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const admin = await Admin.findOne({ username }).select("+password");
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, username: admin.username });
  } catch (err) {
    next(err);
  }
});

// ---------------- FORGOT PASSWORD ----------------
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ username }).select("+password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Old password incorrect" });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ message: "✅ Password updated successfully" });
  } catch (err) {
    next(err);
  }
});

// ---------------- FORGOT USERNAME ----------------
router.post("/forgot-username", async (req, res, next) => {
  try {
    const { oldUsername, newUsername } = req.body;
    if (!oldUsername || !newUsername) {
      return res.status(400).json({ message: "Both old and new username required" });
    }

    const admin = await Admin.findOne({ username: oldUsername });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const exists = await Admin.findOne({ username: newUsername });
    if (exists) return res.status(400).json({ message: "New username already exists" });

    admin.username = newUsername;
    await admin.save();

    res.json({ message: "✅ Username updated successfully", username: newUsername });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
