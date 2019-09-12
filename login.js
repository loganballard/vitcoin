const jwt = require('jsonwebtoken');
const jwt_key = "asdf";

exports.login = function (req, res, next) {
    let user = req.body.user;
    let plain_password = req.body.password;

    if (user != null && plain_password != null) {
        next();
    } else {
        return res.status(401).json({
            message: "username or password not supplied"
        });
    }
}

exports.issue_token = function (req, res) {
    let token = jwt.sign({id: req.body.id}, jwt_key);
    res.status(200).json({
        token: token,
        message: "successfully logged in!"
    });
}