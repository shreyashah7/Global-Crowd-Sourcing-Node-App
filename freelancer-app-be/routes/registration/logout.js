'use strict';
// Import helpers
let resFormat = require("../../helpers/res_format");

// Main function to logout user route
let logoutRouterFn = function (req, res, next) {
    
    req.logout();
    req.session.destroy();
    console.log('User Logged Out of the system');
    let resObj = new resFormat('')
        .customMeta({
            message: 'You are logged Out Successfully.'
        });
    return res.status(resObj.getStatus()).json(resObj.log());
};

module.exports.logoutRouterFn = logoutRouterFn;
