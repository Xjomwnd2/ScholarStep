const express = require('express');
const cors = require('cors');
require('dotenv').config();
// After dotenv line — add:
const authRoutes = require('./routes/auth');

// Before app.listen — add:
app.use('/api/auth', authRoutes);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ScholarStep API is running', version: '1.0.0' });
});

app.get('/api/scholarships', (req, res) => {
  res.json({ scholarships: [], message: 'Scholarships endpoint ready' });
});

app.listen(PORT, () => {
  console.log('ScholarStep backend running on http://localhost:' + PORT);
});