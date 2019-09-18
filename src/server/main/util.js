'use strict';

const error_response = function (res, status, message, err, token) {
    return res.status(status).json({
        message: message,
        err: err,
        token: token
    });
};

module.exports = {
    error_response
};