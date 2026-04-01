const db = require('../db/db');

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
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error inserting job:', err.message);
      return res.status(500).json({ error: 'Failed to create job' });
    }

    res.status(201).json({
      message: 'Job created successfully',
      jobId: this.lastID
    });
  });
};
