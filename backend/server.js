// Creates an Express app
const express = require('express');
const cors = require('cors');

// Load DB initialization (creates tables if needed)
require('./db/init');

const app = express();
const PORT = 4000;
const jobsRoutes = require('./routes/jobs');

// Middleware-Enables CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Job endpoint registration
app.use('/jobs', jobsRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'JobCompare backend is running' });
});

// Server port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
