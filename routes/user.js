const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user');

// register a new user
router.post('/', userValidationRules.registerRules, userController.register);


module.exports = router;