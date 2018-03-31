'use strict';
var kafka = require('../../kafka/client');
/**
 * @description To retrieved user by it's primary id
 * @param userId
 * @returns {*} user object
 */
let getUserById = function (userId) {
    //	Request param validation (userId must be integer and user
    // should exists with this id.)
    //  Fetch user
    return fetchUser(userId)
        .then(function (user) {
            return user;
        })
        .catch(function () {
            let error = new Error('User not found with this id');
            error.status = 404;
            throw error;
        });
};

let fetchUser = function (userId) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getUserById", { userId: userId }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    console.log("inside null");
                    let error = new Error('User not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

module.exports.getUserById = getUserById;