const express = require('express');
<<<<<<< HEAD
const cors    = require('cors');
require('dotenv').config();
require('./config/db');

const authRoutes        = require('./routes/auth');
const scholarshipRoutes = require('./routes/scholarships');
const applicationRoutes = require('./routes/applications');
const userRoutes        = require('./routes/users');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth',         authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users',        userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ScholarStep API is running', version: '1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('ScholarStep backend running on http://localhost:' + PORT);
});
=======
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
>>>>>>> feature/application-tracker
