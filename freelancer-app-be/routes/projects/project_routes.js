'use strict';

/***
 *  @fileOverview Configured all routes related to /project category.
 *  1. List Projects
 *  2. Get Project
 *  3. Create Project
 *  4. Update Project
 *  5. Delete Project
 */
let express = require('express');
let router = express.Router();
let updateProject = require('./update_project');
let createProject = require('./create_project');
let deleteProject = require('./delete_project');
let getProjectDetails = require('./get_project');
let projectHelper = require('./project_helper');
let auth = require('../../middleware/authentication');

router.param('projectId', attachProjectDetails);

router.param('searchStrng', attachSearchProjectDetails);
// Fetch project details by ID
router.get('/project/:projectId', auth.checkSession, getProjectDetails.projectRouterFn);
// Fetch all project details
router.get('/projects', auth.checkSession, getProjectDetails.allProjectRouterFn);

router.get('/searchprojects/:searchStrng', auth.checkSession, getProjectDetails.searchProjectRouterFn);
// Fetch all project details
router.post('/skillproject', auth.checkSession, getProjectDetails.skillProjectRouterFn);
// Fetch user projects
router.post('/userprojects', auth.checkSession, getProjectDetails.userProjectRouterFn);
// To update project details.
router.put('/project', auth.checkSession, updateProject.updateRouterFn);
// To create project details.
router.post('/project', auth.checkSession, createProject.createRouterFn);
// To delete project.
router.delete('/project', auth.checkSession, deleteProject.deleteRouterFn);

function attachProjectDetails(req, res, next, projectId) {
    req.projectId = projectId;
    next();
}
function attachSearchProjectDetails(req, res, next, searchStrng) {
    req.searchStrng = searchStrng;
    next();
}
module.exports = router;