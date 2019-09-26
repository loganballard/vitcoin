'use strict';
const jwt = require('jsonwebtoken');
const config = (process.env.NODE_ENV === 'test') ? require('../config/test_config') : require('../config/config');


function error_response (res, status, message, err) {
    return res.status(status).json({
        message: message,
        err: err
    });
}


function check_user_pass_data (req, res, next) {
    let user = req.body.user;
    let plain_password = req.body.password;
    if (user != null && plain_password != null) next();
    else return error_response(res, 401, "username or password not supplied", null);
}


function check_setup_vars (req, res, next) {
    if (req.body.wallet_num != null && req.body.starting_balance != null && req.body.session_id != null) next();
    else return error_response(res, 401, "must specify session id, wallet num, starting balance", "Error in setup new session");
}


function check_trans_helper(body) {
    if (body.session_id == null || body.block_num == null) return false;
    else if (body.transactions == null || typeof body.transactions !== 'object' || body.transactions.length === 0) {
        return false;
    }
    return !body.transactions.some(transaction => (transaction.from == null || transaction.to == null || transaction.amount == null));
}


function check_transaction_vars (req, res, next) {
    if (check_trans_helper(req.body)) next();
    else return error_response(res, 401, "must specify session_id, and list of transactions in form: {to: int, from: int, amount: int}", "error in adding transaction");
}


function make_list_of_transactions_from_req_body(session_id, block_num, transaction_list) {
    let list_of_transactions = [];
    let trans_no = 0;
    transaction_list.forEach(trans => { list_of_transactions.push([session_id, block_num, trans_no++, trans.from, trans.to, trans.amount]) });
    return list_of_transactions;
}


// TODO - refactor this garbage
function get_transaction_difference(list_of_trans) {
    let trans_map = {};
    let trans_list = [];
    let to_wallet = 0;
    let from_wallet = 0;
    let amount = 0;
    list_of_trans.forEach(trans => {
        from_wallet = trans[3];
        to_wallet = trans[4];
        amount = trans[5];
        if (!trans_map.hasOwnProperty(from_wallet)) trans_map[from_wallet] = 0 - amount;
        else trans_map[from_wallet] = trans_map[from_wallet] - amount;
        if (!trans_map.hasOwnProperty(to_wallet)) trans_map[to_wallet] = amount;
        else trans_map[to_wallet] = trans_map[to_wallet] + amount;
    });
    Object.entries(trans_map).forEach(trans_entry => {
        trans_list.push([parseInt(trans_entry[0]), trans_entry[1]]);
    });
    return trans_list;
}


function issue_token(req, res, next) {
    let token = jwt.sign({id: req.body.id}, config.jwt_key);
    res.locals.token = token;
    res.locals.user_id = req.body.id;
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
    get_transaction_difference,
    check_user_pass_data,
    issue_token,
    verify_token
};