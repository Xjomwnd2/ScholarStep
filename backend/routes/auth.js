const express = require('express');
const router = express.Router();
const pool = require('../db'); // This imports the connection pool we just created

// Example query inside auth.js:
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        // Example query
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        res.json(user.rows);
    } catch (err) {
        console.error(err.message);
    }
});