'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
/***
 *  Main function for update user route
 */
let updateRouterFn = function (req, res, next) {
	if (req.body._id != null) {
		updateUser(req.body)
			.then(function (updatedUser) {
				let resObj = new resFormat(updatedUser)
					.customMeta({
						message: "User updated successfully."
					});
				return res.status(resObj.getStatus()).json(resObj.log());
			})
			.catch(function (error) {
				let resObj = new resFormat(error);
				return res.status(resObj.getStatus()).json(resObj.log());
			});
	} else {
		let resObj = new resFormat().customMeta({
			message: "No User Available."
		});
		return res.status(resObj.getStatus()).json(resObj.log());
	}
};

let updateUser = function (userObj) {
	return new Promise(function (resolve, reject) {
		kafka.make_request('fl_request_topic', "updateUser",
			{
				_id: userObj._id,
				firstName: userObj.firstName,
				lastName: userObj.lastName,
				email:userObj.email,
				phoneNumber: userObj.phoneNumber,
				aboutMe: userObj.aboutMe,
				skills: userObj.skills,
				avatar: userObj.avatar
			},
			function (err, results) {
				if (err) {
					done(err, {});
				} else {
					if (results.value === null) {
						let error = new Error('User not updated!');
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