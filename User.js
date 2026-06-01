const { Pool } = require('pg');

const pool = require('../db'); // assuming db.js exists in root

module.exports = {
  createUser: async (name, email, passwordHash) => {
    return pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, passwordHash]
    );
  },

  findByEmail: async (email) => {
    return pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
  }
};