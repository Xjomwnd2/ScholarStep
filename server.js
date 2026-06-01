Set-Content -Path "C:\Users\Joel Ndiba Mwaura\GitHub\CS160\ScholarStep\backend\server.js" -Value @"
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.json({ message: 'ScholarStep API running' }));

try { app.use('/api/v1/auth',        require('./routes/auth'));        console.log('auth routes OK'); }
catch (e) { console.error('auth routes FAILED:', e.message); }

try { app.use('/api/v1/assignments', require('./routes/assignments')); console.log('assignment routes OK'); }
catch (e) { console.error('assignment routes FAILED:', e.message); }

try { app.use('/api/v1/courses',     require('./routes/courses'));     console.log('courses routes OK'); }
catch (e) { console.error('courses routes FAILED:', e.message); }

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('ScholarStep API on http://localhost:' + PORT));
"@