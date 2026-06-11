const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',     // Default pgAdmin username
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'scholarstep', // The name of the DB you created in pgAdmin
  password: process.env.PG_PASSWORD,           // Your pgAdmin password
  port: process.env.PG_PORT || 5432,
});

module.exports = pool;