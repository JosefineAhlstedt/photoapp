const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user');

/* Get all resources */
router.get('/', userController.index);

// register a new user
router.post('/', userValidationRules.registerRules, userController.register);


module.exports = router;