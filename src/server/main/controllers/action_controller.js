'use strict';

function new_session(req, res) {
    console.log("successfully created new session");
    res.status(200).json({
        session: res.locals.session,
        user_id: res.locals.user_id,
        token: res.locals.token,
        message: "successfully created new session!"
    });
}


function set_up_scenario(req, res) {
    console.log("successfully set up scenario")
    res.status(200).json({
        wallets: res.locals.wallets,
        session_id: res.locals.session_id,
        token: res.locals.token,
        message: "successfully set up scenario!"
    });
}


function add_transaction(req, res) {
    console.log('successfully added transactions and updated wallet balance!');
    res.status(200).json({
        token: res.locals.token,
        transaction_list: res.locals.trans_list,
        message: "successfully updated wallet balance and added transaction(s)!"
    });
}

module.exports = {
    new_session,
    set_up_scenario,
    add_transaction
};