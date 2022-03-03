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
        data: {
            albums: req.user.related('albums'),
        },
    });
}

 /**
  * Get one album
  *
  * GET /
  */
    
  
  const single_album = async (req, res) => {

    const chosen_album = await new models.Album({ id: req.params.albumId })
    .fetch({withRelated:['photos']});

    res.status(200).send({
        status: 'success',
        data: {
            chosen_album
        },
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

        console.log('This is the mysterious photo:'+album);

        res.send({
            status: 'success',
            data: {
                title: validData.title,
                user_id: validData.user_id

            },
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
  * Post an album
  *
  * POST /
  */

 const add_photo = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	// fetch user and eager-load books relation
	const album = await new models.Album({ id: req.params.albumId })
    .fetch({withRelated:['photos']});

	// get the user's books
	const photos = album.related('photos');

	// check if book is already in the user's list of books
	const existing_book = photos.find(book => book.id == validData.photo_id);

	// if it already exists, bail
	if (existing_book) {
		return res.send({
			status: 'fail',
			data: 'Book already exists.',
		});
	}

	try {
		const result = await album.photos().attach(validData.photo_id);
		debug("Added book to user successfully: %O", result);

		res.send({
			status: 'success',
			data: null,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a book to a user.',
		});
		throw error;
	}
}

module.exports = {
    index,
    single_album,
    create,
    add_photo
}