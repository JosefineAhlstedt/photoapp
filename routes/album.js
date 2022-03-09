const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/* Get all albums */
router.get('/', albumController.index);

/* Get a specific album */
router.get('/:albumId', albumController.single_album);

// create an album
router.post('/', albumValidationRules.createRules, albumController.create);

// add a photo in album
router.post('/:albumId/photos', albumValidationRules.add_photo_rules, albumController.add_photo);

//Update 
router.put('/:albumId', albumValidationRules.update_title, albumController.update_title);

module.exports = router;