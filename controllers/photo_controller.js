/**
 * Photo Controller
 */

const bcrypt = require("bcrypt");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

/**
 * Get all resources
 *
 * GET /
 */

const index = async (req, res) => {
	await req.user.load("photos");
	req.user.related("photos");

	//Get the authorized users photos with the selected columns
	const new_photos = await models.Photo.where(
		"user_id",
		req.user.id
	).fetchAll({ columns: ["id", "url", "title", "comment"] });

	res.status(200).send({
		status: "success",
		data: new_photos,
	});
};

/**
 * Get one photo
 *
 * GET /
 */

const single_photo = async (req, res) => {
	await req.user.load("photos");

	//Get the users photos
	const related_photos = req.user.related("photos");

	//Look if the chosen photo is a photo the user owns
	existing_photo = related_photos.find(
		(photo) => photo.id == req.params.photoId
	);

	if (!existing_photo) {
		return res.status(404).send({
			status: "fail",
			data: "Photo doesnt belong to user or it doesn't exist.",
		});
	}

	//get the chosen album and the relationship with photos
	const chosen_photo = await new models.Photo({
		id: req.params.photoId,
	}).fetch({
		withRelated: ["albums"],
	});

	res.status(200).send({
		status: "success",
		data: chosen_photo,
	});
};

/**
 * Post a photo
 *
 * POST /
 */

const create = async (req, res) => {
	// check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	const userID = req.user.id;
	const validData = matchedData(req);
	validData.user_id = userID;

	try {
		//Save the new photo
		await new models.Photo(validData).save();

		//Get the new photo to show the chosen data/columns
		const new_photo = await models.Photo.where("url", req.body.url).fetch({
			columns: ["user_id", "url", "title", "comment", "id"],
		});

		res.status(200).send({
			status: "success",
			data: new_photo,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when creating a new photo.",
		});
		throw error;
	}
};

/**
 * Update a photo
 *
 * PUT /
 */

const update_photo = async (req, res) => {
	//load the user photo relation
	await req.user.load("photos");

	//all the users photos
	const users_photos = req.user.related("photos");

	//check if the photo belongs to a user
	anvandare_photo = users_photos.find(
		(photo) => photo.id == req.params.photoId
	);

	//Get the selected photo
	const photo = await new models.Photo({ id: req.params.photoId }).fetch();

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	const validData = matchedData(req);

	//If the selected photo couldn't be found in the users photos, fail
	if (!anvandare_photo) {
		return res.send({
			status: "fail",
			data: "Photo doesnt belong to user.",
		});
	}

	try {
		//Save the photo with updated data
		const updatedPhoto = await photo.save(validData);

		res.status(200).send({
			status: "success",
			data: {
				updatedPhoto,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when updating a new photo.",
		});
		throw error;
	}
};

module.exports = {
	index,
	single_photo,
	create,
	update_photo,
};
