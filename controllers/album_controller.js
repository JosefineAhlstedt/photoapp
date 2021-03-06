/**
 * Album Controller
 */

const bcrypt = require("bcrypt");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");
const { Album } = require("../models");

/**
 * Get all resources
 *
 * GET /
 */

const index = async (req, res) => {
	//Load the relationship between users and albums
	await req.user.load("albums");

	//Send the users album back
	res.status(200).send({
		status: "success",
		data: req.user.related("albums"),
	});
};

/**
 * Get one album
 *
 * GET /
 */

const single_album = async (req, res) => {
	await req.user.load("albums");

	//Get the users albums
	const related_albums = req.user.related("albums");

	//Look if the chosen album is a album the user owns
	existing_album = related_albums.find(
		(album) => album.id == req.params.albumId
	);

	//Check if the user owns the album
	if (!existing_album) {
		return res.status(404).send({
			status: "fail",
			data: "Album doesnt belong to user or it doesn't exist.",
		});
	}

	//get the chosen album and the relationship with photos
	const chosen_album = await new models.Album({
		id: req.params.albumId,
	}).fetch({
		withRelated: ["photos"],
	});

	res.status(200).send({
		status: "success",
		data: chosen_album,
	});
};

/**
 * Post an album
 *
 * POST /
 */

const create = async (req, res) => {
	//check for validation error
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	//get only the validated data from the request
	const validData = matchedData(req);
	//Make sure the id has a default value
	const userID = req.user.id;
	validData.user_id = userID;

	try {
		//Save the new album to databse
		await new models.Album(validData).save();

		//Fetching the newly created album
		const new_album = await models.Album.where(
			"title",
			req.body.title
		).fetch({ columns: ["user_id", "title", "id"] });

		//Show the new album
		res.status(200).send({
			status: "success",
			data: new_album,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when creating a new album.",
		});
		throw error;
	}
};

/**
 * Post a photo to an album
 *
 * POST /
 */

const add_photo = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	//Save the validated data
	const validData = matchedData(req);
	//load the users photo and album relation
	await req.user.load("photos");
	await req.user.load("albums");

	//all the users photos and albums
	const users_photos = req.user.related("photos");
	const users_albums = req.user.related("albums");

	//check if the album and photo belongs to a user
	anvandare_photo = users_photos.find(
		(photo) => photo.id == validData.photo_id
	);
	anvandare_album = users_albums.find(
		(album) => album.id == req.params.albumId
	);

	//Does the photo belong to user, if not so fail
	if (!anvandare_photo || !anvandare_album) {
		return res.status(404).send({
			status: "fail",
			data: "Album doesnt belong to user or doesn't exist.",
		});
	}

	//Fetching the selected album
	const album = await new models.Album({ id: req.params.albumId }).fetch({
		withRelated: ["photos"],
	});

	//Getting the photos inside the album
	const photos = album.related("photos");

	//Check if the photo I want to add exists in the album
	const existing_photo = photos.find(
		(photo) => photo.id == validData.photo_id
	);

	//Does it exist in the album, if so fail
	if (existing_photo) {
		return res.status(400).send({
			status: "fail",
			data: "Photo already exists.",
		});
	}

	//If the request is clear, attach the photo to the album
	try {
		await album.photos().attach(validData.photo_id);

		res.status(200).send({
			status: "success",
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message:
				"Exception thrown in database when adding a photo to a user.",
		});
		throw error;
	}
};

/**
 * Update album title
 *
 * PUT /
 */

const update_title = async (req, res) => {
	//load the users albums
	await req.user.load("albums");

	//all the users albums
	const users_albums = req.user.related("albums");

	//check if the album belongs to a user
	anvandare_album = users_albums.find(
		(album) => album.id == req.params.albumId
	);

	//Does the album belong to user, if not so fail
	if (!anvandare_album) {
		return res.status(400).send({
			status: "fail",
			data: "Album doesnt belong to user or doesn't exist.",
		});
	}

	// make sure album exists
	const album = await new models.Album({ id: req.params.albumId }).fetch();

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const updatedAlbum = await album.save(validData);

		res.status(200).send({
			status: "success",
			data: {
				updatedAlbum,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when updating a new album.",
		});
		throw error;
	}
};

module.exports = {
	index,
	single_album,
	create,
	add_photo,
	update_title,
};
