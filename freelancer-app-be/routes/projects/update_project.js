'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
var nodemailer = require("nodemailer");
const subject = "Awarded Project from freelancer.com";
const content = "You have been awarded the project.Kindly login in to freelancer.com and check the details."
/***
 *  Main function for update project route
 */
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "shah.shreya.3012@gmail.com",
        pass: "sach3012"
    }
});

let updateRouterFn = function (req, res, next) {
    if (!!req.body._id) {
        updateProject(req.body)
            .then(function (updatedProject) {
                getFreelancerDetails(req.body.freelancer)
                    .then(function (user) {
                        var mailOptions = {
                            to: user.email,
                            subject: subject,
                            text: 'You have been awarded the project ' + req.body.projectName +
                                '.Kindly login in to www.freelancer.com and check the details.'
                        }
                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if (error) {
                                console.log(error);
                                res.end("error");
                            } else {
                                console.log("Message sent: " + response.message);
                                res.end("sent");
                            }
                        });
                    })
                return updatedProject;
            }).then(function (updatedProject) {
                let resObj = new resFormat(req.body)
                    .customMeta({
                        message: "Project updated successfully."
                    });
                return res.status(resObj.getStatus()).json(resObj.log());
            })
            .catch(function (error) {
                let resObj = new resFormat(error);
                return res.status(resObj.getStatus()).json(resObj.log());
            });
    } else {
        let resObj = new resFormat().customMeta({
            message: "No Project Available."
        });
        return res.status(resObj.getStatus()).json(resObj.log());
    }
};

let updateProject = function (project) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('fl_request_topic', "updateProject", {
            _id: project._id,
            status: project.status,
            freelancer: project.freelancer
        }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('Project not found with this id!');
                    error.status = 500;
                    return reject(error);
                } else {
                    resolve(results.value);
                }
            }
        });
    });
}

let getFreelancerDetails = function (freelancerId) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('fl_request_topic', "getUserById", { userId: freelancerId }, function (err, results) {
            if (err) {
                done(err, {});
            } else {
                if (results.value === null) {
                    let error = new Error('User not found with this id!');
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