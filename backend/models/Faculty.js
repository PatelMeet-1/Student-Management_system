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
      required: false,
    },
    department: {
  type: mongoose.Schema.Types.ObjectId,
  required: false,
},
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 IMPORTANT
    },

    // ✅ OTP fields (MATCH CONTROLLER + DB)
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);
