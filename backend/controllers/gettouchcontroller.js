const Contact = require("../models/gettouch");

// ---------------- POST ----------------
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again later" });
  }
};

// ---------------- GET ----------------
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again later" });
  }
};

// ---------------- DELETE ----------------
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    await message.remove();
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error, try again later" });
  }
};

module.exports = { submitContactForm, getAllMessages, deleteMessage };