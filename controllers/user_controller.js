/**
 * Register Controller
 */

const bcrypt = require("bcrypt");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

/**
 * Register a new user
 *
 * POST /
 */

const register = async (req, res) => {
	// check for validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: "fail", data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	//generate hash for my password and overwrite it
	try {
		validData.password = await bcrypt.hash(validData.password, 10);
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown when hashing the password.",
		});
		throw error;
	}

	try {
		//Save the user with the hashed password
		await new models.User(validData).save();

		const new_user = await models.User.where("email", req.body.email).fetch(
			{ columns: ["email", "first_name", "last_name"] }
		);

		res.status(200).send({
			status: "success",
			data: new_user,
		});
	} catch (error) {
		res.status(500).send({
			status: "error",
			message: "Exception thrown in database when creating a new user.",
		});
		throw error;
	}
};

module.exports = {
	register,
};
