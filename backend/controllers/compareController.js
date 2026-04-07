const db = require("../db/db");

function calculateScore(job, settings) {
  return (
    (job.salary || 0) * settings.salary_weight +
    (job.bonus || 0) * settings.bonus_weight +
    (job.stock_options || 0) * settings.stock_weight +
    (job.wellness_stipend || 0) * settings.wellness_weight +
    (job.life_insurance || 0) * settings.life_insurance_weight +
    (job.personal_dev_fund || 0) * settings.pdf_weight
  );
}

exports.compareJobs = (req, res) => {
  const { jobIds } = req.body;

  if (!jobIds || !Array.isArray(jobIds) || jobIds.length < 2) {
    return res.status(400).json({
      error: "jobIds must be an array of at least two job IDs"
    });
  }

  const placeholders = jobIds.map(() => "?").join(",");
  const jobSql = `SELECT * FROM jobs WHERE id IN (${placeholders})`;
  const settingsSql = "SELECT * FROM settings LIMIT 1";

  db.get(settingsSql, [], (err, settings) => {
    if (err) return res.status(500).json({ error: err.message });

    db.all(jobSql, jobIds, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (rows.length !== jobIds.length) {
        return res.status(404).json({
          error: "One or more jobs not found"
        });
      }

      const scored = rows.map(job => ({
        ...job,
        score: calculateScore(job, settings)
      }));

      scored.sort((a, b) => b.score - a.score);

      const higherValueJob = scored[0].id;

      res.json({
        higher_value_job: higherValueJob,
        results: scored
      });
    });
  });
};
