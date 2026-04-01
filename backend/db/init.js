const db = require('./db');

// Create jobs table
db.run(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    company TEXT,
    city TEXT,
    state TEXT,
    cost_of_living_index INTEGER,
    salary INTEGER,
    bonus INTEGER,
    stock_options INTEGER,
    wellness_stipend INTEGER,
    life_insurance INTEGER,
    personal_dev_fund INTEGER,
    is_current_job INTEGER
  )
`);

// Create settings table, THEN insert default row
db.run(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salary_weight INTEGER DEFAULT 1,
    bonus_weight INTEGER DEFAULT 1,
    stock_weight INTEGER DEFAULT 1,
    wellness_weight INTEGER DEFAULT 1,
    lifeInsurance_weight INTEGER DEFAULT 1,
    pdf_weight INTEGER DEFAULT 1
  )
`, () => {
  // This callback runs AFTER the table is created
  db.get(`SELECT COUNT(*) AS count FROM settings`, (err, row) => {
    if (err) {
      console.error('Error checking settings table:', err.message);
      return;
    }

    if (row.count === 0) {
      db.run(`
        INSERT INTO settings (salary_weight, bonus_weight, stock_weight, wellness_weight, lifeInsurance_weight, pdf_weight)
        VALUES (1, 1, 1, 1, 1, 1)
      `);
      console.log('Inserted default settings row.');
    }
  });
});

console.log('Tables created or already exist.');
