const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");

// CREATE a job
router.post("/", jobsController.createJob);

// READ all jobs
router.get("/", jobsController.getAllJobs);

// Clear all current jobs (must be BEFORE "/:id")
router.put("/clear-current", jobsController.clearCurrentJobs);

// READ one job by ID
router.get("/:id", jobsController.getJobById);

// UPDATE a job by ID
router.put("/:id", jobsController.updateJob);

// DELETE a job by ID
router.delete("/:id", jobsController.deleteJob);

module.exports = router;
