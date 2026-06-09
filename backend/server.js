const express = require('express');
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
