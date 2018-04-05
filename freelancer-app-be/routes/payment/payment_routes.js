'use strict';

let express = require('express');
let router = express.Router();
let auth = require('../../middleware/authentication');
let getTransactionHistory = require('./get_trans_history');
let getTransactionAnalyis = require('./get_trans_analysis');

router.post('/transactionhistory', auth.checkSession, getTransactionHistory.routerfn);

router.post('/transactioncount', auth.checkSession, getTransactionAnalyis.routerfn);

module.exports = router;