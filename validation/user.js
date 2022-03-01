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
     //body('email').isEmail().exists(),
     body('email').exists().isLength({ min: 4 }),
     body('password').exists().isLength({ min: 4 }),
	 body('first_name').exists().isLength({ min: 2 }),
	 body('last_name').exists().isLength({ min: 2 }),
 ];
 
 module.exports = {
     registerRules,
 }