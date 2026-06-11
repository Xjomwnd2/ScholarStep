const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes        = require('./routes/auth');
const scholarshipRoutes = require('./routes/scholarships');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth',         authRoutes);
app.use('/api/scholarships', scholarshipRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ScholarStep API is running', version: '1.0.0' });
});

app.listen(PORT, () => {
  console.log('ScholarStep backend running on http://localhost:' + PORT);
});