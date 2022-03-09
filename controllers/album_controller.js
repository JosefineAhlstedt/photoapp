/**
 * Album Controller
 */

 const debug = require('debug')('photoapp:album_controller');
 const bcrypt = require('bcrypt');
 const { matchedData, validationResult } = require('express-validator');
 const models = require('../models');
 const { Album } = require('../models');

 /**
  * Get all resources
  *
  * GET /
  */

  const index = async (req, res) => {
    await req.user.load('albums');

    res.status(200).send({
        status: 'success',
        data: req.user.related('albums'),
    });
}

 /**
  * Get one album
  *
  * GET /
  */
    
  
  const single_album = async (req, res) => {

    const chosen_album = await new models.Album({ id: req.params.albumId })
    .fetch({
        withRelated:[{
            'photos':function (qb) {
                qb.columns('url', 'title', 'comment', 'user_id')
            }
        }]
    }).then(function(classified) {
        res.json(classified.toJSON({ omitPivot: true }));
      });    
    
    res.status(200).send({
        status: 'success',
        data: chosen_album,
    });
}

/**
  * Post an album
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
        const album = await new models.Album(validData).save();
        debug("Created new photo successfully: %O", album);

        const new_album = await models.Album.where('title', req.body.title).fetch({columns: ['user_id', 'title', 'id']});


        res.send({
            status: 'success',
            data: new_album,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new album.',
        });
        throw error;
    }
}

/**
  * Post a photo to an album
  *
  * POST /
  */

 const add_photo = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	const validData = matchedData(req);
    //load the users photo and album relation
    await req.user.load('photos');
    await req.user.load('albums');

    //all the users photos and albums
    const users_photos= req.user.related('photos');
    const users_albums= req.user.related('albums');

    //check if the photo belongs to a user
    anvandare_photo =users_photos.find(photo => photo.id == validData.photo_id);
    //check if the album belongs to a user
    anvandare_album =users_albums.find(album => album.id == req.params.albumId );

    //Fetching the selected album
	const album = await new models.Album({ id: req.params.albumId }).fetch({withRelated:['photos']});

    //Getting the photos inside the album
	const photos = album.related('photos');

    //Check if the photo I want to add exists in the album
	const existing_photo = photos.find(photo => photo.id == validData.photo_id);

    //If it does, fail
	if (existing_photo) {
		return res.send({
			status: 'fail',
			data: 'Photo already exists.',
		});
	}

    //If it does, fail
	if (!anvandare_photo) {
		return res.send({
			status: 'fail',
			data: 'Photo doesnt belong to user.',
		});
	}

    //If it does, fail
	if (!anvandare_album) {
		return res.send({
			status: 'fail',
			data: 'Album doesnt belong to user.',
		});
	}

    //If it does not, insert the photo to the album
	try {
		const result = await album.photos().attach(validData.photo_id);
		debug("Added photo to user successfully: %O", result);

		res.send({
			status: 'success',
			data: null,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to a user.',
		});
		throw error;
	}
}

/**
  * Update album title
  *
  * PUT /
  */

 const update_title = async (req, res) => {

    // make sure album exists
    const album = await new models.Album({ id: req.params.albumId }).fetch();

    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // get only the validated data from the request
    const validData = matchedData(req);


    try {
        const updatedAlbum = await album.save(validData);
        debug("Updated album successfully: %O", updatedAlbum);

        res.send({
            status: 'success',
            data: {
                updatedAlbum
            },
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating a new album.',
        });
        throw error;
    }
}


module.exports = {
    index,
    single_album,
    create,
    add_photo,
    update_title
}