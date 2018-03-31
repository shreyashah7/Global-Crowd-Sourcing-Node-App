'use strict';

var kafka = require('../../kafka/client');
let resFormat = require("../../helpers/res_format");
/***
 *  Main function to get Skills route
 */
let skillRouterFn = function (req, res, next) {

    getAllSkills()
        .then(function (Skills) {
            let resObj = new resFormat(Skills)
                .customMeta({
                    message: 'Skills retrieved successfully.'
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });

};

let getAllSkills = function () {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getAllSkills", {}, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Skills are not available.');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

module.exports.skillRouterFn = skillRouterFn;