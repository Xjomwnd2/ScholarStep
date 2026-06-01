const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

/**
 * REGISTER USER
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user