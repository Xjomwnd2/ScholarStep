<<<<<<< HEAD
const router = require('express').Router();
const auth   = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', auth.register);
router.post('/login',    auth.login);
router.post('/logout',   protect, auth.logout);
router.get ('/me',       protect, auth.getMe);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ------------------------------------------
// ROUTE 1: REGISTER a new user
// ------------------------------------------
router.post('/register', async (req, res) => {
  try {
    // 1. Destructure data from request body
    const { name, email, password } = req.body;

    // 2. Check if user already exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (user.rows.length > 0) {
      return res.status(401).json("User already exists");
    }

    // 3. Encrypt the password (Bcrypt)
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. Enter the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    // 5. Respond with the created user (minus the password usually, but fine for now)
    res.json({ message: "User registered successfully", user: newUser.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ------------------------------------------
// ROUTE 2: LOGIN an existing user
// ------------------------------------------
router.post('/login', async (req, res) => {
  try {
    // 1. Destructure data
    const { email, password } = req.body;

    // 2. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json("Email or Password is incorrect");
    }

    // 3. Compare entered password with database password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Email or Password is incorrect");
    }

    // 4. Give them a JWT Token (The "Key" to access the app)
    const payload = {
      user: { id: user.rows[0].id }
    };

    jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
>>>>>>> feature/application-tracker
