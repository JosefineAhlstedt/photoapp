const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/register', require('./user'));
router.use('/photos', auth.basic, require('./photo'));
router.use('/albums', auth.basic, require('./album'));

module.exports = router;
