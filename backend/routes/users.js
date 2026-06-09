const router = require('express').Router();
const u      = require('../controllers/users');
const { protect, restrictTo } = require('../middleware/auth');

router.get   ('/profile',         protect, u.getProfile);
router.put   ('/profile',         protect, u.updateProfile);
router.put   ('/change-password', protect, u.changePassword);
router.get   ('/',                protect, restrictTo('admin'), u.getAllUsers);
router.delete('/:id',             protect, restrictTo('admin'), u.deleteUser);

module.exports = router;
