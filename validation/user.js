/**
 * User Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');

 
 /**
  * Register User validation rules
  */
 const registerRules = [
    //Check if email is an email and if it exists
     body('email').isEmail().exists().custom(async value => {
        const user = await new models.User({ email: value }).fetch({ require: false });
        if (user) {
            return Promise.reject(`User with ID ${value} does not exist.`);
        } 
        return Promise.resolve();

    }),
     body('password').exists().isLength({ min: 6 }),
	 body('first_name').exists().isLength({ min: 3 }),
	 body('last_name').exists().isLength({ min: 3 }),
 ];
 
 module.exports = {
     registerRules,
 }