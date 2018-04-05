'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
/***
 *  Main function for update project route
 */
let createRouterFn = function (req, res, next) {
    if (req.body.projectName != null) {
        createProject(req.body)
            .then(function (createdProejct) {
                let resObj = new resFormat(createdProejct)
                    .customMeta({
                        message: "Project created successfully."
                    });
                return res.status(resObj.getStatus()).json(resObj.log());
            })
            .catch(function (error) {
                let resObj = new resFormat(error);
                return res.status(resObj.getStatus()).json(resObj.log());
            });
    } else {
        let resObj = new resFormat().customMeta({
            message: "No Project Available."
        });
        return res.status(resObj.getStatus()).json(resObj.log());
    }
};

let createProject = function (project) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('fl_request_topic', "postProject",
            {
                projectName: project.projectName,
                description: project.description,
                jobType: project.jobType,
                jobRate: project.jobRate,
                skills: project.skills,
                employer: project.employer
            },
            function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.value);
                }
            });
    });
}

module.exports.createRouterFn = createRouterFn;