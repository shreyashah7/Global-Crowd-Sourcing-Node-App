'use strict';

/***
 *  @fileOverview Configured all routes related to /user category.
 *  1. List Users
 *  2. Get User
 *  3. Create User
 *  4. Update User
 *  5. Delete User
 */
let express = require('express');
let router = express.Router();
let updateUser = require('./update_user');
let deleteUser = require('./delete_user');
let getUserDetails = require('./get_user');
let userHelper = require('./user_helper');

router.param('userId', attachUserDetails);

// Fetch logged in user's details
//
router.get('/user/:userId', getUserDetails.routerfn);
//
// To update user details.
//
router.put('/user/:userId', updateUser.updateRouterFn);

router.delete('/user', deleteUser.deleteRouterFn);

function attachUserDetails(req, res, next, userId) {
    req.userId = userId;
    next();
}

module.exports = router;
