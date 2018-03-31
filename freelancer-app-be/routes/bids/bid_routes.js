'use strict';

/***
 *  @fileOverview Configured all routes related to /bids category.
 *  1. Create User Project Info
 */
let express = require('express');
let router = express.Router();
let auth = require('../../middleware/authentication');
let saveBid = require('../bids/save_bid');
let getBids = require('../bids/get_bids');
let projectHelper = require('../projects/project_helper');

router.param('projectId', attachProjectDetails);
//
// To create user project details.
//
router.post('/placebid', auth.checkSession, saveBid.createRouterFn);

router.get('/bids/:projectId', auth.checkSession, getBids.bidRouterFn);


function attachProjectDetails(req, res, next, projectId) {
    req.projectId = projectId;
    next();
}

module.exports = router;