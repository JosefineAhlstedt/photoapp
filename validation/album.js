/**
 * Album Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');

 
 /**
  * Create photo validation rules
  */
 const createRules = [
    //Check if email is an email and if it exists
     body('title').exists().isLength({ min: 3 }),
     body('user_id').optional(),
 ];
 
 const add_photo_rules = [
    body('photo_id').exists().bail().custom(async value => {
        const photo = await new models.Photo({ id: value }).fetch({ require: false });
        if (!photo) {
            return Promise.reject(`Photo with ID ${value} does not exist.`);
        }

        return Promise.resolve();
    }),
];

 module.exports = {
     createRules,
     add_photo_rules
 }