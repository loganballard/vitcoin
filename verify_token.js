'use strict';

const jwt = require('jsonwebtoken');
const jwt_key = "asdf";

function verify_token(req, res, next) {
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            err: null,
            message: "no token provided"
        })
    }
    jwt.verify(token, jwt_key, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                err: err,
                message: "bad token provided"
            })
        }
        console.log(decoded.id);
        next();
    });
}

module.exports = verify_token;