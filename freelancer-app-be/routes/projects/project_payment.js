'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');

let projPaymentRouterFn = function (req, res, next) {
    projPayment(req.body)
        .then(function (updatedProject) {
            let resObj = new resFormat(updatedProject)
                .customMeta({
                    message: "Payment done successfully."
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });
};

let projPayment = function (project) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('fl_request_topic', "projPayment", {
            projectId: project.projectId,
            senderId: project.senderId,
            receiverId: project.receiverId,
            amount: project.amount,
            type: project.type
        }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Project not found with this id!');
                    error.status = 500;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

let getFreelancerDetails = function (freelancerId) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('fl_request_topic', "getUserById", { userId: freelancerId }, function (err, results) {
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

module.exports.projPaymentRouterFn = projPaymentRouterFn;