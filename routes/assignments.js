const router  = require('express').Router();
const pool    = require('../db');
const protect = require('../middleware/auth');

// All routes protected
router.use(protect);

// GET  /api/v1/assignments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, c.name AS course_name
       FROM assignments a
       LEFT JOIN courses c ON a.course_id = c.id
       WHERE a.user_id = $1
       ORDER BY a.due_date ASC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch assignments' });
  }
});

// POST /api/v1/assignments
router.post('/', async (req, res) => {
  const { title, course_id, priority, due_date, notes } = req.body;
  if (!title || !due_date)
    return res.status(400).json({ error: 'Title and due date are required' });

  try {
    const result = await pool.query(
      `INSERT INTO assignments (user_id, course_id, title, priority, due_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, course_id || null, title, priority || 'medium', due_date, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Could not create assignment' });
  }
});

// PATCH /api/v1/assignments/:id  (update status or progress)
router.patch('/:id', async (req, res) => {
  const { status, progress } = req.body;
  try {
    const result = await pool.query(
      `UPDATE assignments SET status = COALESCE($1, status), progress = COALESCE($2, progress)
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [status, progress, req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Assignment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Could not update assignment' });
  }
});

// DELETE /api/v1/assignments/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM assignments WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete assignment' });
  }
});

module.exports = router;
