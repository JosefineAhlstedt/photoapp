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
    req.user.related('photos');

    const new_photos = await models.Photo.where('user_id', req.user.id).fetchAll({columns: ['id', 'url', 'title', 'comment']});

      

    res.status(200).send({
        status: 'success',
        data: new_photos,
        
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
        .fetch({columns: ['id', 'url', 'title', 'comment']});
        
        const related_photos= req.user.related('photos');

        existing_photo =related_photos.find(photo => photo.id == chosen_photo.id);

        if (existing_photo) {
            res.status(200).send({
                status: 'success',
                data: chosen_photo,
            });
            
        }
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
    console.log('This is the validated photo id '+req.query.id);

    try {
        const photo = await new models.Photo(validData).save();
        debug("Created new photo successfully: %O", photo);

        const new_photo = await models.Photo.where('url', req.body.url).fetch({columns: ['user_id', 'url', 'title', 'comment', 'id']});

        res.send({
            status: 'success',
            data: new_photo,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new photo.',
        });
        throw error;
    }
}

/**
  * Update a photo
  *
  * PUT /
  */

 const update_photo = async (req, res) => {
     //load the users photos
    await req.user.load('photos');

    //all the users photos
    const users_photos= req.user.related('photos');
    //check if the photo belongs to a user
    anvandare_photo =users_photos.find(photo => photo.id == req.params.photoId);

    const photo = await new models.Photo({ id: req.params.photoId }).fetch();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    const validData = matchedData(req);

    //If it does, fail
	if (!anvandare_photo) {
		return res.send({
			status: 'fail',
			data: 'Photo doesnt belong to user.',
		});
	}

    try {
        const updatedPhoto = await photo.save(validData);
        debug("Updated album successfully: %O", updatedPhoto);

        res.send({
            status: 'success',
            data: {
                updatedPhoto
            },
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating a new photo.',
        });
        throw error;
    }
}

  module.exports = {
    index,
    single_photo,
    create,
    update_photo
}