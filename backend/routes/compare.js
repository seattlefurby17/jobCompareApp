const express = require("express");
const router = express.Router();
const compareController = require("../controllers/compareController");

// Compare two jobs POST /compare
router.post("/", compareController.compareJobs);

module.exports = router;
