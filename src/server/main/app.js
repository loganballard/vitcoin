const express = require('express');
const json_parser = require('body-parser').json();
const db = require('./db_access');
const util = require('./util');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/login', json_parser, util.check_user_pass_data, db.login_with_name_and_pass, util.issue_token, (req, res) => {
    //console.log('login');
});

app.post('/logout', json_parser, util.verify_token, (req, res) => {
    //console.log(req.body);
    res.send("logout");
});

app.post('/auth', json_parser, util.verify_token, (req, res) => {
    //console.log(req.body);
    res.send("authorized!");
});

app.post('/newUser', json_parser, util.check_user_pass_data, db.create_new_user, util.issue_token, (req, res) => {
    //console.log(req.body);
    res.send();
});

app.post('/newSession', json_parser, util.verify_token, db.create_new_session, (req, res) => {
    //console.log(req.body);
    res.send();
});

app.post('/setUpScenario', json_parser, util.verify_token, util.check_setup_vars, db.add_wallets_to_db, (req, res) => {
    //console.log(req.body);
    res.send();
});

app.post('/addTransactions', json_parser, util.verify_token, util.check_transaction_vars, db.add_transaction_to_db, db.update_wallet_balance, (req, res) => {
    res.send();
});

app.listen(port, () => console.log(`Vitcoin server is listening on port ${port}!`));

module.exports = app; // for testing