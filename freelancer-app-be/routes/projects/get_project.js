'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
/**
 *  Main function to get project by ID along with bid information
 */
let projectRouterFn = function (req, res, next) {
    let projectId = req.projectId;
    getProjectDetailsById(projectId)
        .then(function (projectModel) {
            let resObj = new resFormat(projectModel)
                .customMeta({
                    message: 'Project retrieved successfully.'
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });
};

let allProjectRouterFn = function (req, res, next) {
    getAllOpenProject()
        .then(function (projectList) {
            let resObj = new resFormat(projectList)
                .customMeta({
                    message: 'Projects retrieved successfully.'
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });
};

let searchProjectRouterFn = function (req, res, next) {
    getAllSearchProjects(req.searchStrng)
        .then(function (projectList) {
            let resObj = new resFormat(projectList)
                .customMeta({
                    message: 'Projects retrieved successfully.'
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });
};

let skillProjectRouterFn = function (req, res, next) {
    getAllSkillProjects(req.body.skills.split(','))
        .then(function (projectList) {
            let resObj = new resFormat(projectList)
                .customMeta({
                    message: 'Projects retrieved successfully.'
                });
            return res.status(resObj.getStatus()).json(resObj.log());
        })
        .catch(function (error) {
            let resObj = new resFormat(error);
            return res.status(resObj.getStatus()).json(resObj.log());
        });
};

let userProjectRouterFn = function (req, res, next) {
    if (req.body._id !== null && req.body.role !== null) {
        if (req.body.role === 1) {
            getEmployerProjects(req.body._id)
                .then(function (projectList) {
                    let resObj = new resFormat(projectList)
                        .customMeta({
                            message: 'Projects retrieved successfully.'
                        });
                    return res.status(resObj.getStatus()).json(resObj.log());
                })
                .catch(function (error) {
                    let resObj = new resFormat(error);
                    return res.status(resObj.getStatus()).json(resObj.log());
                });
        } else {
            getFreelancerProjects(req.body._id)
                .then(function (projectList) {
                    let resObj = new resFormat(projectList)
                        .customMeta({
                            message: 'Projects retrieved successfully.'
                        });
                    return res.status(resObj.getStatus()).json(resObj.log());
                })
                .catch(function (error) {
                    let resObj = new resFormat(error);
                    return res.status(resObj.getStatus()).json(resObj.log());
                });
        }
    }
};

let getProjectDetailsById = function (projectId) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getProjectDetailsById", { projectId: projectId }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Project not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

let getAllOpenProject = function () {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getAllOpenProjects", {}, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Projects not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

let getAllSearchProjects = function (searchStrng) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getAllSearchProjects", { searchStrng: searchStrng }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Projects not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

let getAllSkillProjects = function (skillList) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getAllSkillProjects", { skills: skillList }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Projects not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

/***
 *  Main function to get project route
 */

let getEmployerProjects = function (userId) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getEmployerProjects", { userId: userId }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Projects not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}
let getFreelancerProjects = function (userId) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "getFreelancerProjects", { userId: userId }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Projects not found with this id');
                    error.status = 404;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

module.exports.projectRouterFn = projectRouterFn;

module.exports.allProjectRouterFn = allProjectRouterFn;

module.exports.skillProjectRouterFn = skillProjectRouterFn;

module.exports.userProjectRouterFn = userProjectRouterFn;

module.exports.searchProjectRouterFn = searchProjectRouterFn;