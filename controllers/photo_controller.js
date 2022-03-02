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
    await req.user.load('photos');

    res.status(200).send({
        status: 'success',
        data: {
            photos: req.user.related('photos'),
        },
    });
}

  /**
  * Get one photo
  *
  * GET /
  */
    
  
   const single_photo = async (req, res) => {
        await req.user.load('photos');

        const chosen_photo = await new models.Photo({ id: req.params.photoId })
        .fetch();
        
        const related_photos= req.user.related('photos');

        existing_photo =related_photos.find(photo => photo.id == chosen_photo.id);

        res.status(200).send({
            status: 'success',
            data: {
                existing_photo,
            },
        });
}


/**
  * Post a photo
  *
  * POST /
  */

 const create = async (req, res) => {
    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // get only the validated data from the request
    const userID = req.user.id;
    const validData = matchedData(req);
    validData.user_id=userID;
    console.log('This is the authorized user id:'+req.user.id)
    console.log('This is the validated title: '+validData.title);
    console.log('This is the validated user_id: '+validData.user_id);

    try {
        const photo = await new models.Photo(validData).save();
        debug("Created new photo successfully: %O", photo);

        console.log('This is the mysterious photo:'+photo);

        res.send({
            status: 'success',
            data: {
                url: validData.url,
                title: validData.title,
                comment: validData.comment,
                user_id: validData.user_id

            },
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new photo.',
        });
        throw error;
    }
}

  module.exports = {
    index,
    single_photo,
    create
}