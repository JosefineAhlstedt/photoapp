const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/* Get all albums */
router.get('/', albumController.index);

/* Get a specific photo */
router.get('/:albumId', albumController.single_album);

// create an album
router.post('/', albumValidationRules.createRules, albumController.create);

router.post('/:albumId/photos', albumValidationRules.add_photo_rules, albumController.add_photo);

module.exports = router;