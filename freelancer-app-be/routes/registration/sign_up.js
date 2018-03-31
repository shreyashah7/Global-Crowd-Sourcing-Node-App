var kafka = require('../../kafka/client');
'use strict';

let resFormat = require("../../helpers/res_format");
let password_pattern = require('../../helpers/password_pattern');

let signUpRouterFn = function (req, res, next) {
	let container = {
		payload: req.body
	};
	return checkPasswordPattern(container)
		.then(function (container) {
			return checkUserExist(container);
		})
		.then(function (container) {
			return saveUserInDb(container);
		})
		.then(function (container) {
			let resObj = new resFormat(container.user)
				.customMeta({
					message: 'Your account has been created successfully.'
				});
			return res.status(resObj.getStatus()).json(resObj.log());
		})
		.catch(function (err) {
			let resObj = new resFormat(err);
			return res.status(resObj.getStatus()).json(resObj.log());
		});
};

let checkPasswordPattern = function (container) {
	return new Promise(function (resolve, reject) {
		if (!password_pattern.test(container.payload.password)) {
			let error = new Error("The password is too weak");
			error.status = 400;
			return reject(error);
		}
		resolve(container);
	});
};

let checkUserExist = function (container) {
	return new Promise(function (resolve, reject) {
		kafka.make_request('request_topic', "getUserByEmail", { email: container.payload.email }, function (err, results) {
			if (err) {
				done(err, {});
			} else {
				if (results.value != null) {
					let err = new Error("User Already Exist in the system with this email address.");
					err.status = 400;
					return reject(err);
				} else {
					resolve(container);
				}
			}
		});
	});
};

let saveUserInDb = function (container) {
	return new Promise(function (resolve, reject) {
		kafka.make_request('request_topic', "register",
			{
				email: container.payload.email,
				password: container.payload.password,
				firstName: container.payload.firstName,
				lastName: container.payload.lastName,
				role: container.payload.role
			},
			function (err, results) {
				if (err) {
					done(err, {});
				} else {
					container.user = results.value;
					return container;
				}
			});
		resolve(container);
	});
}

module.exports.signUpRouterFn = signUpRouterFn;
