const User = require("../models/User");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");


// ---------------- GET ALL USERS ----------------
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- CREATE USER ---------------- ✅ UPDATED
exports.createUser = async (req, res) => {
  try {
    const userData = {
      name: req.body.name,
      age: req.body.age ? Number(req.body.age) : undefined,
      contact: req.body.contact,
      email: req.body.email,
      course: req.body.course,           // ✅ CHANGED: Course → course
      department: req.body.department,   // ✅ ADDED
      EnrollmentNo: req.body.EnrollmentNo,
    };

    // Handle uploaded photo
    if (req.file) {
      userData.photo = `/uploads/${req.file.filename}`;
    }

    // Hash password
    if (req.body.password) {
      userData.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.create(userData);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------- UPDATE USER ---------------- ✅ UPDATED
exports.updateUser = async (req, res) => {
  try {
    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.age) updateData.age = Number(req.body.age);
    if (req.body.contact) updateData.contact = req.body.contact;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.course) updateData.course = req.body.course;        // ✅ CHANGED: Course → course
    if (req.body.department) updateData.department = req.body.department; // ✅ ADDED
    if (req.body.EnrollmentNo) updateData.EnrollmentNo = req.body.EnrollmentNo;

    // Handle photo update
    if (req.file) {
      const user = await User.findById(req.params.id);
      if (user && user.photo) {
        const oldPhotoPath = path.join(__dirname, "..", user.photo);
        fs.unlink(oldPhotoPath, (err) => {
          if (err && err.code !== "ENOENT") console.error("Failed to delete old photo:", err);
        });
      }
      updateData.photo = `/uploads/${req.file.filename}`;
    } else if (req.body.photo) {
      updateData.photo = req.body.photo;
    }

    // Handle password
    if (req.body.password && req.body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------------- UPDATE STUDENT DETAILS ---------------- ✅ UPDATED
exports.updateStudentDetails = async (req, res) => {
  try {
    const userId = req.body.userId || req.body.id;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const updateData = {};
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.contact) updateData.contact = req.body.contact;
    if (req.body.course) updateData.course = req.body.course;        // ✅ ADDED
    if (req.body.department) updateData.department = req.body.department; // ✅ ADDED

    if (req.file) {
      const user = await User.findById(userId);
      if (user && user.photo) {
        const oldPhotoPath = path.join(__dirname, "..", user.photo);
        fs.unlink(oldPhotoPath, (err) => {
          if (err && err.code !== "ENOENT") console.error("Failed to delete old photo:", err);
        });
      }
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(updateData).length === 0)
      return res.status(400).json({ error: "At least one field is required" });

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ message: "Student details updated successfully", user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- DELETE USER AND PHOTO ----------------
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.photo) {
      const photoPath = path.join(__dirname, "..", user.photo);
      fs.unlink(photoPath, (err) => {
        if (err && err.code !== "ENOENT") console.error("Failed to delete photo:", err);
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User and photo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

    let isPasswordValid = false;
    if (user.password && user.password.startsWith("$2")) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      isPasswordValid = password === user.password;
      if (isPasswordValid) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isPasswordValid) return res.status(401).json({ error: "Invalid email or password" });

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
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

    let isOldPasswordValid = false;
    if (user.password && user.password.startsWith("$2")) {
      isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    } else {
      isOldPasswordValid = oldPassword === user.password;
    }

    if (!isOldPasswordValid) return res.status(401).json({ error: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ message: "Password updated successfully", user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
