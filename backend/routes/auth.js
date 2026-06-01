const express = require('express');
const router = express.Router();
const pool = require('../db'); // We created this file earlier

// TEST ROUTE
router.get('/', (req, res) => {
  res.send('Auth Route is working');
});

// EXAMPLE: Login Route (Skeleton)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Example PostgreSQL query
    // const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    res.json({ message: 'Login endpoint hit' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// CRITICAL: This line exports the router so server.js can use it
module.exports = router;