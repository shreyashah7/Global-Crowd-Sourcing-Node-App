'use strict';

/***
 *  @fileOverview Configured all routes related to /skills category.
 *  1. List All Skills
 */
let express = require('express');
let router = express.Router();
let getSkills = require('./get_skills');

router.get('/skills', getSkills.skillRouterFn);

module.exports = router;