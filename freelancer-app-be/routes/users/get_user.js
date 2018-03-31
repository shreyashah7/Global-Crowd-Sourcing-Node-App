'use strict';

let resFormat = require("../../helpers/res_format");

var kafka = require('../../kafka/client');
/***
 *  Main function to get user route
 */
let routerFn = function (req, res, next) {

	let userId = req.userId;
	getUserById(userId)
		.then(function (userModel) {
			let resObj = new resFormat(userModel)
				.customMeta({
					message: 'User retrieved successfully.'
				});
			return res.status(resObj.getStatus()).json(resObj.log());
		})
		.catch(function (error) {
			let resObj = new resFormat(error);
			return res.status(resObj.getStatus()).json(resObj.log());
		});

};

let getUserById = function (userId) {
	return new Promise(function (resolve, reject) {
		kafka.make_request('request_topic', "getUserById", { userId: userId }, function (err, results) {
			if (err) {
				done(err, {});
			} else {
				if (results.value === null) {
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
module.exports.routerfn = routerFn;
