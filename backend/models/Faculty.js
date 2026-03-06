const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 PERFECT
    },

    // ✅ OTP fields (ALREADY PRESENT ✅)
    otp: String,
    otpExpiry: Date,
    
    // 🚨 MISSING FIELD - YE ADD KARO 👇
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);
