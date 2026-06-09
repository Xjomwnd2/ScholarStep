const router = require('express').Router();
const sc     = require('../controllers/scholarships');
const { protect, restrictTo } = require('../middleware/auth');

router.get   ('/',    sc.getAll);
router.get   ('/:id', sc.getOne);
router.post  ('/',    protect, restrictTo('admin'), sc.create);
router.put   ('/:id', protect, restrictTo('admin'), sc.update);
router.delete('/:id', protect, restrictTo('admin'), sc.remove);

module.exports = router;
