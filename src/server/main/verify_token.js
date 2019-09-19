'use strict';

const jwt = require('jsonwebtoken');
const config = (process.env.NODE_ENV === 'test') ? require('./config/test_config') : require('./config/config');
const util = require('./util');

function verify_token(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token) return util.error_response(res, 400, "no token provided", null, null);
    jwt.verify(token, config.jwt_key, (err, decoded) => {
        if (err) return util.error_response(res, 401, "bad token provided", err, null);
        next();
    });
}

module.exports = verify_token;