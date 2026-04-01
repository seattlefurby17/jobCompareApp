const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

// POST /jobs
router.post('/', jobsController.createJob);

module.exports = router;
