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
     body('email').isEmail().exists(),
     body('password').exists().isLength({ min: 6 }),
	 body('first_name').exists().isLength({ min: 3 }),
	 body('last_name').exists().isLength({ min: 3 }),
 ];
 
 module.exports = {
     registerRules,
 }