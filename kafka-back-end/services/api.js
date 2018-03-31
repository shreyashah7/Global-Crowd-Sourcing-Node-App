var mongo = require('./mongo');
var ObjectId = require('mongodb').ObjectID;
var auth = require('passport-local-authenticate');
const url = 'mongodb://admin:admin@ds121189.mlab.com:21189/freelancerdb';

function handle_request(msg, callback) {
	var mergedLine = "";
	if (msg.key == "register") {
		console.log("--------register -----------------")
		var res = {};
		mongo.connect(url, function (db) {
			auth.hash(msg.value.password, function (err, password) {
				db.collection("users").insert(
					{
						password: password,
						firstName: msg.value.firstName,
						lastName: msg.value.lastName,
						email: msg.value.email,
						role: Number(msg.value.role)
					},
					function (err, rows) {
						if (err) throw err;
						res.value = rows.ops;
						callback(null, res);
					});
			});
		});
	} else if (msg.key == "login") {
		console.log("inside login------------")
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('users').find({ email: msg.value.email }).toArray(function (err, result) {
				if (err) throw err;
				if (result != undefined && result.length == 1) {
					console.log("result :", result);
					data = {
						firstName: result[0].firstName,
						lastName: result[0].lastName,
						email: result[0].email,
						role: result[0].role,
						password: result[0].password,
						skills: result[0].skills,
						_id: result[0]._id,
						phoneNumber: result[0].phoneNumber,
						aboutMe: result[0].aboutMe,
						avatar: result[0].avatar
					};
					res.value = data;
					callback(null, res);
				} else {
					data = null;
					res.value = data;
					callback(null, res);
				}
			});
		});
	} else if (msg.key == "updateUser") {
		var res = {};
		mongo.connect(url, function (db) {
			db.collection("users").update({ _id: ObjectId(msg.value._id) }, {
				$set: {
					firstName: msg.value.firstName,
					lastName: msg.value.lastName,
					email: msg.value.email,
					phoneNumber: msg.value.phoneNumber,
					aboutMe: msg.value.aboutMe,
					skills: msg.value.skills,
					avatar: msg.value.avatar
				}
			}, function (err, rows) {
				if (err) throw err;
				var res = {};
				res.value = msg.value;
				callback(null, res);
			});
		});
	} else if (msg.key == "getUserByEmail") {
		console.log("--------getUserByEmail -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('users').find({ email: msg.value.email }).toArray(function (err, rows) {
				if (err) throw err;
				var data;
				if (rows != undefined && rows.length > 0) {
					data = {
						_id: rows[0]._id,
						firstName: rows[0].firstName,
						lastName: rows[0].lastName,
						email: rows[0].email,
						phoneNumber: rows[0].phoneNumber,
						skills: rows[0].skills,
						avatar: rows[0].avatar,
						role: rows[0].role,
						aboutMe: rows[0].aboutMe
					};
				} else {
					data = null;
				}
				res.value = data;
				callback(null, res);
			});
		});
	} else if (msg.key == "getUserById") {
		console.log("--------getUserById -----------------", msg.value.userId);
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('users').find({ _id: ObjectId(msg.value.userId) }).toArray(function (err, rows) {
				if (err) throw err;
				var data;
				if (rows != undefined && rows.length > 0) {
					data = {
						_id: rows[0]._id,
						firstName: rows[0].firstName,
						lastName: rows[0].lastName,
						email: rows[0].email,
						phoneNumber: rows[0].phoneNumber,
						skills: rows[0].skills,
						avatar: rows[0].avatar,
						role: rows[0].role,
						aboutMe: rows[0].aboutMe
					};
				} else {
					data = null;
				}
				res.value = data;
				callback(null, res);
			});
		});
	} else if (msg.key == "getAllSkills") {
		console.log("--------getAllSkills -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('skills').find({}).toArray(function (err, rows) {
				if (err) throw err;
				var data = [];
				if (rows != undefined && rows.length > 0) {
					for (var i = 0; i < rows.length; i++) {
						skillObj = {
							_id: rows[i]._id,
							skillName: rows[i].skillName
						};
						data.push(skillObj);
					}
				} else {
					data = null;
				}
				res.value = data;
				callback(null, res);
			});
		});
	} else if (msg.key == "postProject") {
		console.log("--------postProject -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection("projects").insert(
				{
					projectName: msg.value.projectName,
					description: msg.value.description,
					jobType: msg.value.jobType,
					jobRate: Number(msg.value.jobRate),
					skills: msg.value.skills,
					employer: ObjectId(msg.value.employer),
					status: "OPEN",
					createdAt: new Date()
				},
				function (err, rows) {
					if (err) throw err;
					data = rows;
					res.value = rows.ops;
					callback(null, res);
				});
		});
	} else if (msg.key == "updateProject") {
		var res = {};
		mongo.connect(url, function (db) {
			db.collection("projects").update({ _id: ObjectId(msg.value._id) }, {
				$set: {
					status: msg.value.status,
					freelancer: ObjectId(msg.value.freelancer)
				}
			}, function (err, rows) {
				if (err) throw err;
				var res = {};
				res.value = msg.value;
				callback(null, res);
			});
		});
	} else if (msg.key == "getEmployerProjects") {
		console.log("--------getEmployerProjects -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('projects').find({ employer: msg.value.userId }).toArray(function (err, rows) {
				if (err) throw err;
				var data = [];
				if (rows != undefined && rows.length > 0) {
					for (var i = 0; i < rows.length; i++) {
						projectObj = {
							_id: rows[i]._id,
							projectName: rows[i].projectName,
							status: rows[i].status,
							description: rows[i].description,
							jobType: rows[i].jobType,
							jobRate: rows[i].jobRate,
							skills: rows[i].skills,
							employer: rows[i].employer,
							freelancer: rows[i].freelancer,
							createdAt: rows[i].createdAt
						};
						data.push(projectObj);
					}
				} else {
					data = null;
				}
				res.value = data;
				callback(null, res);
			});
		});
	} else if (msg.key == "getAllSkillProjects") {
		console.log("--------getAllSkillProjects -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('projects').find({
				"status": "OPEN"
			}).toArray(function (err, rows) {
				if (err) throw err;
				var data = [];
				if (rows != undefined && rows.length > 0) {
					for (let i = 0; i < rows.length; i++) {
						let skillset = rows[i].skills.split(',');
						let count = 0;
						for (let userSkill = 0; userSkill < msg.value.skills.length; userSkill++) {
							if (skillset.indexOf(msg.value.skills[userSkill]) > -1) {
								count++;
							}
							if (count >= 3) {
								break;
							}
						}
						if (count >= 3) {
							projectObj = {
								_id: rows[i]._id,
								projectName: rows[i].projectName,
								status: rows[i].status,
								description: rows[i].description,
								jobType: rows[i].jobType,
								jobRate: rows[i].jobRate,
								skills: rows[i].skills,
								employer: rows[i].employer,
								freelancer: rows[i].freelancer,
								createdAt: rows[i].createdAt
							};
							data.push(projectObj);
						}
					}
					let projectIds = data.map(function (item) { return item._id; });
					db.collection('userProjects').aggregate([
						{
							$match:
								{
									'projectId':
										{ $in: projectIds }
								}
						},
						{
							$group: {
								"_id": "$projectId",
								"bidCount": { $sum: 1 },
								"avgRate": { $avg: "$bidRate" }
							}
						}
					]).toArray(function (err, rows) {
						if (!!rows && rows.length > 0) {
							for (let i = 0; i < data.length; i++) {
								for (let j = 0; j < rows.length; j++) {
									if (data[i]._id.equals(rows[j]._id)) {
										data[i].bidCount = rows[j].bidCount;
										data[i].avgRate = rows[j].avgRate;
									}
								}
							}
							res.value = data;
							callback(null, res);
						} else {
							res.value = data;
							callback(null, res);
						}
					});

				} else {
					data = null;
					res.value = data;
					callback(null, res);
				}

			});
		});
	} else if (msg.key == "getAllOpenProjects") {
		console.log("--------getAllOpenProjects -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('projects').find({ status: "OPEN" }).toArray(function (err, rows) {
				if (err) throw err;
				var data = [];
				if (rows != undefined && rows.length > 0) {
					let projectIds = rows.map(function (item) { return item._id; });
					for (var i = 0; i < rows.length; i++) {
						projectObj = {
							_id: rows[i]._id,
							projectName: rows[i].projectName,
							status: rows[i].status,
							description: rows[i].description,
							jobType: rows[i].jobType,
							jobRate: rows[i].jobRate,
							skills: rows[i].skills,
							employer: rows[i].employer,
							freelancer: rows[i].freelancer,
							createdAt: rows[i].createdAt
						};
						data.push(projectObj);
					}
					db.collection('userProjects').aggregate([
						{
							$match:
								{
									'projectId':
										{ $in: projectIds }
								}
						},
						{
							$group: {
								"_id": "$projectId",
								"bidCount": { $sum: 1 },
								"avgRate": { $avg: "$bidRate" }
							}
						}
					]).toArray(function (err, rows) {
						if (!!rows && rows.length > 0) {
							for (let i = 0; i < data.length; i++) {
								for (let j = 0; j < rows.length; j++) {
									if (data[i]._id.equals(rows[j]._id)) {
										data[i].bidCount = rows[j].bidCount;
										data[i].avgRate = rows[j].avgRate;
									}
								}
							}
							res.value = data;
							callback(null, res);
						} else {
							res.value = data;
							callback(null, res);
						}
					});

				} else {
					data = null;
					res.value = data;
					callback(null, res);
				}

			});
		});
	} else if (msg.key == "getAllSearchProjects") {
		console.log("--------getAllSearchProjects -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('projects').find({ "projectName": { $regex: msg.value.searchStrng } }).toArray(function (err, rows) {
				if (err) throw err;
				var data = [];
				if (rows != undefined && rows.length > 0) {
					let projectIds = rows.map(function (item) { return item._id; });
					for (var i = 0; i < rows.length; i++) {
						projectObj = {
							_id: rows[i]._id,
							projectName: rows[i].projectName,
							status: rows[i].status,
							description: rows[i].description,
							jobType: rows[i].jobType,
							jobRate: rows[i].jobRate,
							skills: rows[i].skills,
							employer: rows[i].employer,
							freelancer: rows[i].freelancer,
							createdAt: rows[i].createdAt
						};
						data.push(projectObj);
					}
					db.collection('userProjects').aggregate([
						{
							$match:
								{
									'projectId':
										{ $in: projectIds }
								}
						},
						{
							$group: {
								"_id": "$projectId",
								"bidCount": { $sum: 1 },
								"avgRate": { $avg: "$bidRate" }
							}
						}
					]).toArray(function (err, rows) {
						if (!!rows && rows.length > 0) {
							for (let i = 0; i < data.length; i++) {
								for (let j = 0; j < rows.length; j++) {
									if (data[i]._id.equals(rows[j]._id)) {
										data[i].bidCount = rows[j].bidCount;
										data[i].avgRate = rows[j].avgRate;
									}
								}
							}
							res.value = data;
							callback(null, res);
						} else {
							res.value = data;
							callback(null, res);
						}
					});

				} else {
					data = null;
					res.value = data;
					callback(null, res);
				}

			});
		});
	} else if (msg.key == "getFreelancerProjects") {
		console.log("--------getFreelancerProjects -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('userProjects')
				.aggregate([
					{
						$match:
							{
								'userId':
									{ $eq: ObjectId(msg.value.userId) }
							}
					},
					{ $project: { projectId: 1, bidRate: 1, bidType: 1 } }
				]).toArray(function (err, rows) {
					if (err) throw err;
					var data = [];
					if (rows != undefined && rows.length > 0) {
						let projectIds = rows.map(function (item) { return item.projectId; });
						for (var i = 0; i < rows.length; i++) {
							projectObj = {
								_id: rows[i].projectId,
								bidRate: rows[i].bidRate,
								bidType: rows[i].bidType
							};
							data.push(projectObj);
						}
						db.collection('projects').find({ _id: { $in: projectIds } })
							.toArray(function (err, rows) {
								if (!!rows && rows.length > 0) {
									for (let i = 0; i < data.length; i++) {
										for (let j = 0; j < rows.length; j++) {
											if (data[i]._id.equals(rows[j]._id)) {
												data[i]._id = rows[j]._id,
													data[i].projectName = rows[j].projectName,
													data[i].status = rows[j].status,
													data[i].description = rows[j].description,
													data[i].jobType = rows[j].jobType,
													data[i].jobRate = rows[j].jobRate,
													data[i].skills = rows[j].skills,
													data[i].employer = rows[j].employer,
													data[i].freelancer = rows[j].freelancer,
													data[i].createdAt = rows[j].createdAt
											}
										}
									}
									res.value = data;
									callback(null, res);
								} else {
									res.value = data;
									callback(null, res);
								}
							});

					} else {
						data = null;
						res.value = data;
						callback(null, res);
					}

				});
		});
	} else if (msg.key == "getProjectDetailsById") {
		console.log("--------getProjectDetailsById -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('projects').find({ _id: ObjectId(msg.value.projectId) }).toArray(function (err, rows) {
				if (err) throw err;
				var data = {};
				if (rows != undefined && rows != null) {
					let projectIds = rows.map(function (item) { return item._id; });
					data = {
						_id: rows[0]._id,
						projectName: rows[0].projectName,
						status: rows[0].status,
						description: rows[0].description,
						jobType: rows[0].jobType,
						jobRate: rows[0].jobRate,
						skills: rows[0].skills,
						employer: rows[0].employer,
						freelancer: rows[0].freelancer,
						createdAt: rows[0].createdAt
					}
					db.collection('userProjects').aggregate([
						{
							$match:
								{
									'projectId':
										{ $in: projectIds }
								}
						}, {
							$group: {
								"_id": "$projectId",
								"bidCount": { $sum: 1 },
								"avgRate": { $avg: "$bidRate" }
							}
						}
					]).toArray(function (err, rows) {
						if (rows != undefined && rows != null && rows.length > 0) {
							data.bidCount = !!rows[0].bidCount ? rows[0].bidCount : 0;
							data.avgRate = rows[0].avgRate;
							res.value = data;
							callback(null, res);
						} else {
							res.value = data;
							callback(null, res);
						}
					});
				} else {
					data = null;
					res.value = data;
					callback(null, res);
				}
			});
		});
	} else if (msg.key == "getAllUserBidsByProject") {
		console.log("--------getAllUserBidsByProject -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection('userProjects')
				.aggregate([
					{
						$match:
							{
								'projectId':
									{ $eq: ObjectId(msg.value.projectId) }
							}
					},
					{ $project: { userId: 1, bidRate: 1, bidType: 1, createdAt: 1 } }
				]).toArray(function (err, rows) {
					if (err) throw err;
					var data = [];
					if (rows != undefined && rows.length > 0) {
						let userIds = rows.map(function (item) { return item.userId; });
						for (var i = 0; i < rows.length; i++) {
							projectObj = {
								_id: rows[i].userId,
								bidRate: rows[i].bidRate,
								bidType: rows[i].bidType
							};
							data.push(projectObj);
						}
						db.collection('users').find({ _id: { $in: userIds } })
							.toArray(function (err, rows) {
								if (!!rows && rows.length > 0) {
									for (let i = 0; i < data.length; i++) {
										for (let j = 0; j < rows.length; j++) {
											if (data[i]._id.equals(rows[j]._id)) {
												data[i]._id = rows[j]._id,
													data[i].firstName = rows[j].firstName,
													data[i].lastName = rows[j].lastName,
													data[i].userName = rows[j].firstName + " " + rows[j].lastName,
													data[i].skills = rows[j].skills,
													data[i].avatar = rows[j].avatar
											}
										}
									}
									res.value = data;
									callback(null, res);
								} else {
									res.value = data;
									callback(null, res);
								}
							});

					} else {
						data = null;
						res.value = data;
						callback(null, res);
					}

				});
		});
	} else if (msg.key == "saveBid") {
		console.log("--------saveBid -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection("userProjects").insert(
				{
					userId: ObjectId(msg.value.userId),
					projectId: ObjectId(msg.value.projectId),
					bidRate: Number(msg.value.bidRate),
					bidLimit: Number(msg.value.bidLimit),
					bidType: msg.value.bidType,
					createdAt: new Date()
				},
				function (err, rows) {
					if (err) throw err;
					data = rows;
					res.value = rows.ops;
					callback(null, res);
				});
		});
	} else if (msg.key == "deleteUser") {
		console.log("--------deleteUser -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection("users").remove({ "email": /^test/ },
				function (err, rows) {
					if (err) throw err;
					res.value = rows;
					callback(null, res);
				});
		});
	} else if (msg.key == "deleteProject") {
		console.log("--------deleteProject -----------------");
		var res = {};
		var data = {};
		mongo.connect(url, function (db) {
			db.collection("projects").remove({ "projectName": /^Test/ },
				function (err, rows) {
					if (err) throw err;
					res.value = rows;
					callback(null, res);
				});
		});
	}
	// let db = getDbConnection();

	// }
	//  else if (msg.key == "updateUserData") {
	// 	var res = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("usertable").update({ userId: msg.value.userId }, {
	// 		$set: {
	// 			userId: msg.value.userId, userOverview: msg.value.userOverview, workData: msg.value.workData, educationData: msg.value.educationData,
	// 			contactNumber: msg.value.contactNumber, interests: msg.value.interests
	// 		}
	// 	}, function (err, rows) {
	// 		if (err) throw err;
	// 		res.code = "200";
	// 		data = {
	// 			success: true,
	// 			message: 'User data updated successfully!'
	// 		};
	// 		res.value = data;
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "createFolder") {
	// 	var res = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").insert({
	// 		fileId: msg.value.fileId, parentFileId: msg.value.parentFileId, fileName: msg.value.fileName, viewers: msg.value.viewers, owners: msg.value.owners, starred: msg.value.starred,
	// 		isActive: msg.value.isActive, isFile: msg.value.isFile, path: msg.value.path
	// 	}, function (err, rows) {
	// 		db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "New folder created : " + msg.value.fileName });
	// 		if (err) throw err;
	// 		var data = {
	// 			success: true,
	// 			message: 'New folder created : ' + msg.value.fileName
	// 		};
	// 		res.code = "200";
	// 		res.value = data;
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "getRecentFileList") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").find({ isActive: msg.value.isActive, viewers: { $in: [msg.value.userId] } }).sort({ $natural: 1 }).toArray(function (err, rows) {
	// 		if (err) throw err;
	// 		if (rows != undefined && rows.length > 0) {
	// 			for (var i = 0; i < rows.length; i++) {
	// 				dataFrame = {
	// 					fileName: rows[i].fileName,
	// 					fileId: rows[i].fileId,
	// 					parentFileId: rows[i].parentFileId,
	// 					isActive: rows[i].isActive,
	// 					isFile: rows[i].isFile,
	// 					owners: rows[i].owners,
	// 					viewers: rows[i].viewers,
	// 					starred: rows[i].starred,
	// 					isGroup: rows[i].isGroup,
	// 					path: rows[i].path,
	// 					_id: rows[i]._id
	// 				};
	// 				data.push(dataFrame);
	// 			}
	// 		}
	// 		res.code = "200";
	// 		res.value = { recentFileList: data };
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "getStarredList") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").find({ isActive: msg.value.isActive, starred: { $in: [msg.value.userId] } }).toArray(function (err, rows) {
	// 		if (err) throw err;
	// 		if (rows != undefined && rows.length > 0) {
	// 			for (var i = 0; i < rows.length; i++) {
	// 				dataFrame = {
	// 					fileName: rows[i].fileName,
	// 					fileId: rows[i].fileId,
	// 					parentFileId: rows[i].parentFileId,
	// 					isActive: rows[i].isActive,
	// 					isFile: rows[i].isFile,
	// 					owners: rows[i].owners,
	// 					viewers: rows[i].viewers,
	// 					starred: rows[i].starred,
	// 					isGroup: rows[i].isGroup,
	// 					path: rows[i].path,
	// 					_id: rows[i]._id
	// 				};
	// 				data.push(dataFrame);
	// 			}
	// 		}
	// 		res.code = "200";
	// 		res.value = { starredFileList: data };
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "getFileList") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").find({ parentFileId: msg.value.parentFileId }).toArray(function (err, rows) {
	// 		if (err) throw err;
	// 		if (rows != undefined && rows.length > 0) {
	// 			for (var i = 0; i < rows.length; i++) {
	// 				dataFrame = {
	// 					fileName: rows[i].fileName,
	// 					fileId: rows[i].fileId,
	// 					parentFileId: rows[i].parentFileId,
	// 					isActive: rows[i].isActive,
	// 					isFile: rows[i].isFile,
	// 					owners: rows[i].owners,
	// 					viewers: rows[i].viewers,
	// 					starred: rows[i].starred,
	// 					isGroup: rows[i].isGroup,
	// 					path: rows[i].path,
	// 					_id: rows[i]._id
	// 				};
	// 				data.push(dataFrame);
	// 			}
	// 		}
	// 		res.code = "200";
	// 		res.value = { list: data };
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "getSharedFileList") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").find({ isGroup: { $ne: true }, owners: { $nin: [msg.value.userId] }, viewers: { $in: [msg.value.userId] } }).toArray(function (err, rows) {
	// 		if (err) throw err;
	// 		if (rows != undefined && rows.length > 0) {
	// 			for (var i = 0; i < rows.length; i++) {
	// 				dataFrame = {
	// 					fileName: rows[i].fileName,
	// 					fileId: rows[i].fileId,
	// 					parentFileId: rows[i].parentFileId,
	// 					isActive: rows[i].isActive,
	// 					isFile: rows[i].isFile,
	// 					owners: rows[i].owners,
	// 					viewers: rows[i].viewers,
	// 					starred: rows[i].starred,
	// 					isGroup: rows[i].isGroup,
	// 					path: rows[i].path,
	// 					_id: rows[i]._id
	// 				};
	// 				data.push(dataFrame);
	// 			}
	// 		}
	// 		res.code = "200";
	// 		res.value = { sharedFileList: data };
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "shareFile") {
	// 	var res = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").update({ fileId: msg.value.fileId }, { $push: { viewers: msg.value.otherUserId } }, function (err) {
	// 		db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "File/folder shared with Id :" + msg.value.fileId });
	// 		if (err) throw err;
	// 		var data = {
	// 			success: true,
	// 			message: "File/folder shared with Id :" + msg.value.fileId
	// 		};
	// 		res.code = "200";
	// 		res.value = data;
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "starMe") {
	// 	var res = {};
	// 	let db = acquireDBInstance();
	// 	if (msg.value.doStar == 'true') {
	// 		db.collection("filetable").update({ fileId: msg.value.fileId }, { $push: { starred: msg.value.userId } }, function (err) {
	// 			db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "File successfully starred: " + msg.value.fileName });
	// 			if (err) throw err;
	// 			var data = {
	// 				success: true,
	// 				message: "File successfully starred: " + msg.value.fileName
	// 			};
	// 			res.code = "200";
	// 			res.value = data;
	// 			dbArray.push(db);
	// 			delete db;
	// 			callback(null, res);
	// 		});
	// 	} else {
	// 		db.collection("filetable").update({ fileId: msg.value.fileId }, { $pull: { starred: msg.value.userId } }, function (err) {
	// 			db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "File successfully unstarred: " + msg.value.fileName });
	// 			if (err) throw err;
	// 			var data = {
	// 				success: true,
	// 				message: "File successfully unstarred: " + msg.value.fileName
	// 			};
	// 			res.code = "200";
	// 			res.value = data;
	// 			dbArray.push(db);
	// 			delete db;
	// 			callback(null, res);
	// 		});
	// 	}
	// } else if (msg.key == "fetchActivity") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("userActivityTable").find({ userId: msg.value.userId }).sort({ $natural: -1 }).limit(10).toArray(function (err, rows) {
	// 		if (err) throw err;
	// 		if (rows != undefined && rows.length > 0) {
	// 			for (var i = 0; i < rows.length; i++) {
	// 				dataFrame = { activity: rows[i].activity };
	// 				data.push(dataFrame);
	// 			}
	// 		}
	// 		res.code = "200";
	// 		res.value = { activityList: data };
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "uploadFile") {
	// 	var res = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").insert({
	// 		fileId: msg.value.fileId, parentFileId: msg.value.parentFileId, fileName: msg.value.fileName, viewers: msg.value.viewers, owners: msg.value.owners, starred: msg.value.starred,
	// 		isActive: msg.value.isActive, isFile: msg.value.isFile, path: msg.value.path
	// 	}, function (err, rows) {
	// 		db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "New file uploaded : " + msg.value.fileName });
	// 		if (err) throw err;
	// 		var data = {
	// 			success: true,
	// 			message: "New file uploaded : " + msg.value.fileName
	// 		};
	// 		res.code = "200";
	// 		res.value = data;
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "downloadFile") {
	// 	var res = {};
	// 	var filePath = "./files/" + msg.value.fileName;
	// 	var buffer = fs.readFileSync(filePath);
	// 	var bufferBase64 = new Buffer(buffer).toString('base64');
	// 	var bufferBase64Chunks = [];
	// 	for (var i = 0; i < bufferBase64.length; i += 204800) {
	// 		bufferBase64Chunks.push({
	// 			chunk: bufferBase64.substring(i, i + 204800),
	// 			chunk_no: i,
	// 			total_chunks: bufferBase64.length,
	// 			is_chunk_data_rev: true
	// 		});
	// 	}
	// 	var data = {
	// 		is_chunk_data_rev: true,
	// 		bufferBase64Chunks: bufferBase64Chunks,
	// 		success: true,
	// 		message: "File downloaded : " + msg.actualFileName
	// 	};
	// 	res.code = "200";
	// 	res.value = data;
	// 	callback(null, res);
	// } else if (msg.key == "deleteFile") {
	// 	var res = {};
	// 	target_path = './files/' + msg.value.fileId + "." + msg.value.fileName.split(".")[1];
	// 	if (fs.existsSync(target_path)) {
	// 		fs.unlinkSync(target_path, function (err) {
	// 			if (err) throw err;
	// 		});
	// 	}
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").remove({ path: new RegExp(msg.value.fileId, 'i'), owners: { $in: [msg.value.userId] } }, function (err) {
	// 		db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "File successfully deleted: " + msg.value.fileName });
	// 		if (err) throw err;
	// 		var data = {
	// 			success: true,
	// 			message: "File successfully deleted: " + msg.value.fileName
	// 		};
	// 		res.code = "200";
	// 		res.value = data;
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "createGroup") {
	// 	var res = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").insert({
	// 		fileId: msg.value.fileId, parentFileId: msg.value.parentFileId, fileName: msg.value.fileName, viewers: msg.value.viewers, owners: msg.value.owners, starred: msg.value.starred, isActive: msg.value.isActive,
	// 		isFile: msg.value.isFile, isGroup: msg.value.isGroup, path: msg.value.path
	// 	}, function (err, rows) {
	// 		db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "New group created : " + msg.value.fileName });
	// 		if (err) throw err;
	// 		var data = {
	// 			success: true,
	// 			message: 'New group created : ' + msg.value.fileName
	// 		};
	// 		res.code = "200";
	// 		res.value = data;
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "getGroupList") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").find({ viewers: { $in: [msg.value.userId] }, isGroup: true }).toArray(function (err, rows) {
	// 		if (err) throw err;
	// 		if (rows != undefined && rows.length > 0) {
	// 			for (var i = 0; i < rows.length; i++) {
	// 				dataFrame = {
	// 					fileName: rows[i].fileName,
	// 					fileId: rows[i].fileId,
	// 					parentFileId: rows[i].parentFileId,
	// 					isActive: rows[i].isActive,
	// 					isFile: rows[i].isFile,
	// 					owners: rows[i].owners,
	// 					viewers: rows[i].viewers,
	// 					starred: rows[i].starred,
	// 					isGroup: rows[i].isGroup,
	// 					path: rows[i].path,
	// 					_id: rows[i]._id
	// 				};
	// 				data.push(dataFrame);
	// 			}
	// 		}
	// 		res.code = "200";
	// 		res.value = { list: data };
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "getGroupMemebers") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").find({ fileId: msg.value.fileId, isGroup: true }).toArray(function (err, outerrows) {
	// 		if (err) throw err;
	// 		if (outerrows != undefined && outerrows.length > 0) {
	// 			db.collection("usertable").find({ userId: { "$in": outerrows[0].viewers } }).toArray(function (error, rows) {
	// 				if (error) throw error;
	// 				if (rows != undefined && rows.length > 0) {
	// 					for (var i = 0; i < rows.length; i++) {
	// 						dataFrame = {
	// 							firstName: rows[i].firstName,
	// 							lastName: rows[i].lastName,
	// 							userId: rows[i].userId,
	// 							email: rows[i].email,
	// 							groupName: rows[i].groupName,
	// 							groupId: rows[i].groupId
	// 						};
	// 						data.push(dataFrame);
	// 					}
	// 				}
	// 				res.code = "200";
	// 				res.value = { success: true, groupMemberList: data, groupOwnerId: outerrows[0].owners };
	// 				dbArray.push(db);
	// 				delete db;
	// 				callback(null, res);
	// 			});
	// 		}
	// 	});
	// } else if (msg.key == "findUser") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("usertable").find({ $or: [{ email: msg.value.searchString }, { firstName: new RegExp(msg.value.searchString, 'i') }, { lastName: new RegExp(msg.value.searchString, 'i') }] }).toArray(function (err, rows) {
	// 		if (err) throw err;
	// 		if (rows != undefined && rows.length > 0) {
	// 			for (var i = 0; i < rows.length; i++) {
	// 				dataFrame = {
	// 					firstName: rows[i].firstName,
	// 					lastName: rows[i].lastName,
	// 					email: rows[i].email,
	// 					userId: rows[i].userId
	// 				};
	// 				data.push(dataFrame);
	// 			}
	// 			res.code = "200";
	// 			res.value = { success: true, userList: data, message: "User list fetched!!" };
	// 			delete db;
	// 			callback(null, res);
	// 		} else {
	// 			dataFrame = {
	// 				firstName: "No user found! Try again!",
	// 				lastName: "",
	// 				email: "",
	// 				userId: ""
	// 			};
	// 			data.push(dataFrame);
	// 			res.code = "200";
	// 			res.value = { success: true, userList: data, message: "User list fetched!!" };
	// 			dbArray.push(db);
	// 			delete db;
	// 			callback(null, res);
	// 		}
	// 	});
	// } else if (msg.key == "addPersonInGroup") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").update({ fileId: msg.value.groupId }, { $push: { viewers: msg.value.newUserId } }, function (error) {
	// 		if (error) throw error;
	// 		db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "User: " + msg.value.newUserId + "added to group: " + msg.value.groupName });
	// 		var data = {
	// 			success: true,
	// 			message: "User: " + msg.value.newUserId + "added to group: " + msg.value.groupName
	// 		};
	// 		res.code = "200";
	// 		res.value = data;
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
	// } else if (msg.key == "deletePersonInGroup") {
	// 	var res = {};
	// 	var data = [];
	// 	var dataFrame = {};
	// 	let db = acquireDBInstance();
	// 	db.collection("filetable").update({ fileId: msg.value.groupId }, { $pull: { viewers: msg.value.deleteUserId } }, function (error) {
	// 		if (error) throw error;
	// 		db.collection("userActivityTable").insert({ userId: msg.value.userId, activity: "Member successfully deleted with ID: " + msg.value.deleteUserId });
	// 		var data = {
	// 			success: true,
	// 			message: "Member successfully deleted with ID: " + msg.value.deleteUserId
	// 		};
	// 		res.code = "200";
	// 		res.value = data;
	// 		dbArray.push(db);
	// 		delete db;
	// 		callback(null, res);
	// 	});
}

exports.handle_request = handle_request;