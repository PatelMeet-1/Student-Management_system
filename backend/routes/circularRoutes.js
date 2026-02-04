const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const CircularController = require("../controllers/circularController");

router.post("/", upload.single("pdf"), CircularController.createCircular);
router.get("/", CircularController.getCirculars);
router.put("/:id", upload.single("pdf"), CircularController.updateCircular);
router.delete("/:id", CircularController.deleteCircular);

module.exports = router;
