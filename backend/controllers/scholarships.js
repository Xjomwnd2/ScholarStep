const pool = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const { status, search, minAmount, page = 1, limit = 10 } = req.query;
    let query = 'SELECT * FROM scholarships WHERE 1=1';
    const params = [];
    let i = 1;
    if (status)    { query += ` AND status=$${i++}`;           params.push(status); }
    if (search)    { query += ` AND title ILIKE $${i++}`;      params.push(`%${search}%`); }
    if (minAmount) { query += ` AND amount>=$${i++}`;          params.push(minAmount); }
    query += ` ORDER BY deadline ASC LIMIT $${i++} OFFSET $${i++}`;
    params.push(limit, (page - 1) * limit);
    const result = await pool.query(query, params);
    res.json({ scholarships: result.rows, page: Number(page) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM scholarships WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, provider, description, amount, currency,
            deadline, min_gpa, nationality, field_of_study,
            level_of_study, status, tags } = req.body;
    const result = await pool.query(
      `INSERT INTO scholarships
        (title,provider,description,amount,currency,deadline,min_gpa,
         nationality,field_of_study,level_of_study,status,tags,created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [title, provider, description, amount, currency, deadline, min_gpa,
       nationality, field_of_study, level_of_study, status||'open', tags, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const { title, provider, description, amount, currency, deadline, status } = req.body;
    const result = await pool.query(
      `UPDATE scholarships SET title=$1,provider=$2,description=$3,
       amount=$4,currency=$5,deadline=$6,status=$7 WHERE id=$8 RETURNING *`,
      [title, provider, description, amount, currency, deadline, status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM scholarships WHERE id=$1 RETURNING id', [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Scholarship deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
