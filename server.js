const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const scholarshipRoutes = require('./routes/scholarships');
app.use('/api/scholarships', scholarshipRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ScholarStep API running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('ScholarStep API on http://localhost:' + PORT);
});