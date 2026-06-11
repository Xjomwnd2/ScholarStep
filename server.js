const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes = require('./backend/routes/auth');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ScholarStep API is running', version: '1.0.0' });
});

app.get('/api/scholarships', (req, res) => {
  res.json({ scholarships: [], message: 'Scholarships endpoint ready' });
});

app.listen(PORT, () => {
  console.log('ScholarStep backend running on http://localhost:' + PORT);
});