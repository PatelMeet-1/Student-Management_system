const Timetable = require("../models/Timetable");
const fs = require("fs");
const path = require("path");

// ================= CREATE =================
exports.createTimetable = async (req, res) => {
  try {
    if (!req.file || !req.body.description) {
      return res.status(400).json({
        error: "PDF and Description are required",
      });
    }

    const timetable = new Timetable({
      pdf: `/uploads/${req.file.filename}`,
      description: req.body.description,
    });

    await timetable.save();
    res.status(201).json({
      message: "Timetable created successfully",
      timetable,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= READ ALL =================
exports.getTimetables = async (req, res) => {
  try {
    const list = await Timetable.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE =================
exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    const updateData = {
      description: req.body.description,
    };

    // Agar new PDF aayi ho to old delete karo
    if (req.file) {
      const oldPath = path.join(__dirname, "..", timetable.pdf);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      updateData.pdf = `/uploads/${req.file.filename}`;
    }

    const updated = await Timetable.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Timetable updated",
      timetable: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE =================
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    // ---- PDF delete from server ----
    const filePath = path.join(__dirname, "..", timetable.pdf);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ---- Delete from DB ----
    await Timetable.findByIdAndDelete(req.params.id);

    res.json({ message: "Timetable and PDF deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
