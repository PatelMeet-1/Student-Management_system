const express = require("express");
const router = express.Router();
const { submitContactForm, getAllMessages, deleteMessage } = require("../controllers/gettouchcontroller");

// Create / Submit Message
router.post("/", submitContactForm);

// Get All Messages
router.get("/", getAllMessages);

// Delete a Message by ID
router.delete("/:id", deleteMessage);

module.exports = router;