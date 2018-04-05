var kafka = require('../../kafka/client');
'use strict';
// Import helpers
let resFormat = require("../../helpers/res_format");
var auth = require('passport-local-authenticate');
var passport = require('passport');
var localStrategy = require("passport-local").Strategy;

// Main function to login user route
let loginRouterFn = function (req, res, next) {

	passport.authenticate('local', function (err, user, info) {
		if (err) {
			let resObj = new resFormat(err);
			return res.status(resObj.getStatus()).json(resObj.log());
		}
		if (!user) {
			let resObj = new resFormat(info);
			return res.status(resObj.getStatus()).json(resObj.log());
		} else {
			req.logIn(req.body, function (err) {
				if (err) {
					let error = new Error('Authentication failed');
					error.status = 401;
					let resObj = new resFormat(error);
					return res.status(resObj.getStatus()).json(resObj.log());
				}
				let resObj = new resFormat(user)
					.customMeta({
						message: 'You are logged In Successfully.'
					});
				return res.status(resObj.getStatus()).json(resObj.log());
			});
		}
	})(req, res);
};

let checkPassword = function (password, results) {
	return new Promise(function (resolve, reject) {
		auth.verify(password, results.password, function (err, doesMatch) {
			if (doesMatch) {
				resolve(results);
			} else {
				//  Send error if password mismatched
				let error = new Error('Invalid password');
				error.status = 500;
				return reject(error);
			}
		});
	});
}

let checkUserExist = function (email, password) {
	return new Promise(function (resolve, reject) {
		//  Check Email and password
		if (!email || !password) {
			//  Through error if email or password field are undefined
			let error = new Error('Email and password are both required');
			error.status = 500;
			return reject(error);
		}
		kafka.make_request('fl_request_topic', "login", { email: email }, function (err, results) {
			if (err) {
				done(err, {});
			} else {
				if (results.value === null) {
					let error = new Error('No such User Exists! Please try again.');
					error.status = 404;
					return reject(error);
				} else {
					resolve(results.value);
				}
			}
		});
	});
};

module.exports.loginRouterFn = loginRouterFn;

module.exports.checkPassword = checkPassword;

module.exports.checkUserExist = checkUserExist;
