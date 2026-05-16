const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes       = require('./routes/auth');
const assignmentRoutes = require('./routes/assignments');
const courseRoutes     = require('./routes/courses');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ message: 'ScholarStep API running ✓' }));

// Routes
app.use('/api/v1/auth',        authRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/courses',     courseRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ScholarStep API listening on port ${PORT}`));
