const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
//const userValidationRules = require('../validation/photo');

/* Get all photos */
router.get('/', photoController.index);

/* Get a specific photo */
router.get('/:photoId', photoController.single_photo);

// register a new user
//router.post('/', userValidationRules.registerRules, userController.register);


module.exports = router;