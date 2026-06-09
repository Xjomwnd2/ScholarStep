const pool = require('../config/db');

exports.submit = async (req, res) => {
  try {
    const { scholarshipId, personalStatement, documents } = req.body;
    const sc = await pool.query('SELECT id,status FROM scholarships WHERE id=$1', [scholarshipId]);
    if (!sc.rows.length || sc.rows[0].status !== 'open')
      return res.status(400).json({ error: 'Scholarship is not open' });
    const exists = await pool.query(
      'SELECT id FROM applications WHERE student_id=$1 AND scholarship_id=$2',
      [req.user.id, scholarshipId]
    );
    if (exists.rows.length) return res.status(400).json({ error: 'Already applied' });
    const app = await pool.query(
      'INSERT INTO applications (student_id,scholarship_id,personal_statement) VALUES ($1,$2,$3) RETURNING *',
      [req.user.id, scholarshipId, personalStatement]
    );
    const appId = app.rows[0].id;
    if (documents?.length) {
      for (const doc of documents)
        await pool.query('INSERT INTO documents (application_id,name,url) VALUES ($1,$2,$3)',
          [appId, doc.name, doc.url]);
    }
    res.status(201).json(app.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getMine = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*,s.title,s.provider,s.deadline,s.amount
       FROM applications a JOIN scholarships s ON a.scholarship_id=s.id
       WHERE a.student_id=$1 ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAll = async (req, res) => {
  try {
    const { status, page=1, limit=20 } = req.query;
    let query = `SELECT a.*,u.name AS student_name,u.email,s.title AS scholarship_title
                 FROM applications a
                 JOIN users u ON a.student_id=u.id
                 JOIN scholarships s ON a.scholarship_id=s.id WHERE 1=1`;
    const params = [];
    if (status) { query += ` AND a.status=$1`; params.push(status); }
    query += ` ORDER BY a.created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(limit, (page-1)*limit);
    const result = await pool.query(query, params);
    res.json({ apps: result.rows, page: Number(page) });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    const result = await pool.query(
      `UPDATE applications SET status=$1,review_notes=$2,reviewed_by=$3,reviewed_at=NOW()
       WHERE id=$4 RETURNING *`,
      [status, reviewNotes, req.user.id, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.withdraw = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE applications SET status='withdrawn'
       WHERE id=$1 AND student_id=$2 AND status='pending' RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(400).json({ error: 'Cannot withdraw' });
    res.json({ message: 'Withdrawn', app: result.rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
