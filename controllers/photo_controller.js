/**
 * Photo Controller
 */

 const debug = require('debug')('photoapp:user_controller');
 const bcrypt = require('bcrypt');
 const { matchedData, validationResult } = require('express-validator');
 const models = require('../models');


  /**
  * Get all resources
  *
  * GET /
  */
 
   const index = async (req, res) => {
    const all_photos = await models.Photo.fetchAll();
  
    res.send({
      status: 'success',
      data: {
        users: all_photos
      }
    });
  }

  /**
  * Get one photo
  *
  * GET /
  */
   const single_photo = async (req, res) => {
    const photo = await new models.Photo({ id: req.params.photoId })
        .fetch();

    res.send({
        status: 'success',
        data: {
            photo,
        }
    });
}

  module.exports = {
    index,
    single_photo
}