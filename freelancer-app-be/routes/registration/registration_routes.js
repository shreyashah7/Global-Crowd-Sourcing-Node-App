'use strict';

let express = require('express');
let router = express.Router();
let login = require('./login');
let signUp = require('./sign_up');
let logout = require('./logout');

//  User Login route
router.post('/login', login.loginRouterFn);
//  Sign up user
router.put('/signup', signUp.signUpRouterFn);

router.post('/logout', logout.logoutRouterFn);

module.exports = router;
