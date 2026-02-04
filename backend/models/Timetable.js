const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  pdf: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Timetable", timetableSchema);
