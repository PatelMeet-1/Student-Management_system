const Circular = require("../models/Circular");
const fs = require("fs");
const path = require("path");

// ================= CREATE =================
exports.createCircular = async (req, res) => {
  try {
    // ✅ Only description and PDF are required
    if (!req.body.description || !req.file) {
      return res.status(400).json({
        message: "Description and PDF are required",
      });
    }

    const circular = new Circular({
      title: req.body.description, // title optional, use description
      description: req.body.description,
      pdf: `/uploads/${req.file.filename}`, // relative path for frontend
    });

    await circular.save();
    res.status(201).json(circular);
  } catch (err) {
    console.error("CREATE ERROR 👉", err);
    res.status(500).json({ message: "Error uploading circular" });
  }
};

// ================= READ ALL =================
exports.getCirculars = async (req, res) => {
  try {
    const circulars = await Circular.find().sort({ createdAt: -1 });
    res.json(circulars);
  } catch (err) {
    console.error("GET ERROR 👉", err);
    res.status(500).json({ message: "Error fetching circulars" });
  }
};

// ================= UPDATE =================
exports.updateCircular = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id);
    if (!circular) return res.status(404).json({ message: "Circular not found" });

    // 🔥 If new PDF uploaded, delete old file
    if (req.file) {
      if (circular.pdf) {
        const oldFilePath = path.join(__dirname, "../uploads", circular.pdf.split("/").pop());
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      circular.pdf = `/uploads/${req.file.filename}`; // new relative path
    }

    // Update description only (title follows description)
    if (req.body.description) {
      circular.description = req.body.description;
      circular.title = req.body.description; // keep title in sync
    }

    await circular.save();
    res.json(circular);
  } catch (err) {
    console.error("UPDATE ERROR 👉", err);
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= DELETE =================
exports.deleteCircular = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id);
    if (!circular) return res.status(404).json({ message: "Circular not found" });

    // 🔥 Delete PDF file from server
    if (circular.pdf) {
      const filePath = path.join(__dirname, "../uploads", circular.pdf.split("/").pop());
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // 🔥 Delete DB record
    await Circular.findByIdAndDelete(req.params.id);

    res.json({ message: "Circular & PDF deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR 👉", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
