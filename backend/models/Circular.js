  const mongoose = require("mongoose");

  const circularSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      pdf: {
        type: String, // only filename
        required: true,
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Circular", circularSchema);
