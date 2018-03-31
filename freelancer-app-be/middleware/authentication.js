'use strict';

let checkSession = function (req, res, next) {
  // Put the preprocessing here.
  if (!req.isAuthenticated()) {
    req.session.destroy();
    console.log('Session Expired');
    let error = new Error('Your session has been expired!.')
    error.status = 401;
    return next(error);
  } else {
    return next();
  }
};

module.exports.checkSession = checkSession;