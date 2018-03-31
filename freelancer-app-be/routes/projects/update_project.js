'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
/***
 *  Main function for update project route
 */
let updateRouterFn = function (req, res, next) {
    if (!!req.body._id) {
        updateProject(req.body)
            .then(function (updatedProject) {
                let resObj = new resFormat(updatedProject)
                    .customMeta({
                        message: "Project updated successfully."
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

let updateProject = function (project) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "updateProject", {
            _id: project._id,
            status: project.status,
            freelancer: project.freelancer
        }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('User not found with this id!');
                    error.status = 500;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

module.exports.updateRouterFn = updateRouterFn;