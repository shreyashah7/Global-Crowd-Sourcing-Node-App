'use strict';

var kafka = require('../../kafka/client');
let resFormat = require("../../helpers/res_format");
/***
 *  Main function to get bids route
 */

let getAllUserBidsByProject = function (projectId) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('fl_request_topic', "getAllUserBidsByProject", { projectId: projectId }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Users not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

let bidRouterFn = function (req, res, next) {

    let projectId = req.projectId;
    getAllUserBidsByProject(projectId)
        .then(function (bids) {
            let resObj = new resFormat(bids)
                .customMeta({
                    message: 'Bids retrieved successfully.'
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });
};

module.exports.bidRouterFn = bidRouterFn;