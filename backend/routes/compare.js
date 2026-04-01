const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Helper: scoring function
function calculateScore(job, settings) {
  return (
    job.salary * settings.salary_weight +
    job.bonus * settings.bonus_weight +
    job.stock_options * settings.stock_weight +
    job.wellness_stipend * settings.wellness_weight +
    job.life_insurance * settings.lifeInsurance_weight +
    job.personal_dev_fund * settings.pdf_weight
  );
}

// POST /compare
router.post("/", (req, res) => {
  console.log("COMPARE BODY:", req.body);
  const { jobA, jobB } = req.body;

  const jobSql = "SELECT * FROM jobs WHERE id = ?";
  const settingsSql = "SELECT * FROM settings LIMIT 1";

  db.get(settingsSql, [], (err, settings) => {
    if (err) return res.status(500).json({ error: err.message });

    db.get(jobSql, [jobA], (err, jobAData) => {
      if (err) return res.status(500).json({ error: err.message });

      // ✅ SAFETY CHECK #1 — does job A exist?
      if (!jobAData) {
        return res.status(404).json({ error: "Job A not found" });
      }

      db.get(jobSql, [jobB], (err, jobBData) => {
        if (err) return res.status(500).json({ error: err.message });

        // ✅ SAFETY CHECK #2 — does job B exist?
        if (!jobBData) {
          return res.status(404).json({ error: "Job B not found" });
        }

        // If both exist, now it's safe to calculate scores
        const scoreA = calculateScore(jobAData, settings);
        const scoreB = calculateScore(jobBData, settings);

        res.json({
          jobA: { score: scoreA },
          jobB: { score: scoreB },
          winner: scoreA > scoreB ? "jobA" : "jobB"
        });
      });
    });
  });
});

module.exports = router;
