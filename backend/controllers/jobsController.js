const db = require("../db/db");

// CREATE JOB
exports.createJob = (req, res) => {
  const {
    title,
    company,
    city,
    state,
    cost_of_living_index,
    salary,
    bonus,
    stock_options,
    wellness_stipend,
    life_insurance,
    personal_dev_fund,
    is_current_job
  } = req.body;

  const sql = `
    INSERT INTO jobs (
      title, company, city, state, cost_of_living_index,
      salary, bonus, stock_options, wellness_stipend,
      life_insurance, personal_dev_fund, is_current_job
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    title, company, city, state, cost_of_living_index,
    salary, bonus, stock_options, wellness_stipend,
    life_insurance, personal_dev_fund, is_current_job
  ];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ jobId: this.lastID });
  });
};

// READ ALL JOBS
exports.getAllJobs = (req, res) => {
  db.all("SELECT * FROM jobs", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// READ ONE JOB
exports.getJobById = (req, res) => {
  db.get("SELECT * FROM jobs WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Job not found" });
    res.json(row);
  });
};

// UPDATE JOB
exports.updateJob = (req, res) => {
  const {
    title,
    company,
    city,
    state,
    cost_of_living_index,
    salary,
    bonus,
    stock_options,
    wellness_stipend,
    life_insurance,
    personal_dev_fund,
    is_current_job
  } = req.body;

  const sql = `
    UPDATE jobs
    SET title = ?, company = ?, city = ?, state = ?, cost_of_living_index = ?,
        salary = ?, bonus = ?, stock_options = ?, wellness_stipend = ?,
        life_insurance = ?, personal_dev_fund = ?, is_current_job = ?
    WHERE id = ?
  `;

  const params = [
    title, company, city, state, cost_of_living_index,
    salary, bonus, stock_options, wellness_stipend,
    life_insurance, personal_dev_fund, is_current_job,
    req.params.id
  ];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Job not found" });
    res.json({ updated: this.changes });
  });
};

// DELETE JOB
exports.deleteJob = (req, res) => {
  db.run("DELETE FROM jobs WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Job not found" });
    res.json({ deleted: this.changes });
  });
};
