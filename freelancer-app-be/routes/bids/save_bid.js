'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
/***
 *  Main function for update project route
 */
let createRouterFn = function (req, res, next) {
    if (req.body.userId != null && req.body.projectId != null) {
        saveBid(req.body)
            .then(function (createdBid) {
                let resObj = new resFormat(createdBid)
                    .customMeta({
                        message: "Bid created successfully."
                    });
                return res.status(resObj.getStatus()).json(resObj.log());
            })
            .catch(function (error) {
                let resObj = new resFormat(error);
                return res.status(resObj.getStatus()).json(resObj.log());
            });
    } else {
        let resObj = new resFormat().customMeta({
            message: "No Bid Info Available."
        });
        return res.status(resObj.getStatus()).json(resObj.log());
    }
};

let saveBid = function (bidObj) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('fl_request_topic', "saveBid",
            {
                userId: bidObj.userId,
                projectId: bidObj.projectId,
                bidRate: bidObj.bidRate,
                bidLimit: bidObj.bidLimit,
                bidType: bidObj.bidType
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