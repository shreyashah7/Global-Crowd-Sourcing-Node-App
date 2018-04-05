'use strict';

let resFormat = require("../../helpers/res_format");

var kafka = require('../../kafka/client');
/***
 *  Main function to get user route
 */
let routerFn = function (req, res, next) {

	let userId = req.body.userId;
	getTransactionDetails(userId)
		.then(function (transactions) {
			let resObj = new resFormat(transactions)
				.customMeta({
					message: 'Transactions retrieved successfully.'
				});
			return res.status(resObj.getStatus()).json(resObj.log());
		})
		.catch(function (error) {
			let resObj = new resFormat(error);
			return res.status(resObj.getStatus()).json(resObj.log());
		});

};

let getTransactionDetails = function (userId) {
	return new Promise(function (resolve, reject) {
		kafka.make_request('fl_request_topic', "getTransactionDetailsByUser", { userId: userId }, function (err, results) {
			if (err) {
				done(err, {});
			} else {
				if (results.value === null) {
					let error = new Error('Transaction not found with this id');
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
