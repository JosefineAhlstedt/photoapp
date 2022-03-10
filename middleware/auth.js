/**
 * Authentication Middleware
 */

const bcrypt = require("bcrypt");
const debug = require("debug")("photoapp:auth");
const { User } = require("../models");

/**
 * HTTP Basic Authentication
 */
const basic = async (req, res, next) => {
	debug("Hello from auth.basic!");

	// chech if the header exists
	if (!req.headers.authorization) {
		debug("Authorization header missing");

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		});
	}

	//Split the header into two variables
	const [authSchema, base64Payload] = req.headers.authorization.split(" ");

	// check if authSchema isn't "basic", if so then bail
	if (authSchema.toLowerCase() !== "basic") {
		debug("Authorization schema isn't basic");

		return res.status(401).send({
			status: "fail",
			data: "Authorization required",
		});
	}

	// decode the payload
	const decodedPayload = Buffer.from(base64Payload, "base64").toString(
		"ascii"
	);

	// split into "<email>:<password>"
	const [email, password] = decodedPayload.split(":");

	// find user with the selected email
	const user = await new User({ email }).fetch({ require: false });
	if (!user) {
		return res.status(401).send({
			status: "fail",
			data: "Authorization failed",
		});
	}

	//get the hash
	const hash = user.get("password");

	//compare the passwords from the client and the server if they match, using salt
	const result = await bcrypt.compare(password, hash);
	if (!result) {
		return res.status(401).send({
			status: "fail",
			data: "Authorization failed",
		});
	}

	// save the user
	req.user = user;

	next();
};

module.exports = {
	basic,
};
