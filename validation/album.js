/**
 * Album Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');

 
 /**
  * Create album validation rules
  */
 const createRules = [
     body('title').exists().isLength({ min: 3 }),
     body('user_id').optional(),
 ];
 
 const add_photo_rules = [
    body('photo_id').exists().bail().custom(async value => {
        const photo = await new models.Photo({ id: value }).fetch({ require: false });
        if (!photo) {
            return Promise.reject(`Photo with ID ${value} does not exist.`);
        }

        console.log('This is the value'+value)

        return Promise.resolve();
    }),
];

const update_title = [
    body('title').exists().isLength({ min: 3 }),
];

 module.exports = {
     createRules,
     add_photo_rules,
     update_title
 }