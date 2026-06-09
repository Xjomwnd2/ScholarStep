const jwt  = require('jsonwebtoken');
const pool = require('../config/db');

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });
  try {
    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result  = await pool.query(
      'SELECT id,name,email,role FROM users WHERE id=$1', [decoded.id]
    );
    if (!result.rows.length) return res.status(401).json({ error: 'User not found' });
    req.user = result.rows[0];
    next();
  } catch { res.status(401).json({ error: 'Invalid or expired token' }); }
};

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ error: 'Access denied' });
  next();
};
