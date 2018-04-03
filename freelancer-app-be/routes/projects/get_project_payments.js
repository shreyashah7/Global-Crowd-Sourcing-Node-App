'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
/**
 *  Main function to get project by ID along with bid information
 */
let projectPaymentInfoRouterFn = function (req, res, next) {
    let projectId = req.body.projectId;
    getProjectPaymentInfo(projectId)
        .then(function (projectModel) {
            let resObj = new resFormat(projectModel)
                .customMeta({
                    message: 'Transaction retrieved successfully.'
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });
};

let getProjectPaymentInfo = function (projectId) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getTotalPayedAmtByProject", { projectId: projectId }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Payment Info not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

module.exports.projectPaymentInfoRouterFn = projectPaymentInfoRouterFn;