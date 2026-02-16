// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// ---------------- DATABASE CONNECTION ----------------
connectDB();

// ---------------- MIDDLEWARE ----------------
app.use(cors()); // Enable CORS for all origins (or restrict if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- STATIC FILES ----------------
// Serve photos from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// ---------------- ROUTES ----------------

// Users and Admin
app.use("/api/users", require("./routes/userRoutes"));  
app.use("/api/admin", require("./routes/adminRoutes")); // ✅ login + forgot password + forgot username

// Additional Routes
app.use("/api/circular", require("./routes/circularRoutes"));
app.use("/api/timetable", require("./routes/timetableRoutes"));
app.use("/api/faculty", require("./routes/facultyRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));       // ✅ Course + Semester
app.use("/api/totalmarks", require("./routes/totalMarksRoutes")); // ✅ Semester-wise Total Marks

// ---------------- GLOBAL ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server Error" });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

