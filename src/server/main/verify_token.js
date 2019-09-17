'use strict';

const jwt = require('jsonwebtoken');
const config = (process.env.NODE_ENV === 'test') ? require('./config/test_config') : require('./config/config');

function verify_token(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(400).json({
            err: null,
            message: "no token provided"
        })
    }
    jwt.verify(token, config.jwt_key, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                err: err,
                message: "bad token provided"
            });
        }
        next();
    });
}

module.exports = verify_token;