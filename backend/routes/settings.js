const express = require("express");
const router = express.Router();
const db = require("../db/db");

// GET /settings
router.get("/", (req, res) => {
  const sql = "SELECT * FROM settings LIMIT 1";

  db.get(sql, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// PUT /settings
router.put("/", (req, res) => {
  // camelCase from frontend
  const {
    salaryWeight,
    bonusWeight,
    stockWeight,
    wellnessWeight,
    lifeInsuranceWeight,
    pdfWeight
  } = req.body;

  // snake_case for DB
  const sql = `
    UPDATE settings
    SET salary_weight = ?, bonus_weight = ?, stock_weight = ?,
        wellness_weight = ?, lifeInsurance_weight = ?, pdf_weight = ?
    WHERE id = 1
  `;

  const params = [
    salaryWeight,
    bonusWeight,
    stockWeight,
    wellnessWeight,
    lifeInsuranceWeight,
    pdfWeight
  ];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ updated: this.changes });
  });
});

module.exports = router;
