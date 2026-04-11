const db = require("../db/db");

// Score calculation helper
function calculateScore(job, settings) {
  const colScore = job.cost_of_living_index
    ? (1 / job.cost_of_living_index) * settings.col_weight
    : 0;

  return (
    (job.salary || 0) * settings.salary_weight +
    (job.bonus || 0) * settings.bonus_weight +
    (job.stock_options || 0) * settings.stock_weight +
    (job.wellness_stipend || 0) * settings.wellness_weight +
    (job.life_insurance || 0) * settings.life_insurance_weight +
    (job.personal_dev_fund || 0) * settings.pdf_weight +
    colScore
  );
}

exports.compareJobs = (req, res) => {
  const { job1_id, job2_id } = req.body;

  if (!job1_id || !job2_id) {
    return res.status(400).json({ error: "Two job IDs required" });
  }

  const jobSql = "SELECT * FROM jobs WHERE id = ?";
  const settingsSql = "SELECT * FROM settings LIMIT 1";

  // Fetch settings
  db.get(settingsSql, [], (err, settings) => {
    if (err) return res.status(500).json({ error: err.message });

    // Fetch Job 1
    db.get(jobSql, [job1_id], (err, job1) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!job1) return res.status(404).json({ error: "Job 1 not found" });

      // Fetch Job 2
      db.get(jobSql, [job2_id], (err, job2) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!job2) return res.status(404).json({ error: "Job 2 not found" });

        // Score both jobs
        const score1 = calculateScore(job1, settings);
        const score2 = calculateScore(job2, settings);

        job1.score = score1;
        job2.score = score2;

        // Winner is the full job object
        const winner = score1 >= score2 ? { ...job1 } : { ...job2 };

        res.json({
  winner: { ...winner },
  job1: { ...job1 },
  job2: { ...job2 }
});

      });
    });
  });
};
