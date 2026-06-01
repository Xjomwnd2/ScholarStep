const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads your .env variables (DB password, etc.)

// 1. INITIALIZE APP FIRST
const app = express();

// 2. ADD MIDDLEWARE
app.use(cors());
app.use(express.json()); // Needed to parse JSON data in requests

// 3. IMPORT ROUTES
const authRoutes = require('./routes/auth');

// 4. USE ROUTES (Must happen AFTER app is initialized)
app.use('/api/auth', authRoutes);

// 5. TEST ROUTE
app.get('/', (req, res) => {
  res.json({ message: 'ScholarStep API running' });
});

// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});