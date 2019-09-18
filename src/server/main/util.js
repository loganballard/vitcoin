'use strict';

const error_response = function (res, status, message, err) {
    return res.status(status).json({
        message: message,
        err: err
    });
}

module.exports = {
    error_response
}