const pool   = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, nationality, gpa, institution, field_of_study, bio } = req.body;
    const result = await pool.query(
      `UPDATE users SET name=$1,phone=$2,nationality=$3,gpa=$4,
       institution=$5,field_of_study=$6,bio=$7 WHERE id=$8
       RETURNING id,name,email,role,phone,nationality,gpa,institution,field_of_study,bio`,
      [name, phone, nationality, gpa, institution, field_of_study, bio, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await pool.query('SELECT password FROM users WHERE id=$1', [req.user.id]);
    if (!(await bcrypt.compare(currentPassword, result.rows[0].password)))
      return res.status(401).json({ error: 'Current password incorrect' });
    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password=$1 WHERE id=$2', [hashed, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,name,email,role,created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
