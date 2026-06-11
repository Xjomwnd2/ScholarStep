const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  res.json({ message: "Register route ready" });
});

// LOGIN
router.post('/login', async (req, res) => {
  res.json({ message: "Login route ready" });
});

module.exports = router;