const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation/photo');

/* Get all photos */
router.get('/', photoController.index);

/* Get a specific photo */
router.get('/:photoId', photoController.single_photo);

// create a photo
router.post('/', photoValidationRules.createRules, photoController.create);

// update a photo
router.put('/:photoId', photoValidationRules.updateRules, photoController.update_photo);


module.exports = router;