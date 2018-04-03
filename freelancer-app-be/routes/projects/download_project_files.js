'use strict';
var fs = require('fs');
let resFormat = require("../../helpers/res_format");

let downloadRouterFn = function (req, res, next) {
    var filePath = "./uploads/" + req.body.filename;
    return res.download(filePath);
}


module.exports.downloadRouterFn = downloadRouterFn;