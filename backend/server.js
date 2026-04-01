// Creates an Express app
const express = require('express');
const cors = require('cors');

// Load DB initialization (creates tables if needed)
require('./db/init');

// Define app
const app = express();
const PORT = 4000;

// Middleware-Enables CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Routes
const settingsRoutes = require("./routes/settings");
app.use("/settings", settingsRoutes);

const jobsRoutes = require('./routes/jobs');
app.use('/jobs', jobsRoutes);

const compareRoutes = require("./routes/compare");
app.use("/compare", compareRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'JobCompare backend is running' });
});

// Server port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
