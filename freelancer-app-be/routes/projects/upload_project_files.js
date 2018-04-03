'use strict';

let resFormat = require("../../helpers/res_format");
var kafka = require('../../kafka/client');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '@-@' + file.originalname);
    }
});

var upload = multer({ storage: storage }).single('projectFile');

let uploadRouterFn = function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            let resObj = new resFormat(err);
            return res.status(resObj.getStatus()).json(resObj.log());
        }
        let projectObj = { projectId: req.body.projectId, filename: req.file.filename };
        saveProjectFilePath(projectObj)
            .then(function (resultProjectObj) {
                let resObj = new resFormat(projectObj.filename)
                    .customMeta({
                        message: "File Uploaded successfully."
                    });
                return res.status(resObj.getStatus()).json(resObj.log());
            })
            .catch(function (error) {
                let resObj = new resFormat(error);
                return res.status(resObj.getStatus()).json(resObj.log());
            });
    })
};

let saveProjectFilePath = function (projectObj) {
    return new Promise(function (resolve, reject) {
        kafka.make_request('request_topic', "saveProjectFiles",
            {
                _id: projectObj.projectId,
                files: projectObj.filename
            },
            function (err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.value);
                }
            });
    });
}

module.exports.uploadRouterFn = uploadRouterFn;