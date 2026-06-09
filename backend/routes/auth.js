const router = require('express').Router();
const auth   = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', auth.register);
router.post('/login',    auth.login);
router.post('/logout',   protect, auth.logout);
router.get ('/me',       protect, auth.getMe);

module.exports = router;
