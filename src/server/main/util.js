'use strict';

function error_response (res, status, message, err) {
    return res.status(status).json({
        message: message,
        err: err
    });
};

function check_setup_vars (req, res, next) {
    let num_of_wallets = req.body.walletNum;
    let starting_balance = req.body.startingBalance;
    if (num_of_wallets != null && starting_balance != null) next();
    return error_response(res, 401, "must specify wallet num and starting balance", null);
};

module.exports = {
    error_response,
    check_setup_vars
}