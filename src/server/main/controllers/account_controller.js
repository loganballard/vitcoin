'use strict';

function login(req, res) {
    console.log("successfully logged in");
    res.status(200).json({
        token: res.locals.token,
        user_id: res.locals.user_id,
        message: "successfully logged in!"
    });
}

function logout(req, res) {
    console.log("successfully logged out");
    res.status(200).json({
        message: "successfully logged out"
    });
}

function new_user(req, res) {
    console.log("new user created!");
    res.status(200).json({
        token: res.locals.token,
        user_id: res.locals.user_id,
        message: "new user created successfully! successfully logged in!"
    });
}

module.exports = {
    login,
    logout,
    new_user
};