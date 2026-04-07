const db = require("../db/db");

// READ SETTINGS
exports.getSettings = (req, res) => {
  db.get("SELECT * FROM settings LIMIT 1", [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
};

// UPDATE SETTINGS
exports.updateSettings = (req, res) => {
  const {
    salary_weight,
    bonus_weight,
    stock_weight,
    wellness_weight,
    life_insurance_weight,
    pdf_weight
  } = req.body;

  const sql = `
    UPDATE settings
    SET salary_weight = ?, bonus_weight = ?, stock_weight = ?,
        wellness_weight = ?, life_insurance_weight = ?, pdf_weight = ?
    WHERE id = 1
  `;

  const params = [
    salary_weight,
    bonus_weight,
    stock_weight,
    wellness_weight,
    life_insurance_weight,
    pdf_weight
  ];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
};
