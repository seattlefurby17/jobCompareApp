const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

// READ settings (only one row)
router.get("/", settingsController.getSettings);

// UPDATE settings (update the single row)
router.put("/", settingsController.updateSettings);

module.exports = router;
