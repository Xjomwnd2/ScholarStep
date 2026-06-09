const router = require('express').Router();
const app    = require('../controllers/applications');
const { protect, restrictTo } = require('../middleware/auth');

router.post  ('/',            protect, restrictTo('student'), app.submit);
router.get   ('/mine',        protect, restrictTo('student'), app.getMine);
router.get   ('/',            protect, restrictTo('admin'),   app.getAll);
router.patch ('/:id/status',  protect, restrictTo('admin'),   app.updateStatus);
router.patch ('/:id/withdraw',protect, restrictTo('student'), app.withdraw);

module.exports = router;
