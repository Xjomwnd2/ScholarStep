const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(400).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email',
      [name, email, hash]
    );
    const user = result.rows[0];
    res.status(201).json({ token: signToken(user.id), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    const user   = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: signToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users WHERE id=$1', [req.user.id]);
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getMe };