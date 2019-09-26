'use strict';

const jwt = require('jsonwebtoken');
const config = (process.env.NODE_ENV === 'test') ? require('./config/test_config') : require('./config/config');


function error_response (res, status, message, err) {
    return res.status(status).json({
        message: message,
        err: err
    });
};


function check_user_pass_data (req, res, next) {
    let user = req.body.user;
    let plain_password = req.body.password;
    if (user != null && plain_password != null) next();
    else return error_response(res, 401, "username or password not supplied", null);
};


function check_setup_vars (req, res, next) {
    if (req.body.walletNum != null && req.body.startingBalance != null && req.body.sessionId != null) next();
    else return error_response(res, 401, "must specify session id, wallet num, starting balance", "Error in setup new session");
};


function check_trans_helper(body) {
    if (body.sessionId == null || body.blockNum == null) return false;
    else if (body.transactions == null || typeof body.transactions !== 'object' || body.transactions.length === 0) {
        return false;
    }
    return !body.transactions.some(transaction => (transaction.from == null || transaction.to == null || transaction.amount == null));
};


function check_transaction_vars (req, res, next) {
    if (check_trans_helper(req.body)) next();
    else return error_response(res, 401, "must specify sessionId, and list of transactions in form: {to: int, from: int, amount: int}", "error in adding transaction");
};


function make_list_of_transactions_from_req_body(sessionId, blockNum, transactionList) {
    let listOfTransactions = [];
    let transNo = 0;
    transactionList.forEach(trans => { listOfTransactions.push([sessionId, blockNum, transNo++, trans.from, trans.to, trans.amount]) });
    return listOfTransactions;
}


function issue_token (req, res, next) {
    let token = jwt.sign({id: req.body.id}, config.jwt_key);
    res.status(200).json({
        token: token,
        message: "successfully logged in!"
    });
    next();
}


function verify_token(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token) return error_response(res, 400, "no token provided", null);
    jwt.verify(token, config.jwt_key, (err, decoded) => {
        if (err) return error_response(res, 401, "bad token provided", err);
        next();
    });
}


module.exports = {
    error_response,
    check_setup_vars,
    check_transaction_vars,
    make_list_of_transactions_from_req_body,
    check_user_pass_data,
    issue_token,
    verify_token
};