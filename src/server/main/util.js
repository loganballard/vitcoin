'use strict';

function error_response (res, status, message, err) {
    return res.status(status).json({
        message: message,
        err: err
    });
};

function check_setup_vars (req, res, next) {
    if (req.body.walletNum != null && req.body.startingBalance != null && req.body.sessionId != null) next();
    else return error_response(res, 401, "must specify session id, wallet num, starting balance", null);
};

module.exports = {
    error_response,
    check_setup_vars
}