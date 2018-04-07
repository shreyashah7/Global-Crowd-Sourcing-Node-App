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
let uploadProjectFiles = require('./upload_project_files');
let downloadProjectFiles = require('./download_project_files');
let projectPayment = require('./project_payment');
let getProjectPayments = require('./get_project_payments');
let projectHelper = require('./project_helper');
let auth = require('../../middleware/authentication');

router.param('projectId', attachProjectDetails);

router.param('searchStrng', attachSearchProjectDetails);
// Fetch project details by ID
router.get('/project/:projectId', auth.checkSession, getProjectDetails.projectRouterFn);
// Fetch all project details
router.get('/projects', auth.checkSession, getProjectDetails.allProjectRouterFn);
// Search all project details with search string
router.get('/searchprojects/:searchStrng', auth.checkSession, getProjectDetails.searchProjectRouterFn);
// Fetch all project details with provided skills
router.post('/skillproject', auth.checkSession, getProjectDetails.skillProjectRouterFn);
// Fetch user projects
router.post('/userprojects', auth.checkSession, getProjectDetails.userProjectRouterFn);
// To update project details.
router.put('/project', auth.checkSession, updateProject.updateRouterFn);
// To create project details.
router.post('/project', auth.checkSession, createProject.createRouterFn);
// To delete project.
router.delete('/project', auth.checkSession, deleteProject.deleteRouterFn);
// To upload project file
router.post('/uploadfile', auth.checkSession, uploadProjectFiles.uploadRouterFn);
// To download project file
router.post('/downloadfile', auth.checkSession, downloadProjectFiles.downloadRouterFn);
// Save project payment details
router.post('/payment', auth.checkSession, projectPayment.projPaymentRouterFn);
// Fetch project payment Information
router.post('/payedamount', auth.checkSession, getProjectPayments.projectPaymentInfoRouterFn);

function attachProjectDetails(req, res, next, projectId) {
    req.projectId = projectId;
    next();
}
function attachSearchProjectDetails(req, res, next, searchStrng) {
    req.searchStrng = searchStrng;
    next();
}
module.exports = router;