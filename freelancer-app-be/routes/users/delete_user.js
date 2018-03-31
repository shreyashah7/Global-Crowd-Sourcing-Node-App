'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
/***
 *  Main function for update project route
 */
let deleteRouterFn = function (req, res, next) {
    deleteUser()
        .then(function () {
            let resObj = new resFormat()
                .customMeta({
                    message: "User deleted successfully."
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });

};

let deleteUser = function () {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "deleteUser", {}, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Cannot delete User!');
                    error.status = 500;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

module.exports.deleteRouterFn = deleteRouterFn;