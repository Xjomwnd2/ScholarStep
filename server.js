cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'ScholarStep API running ✓' }));

try {
  app.use('/api/v1/auth',        require('./routes/auth'));
  console.log('✓ auth routes loaded');
} catch (e) { console.error('✗ auth routes failed:', e.message); }

try {
  app.use('/api/v1/assignments', require('./routes/assignments'));
  console.log('✓ assignment routes loaded');
} catch (e) { console.error('✗ assignment routes failed:', e.message); }

try {
  app.use('/api/v1/courses',     require('./routes/courses'));
  console.log('✓ courses routes loaded');
} catch (e) { console.error('✗ courses routes failed:', e.message); }

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n✓ ScholarStep API on http://localhost:${PORT}`));
EOF