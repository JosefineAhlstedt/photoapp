const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/register', require('./user'));
router.use('/photos', auth.basic, require('./photo'));

module.exports = router;
