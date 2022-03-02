/**
 * Photo Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');

 
 /**
  * Create photo validation rules
  */
 const createRules = [
    //Check if email is an email and if it exists
     body('title').exists().isLength({ min: 3 }),
	 body('url').exists().isURL(),
	 body('comment').optional().isLength({ min: 3 }),
     body('user_id').optional(),
 ];
 
 module.exports = {
     createRules,
 }