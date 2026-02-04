const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ====== LOGIN ======
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login success", token, admin: { username: admin.username, id: admin._id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ====== CHANGE PASSWORD ======
exports.changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====== CHANGE USERNAME ======
exports.changeUsername = async (req, res) => {
  try {
    const { oldUsername, newUsername } = req.body;

    const admin = await Admin.findOne({ username: oldUsername });
    if (!admin) return res.status(404).json({ message: "Old username not found" });

    const existing = await Admin.findOne({ username: newUsername });
    if (existing) return res.status(400).json({ message: "New username already taken" });

    admin.username = newUsername;
    await admin.save();

    res.json({ message: "Username updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
