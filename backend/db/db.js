const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or open the database file
const dbPath = path.resolve(__dirname, 'jobcompare.db');
console.log("USING DB FILE:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});
// Export db to backend
module.exports = db;
