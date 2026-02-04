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
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // 🔥 COURSE ID (VERY IMPORTANT)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    

    password: {
      type: String,
      required: true, // encrypted password
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faculty", facultySchema);
