const jwt = require('jsonwebtoken');
const config = (process.env.NODE_ENV === 'test') ? require('./config/test_config') : require('./config/config');
const util = require('./util');

exports.check_user_pass_data = function (req, res, next) {
    let user = req.body.user;
    let plain_password = req.body.password;
    if (user != null && plain_password != null) next();
    else return util.error_response(res, 401, "username or password not supplied", null);
};

exports.issue_token = function (req, res, next) {
    let token = jwt.sign({id: req.body.id}, config.jwt_key);
    res.status(200).json({
        token: token,
        message: "successfully logged in!"
    });
    next();
};