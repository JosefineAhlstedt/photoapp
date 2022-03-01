const express = require('express');
const router = express.Router();
//const auth = require('../middlewares/auth');

/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'oh, hi' }});
});

router.use('/register', require('./user'));
router.use('/photos', require('./photo'));

module.exports = router;
