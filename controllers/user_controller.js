/**
 * Register Controller
 */

 const debug = require('debug')('photoapp:user_controller');
 const bcrypt = require('bcrypt');
 const { matchedData, validationResult } = require('express-validator');
 const models = require('../models');


  /**
  * Get all resources
  *
  * GET /
  */
 
   const index = async (req, res) => {
    const all_users = await models.User.fetchAll();
  
    res.send({
      status: 'success',
      data: {
        users: all_users
      }
    });
  }
  

 /**
  * Register a new user
  *
  * POST /
  */
  
  const register = async (req, res) => {
    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // get only the validated data from the request
    const validData = matchedData(req);

    console.log("The validated data:", validData);

    // generate a hash of `validData.password`
    // and overwrite `validData.password` with the generated hash
    try {
        validData.password = await bcrypt.hash(validData.password, 10);

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when hashing the password.',
        });
        throw error;
    }

    try {
        const user = await new models.User(validData).save();
        debug("Created new user successfully: %O", user);

        res.send({
            status: 'success',
            data: {
                user
            },
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new user.',
        });
        throw error;
    }
}






  module.exports = {
    index,
    register
}
 