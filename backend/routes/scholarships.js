const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.json({ scholarships: [], message: 'Scholarships endpoint ready' });
});

module.exports = router;