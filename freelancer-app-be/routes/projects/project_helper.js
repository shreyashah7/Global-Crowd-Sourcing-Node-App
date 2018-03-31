// 'use strict';

// let validate = require("validate.js");
// let bluebird = require("bluebird");

// let Project = require('../../models/Project');

// /**
//  * @description To retrieved project by it's primary id
//  * @param projectId
//  * @returns {*} project object
//  */
// let getProjectById = function (projectId) {
//     //	Request param validation (projectId must be integer and project
//     // should exists with this id.)
//     if (!validate.isInteger(Number(projectId))) {
//         let error = new Error("Project id is not an integer");
//         error.status = 404;
//         throw error;
//     }
//     //  Fetch project
//     return Project
//         .where({ id: projectId })
//         .fetch({ require: true })
//         .then(function (project) {
//             return project;
//         })
//         .catch(Project.NotFoundError, function () {
//             //  if Project not found throw error
//             let error = new Error('Project not found with this id');
//             error.status = 404;
//             throw error;
//         });
// };

// module.exports.getProjectById = getProjectById;