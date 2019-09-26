const express = require('express');
const jsonParser = require('body-parser').json();
const db = require('./db_access');
const util = require('./util');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/login', jsonParser, util.check_user_pass_data, db.login_with_name_and_pass, util.issue_token, (req, res) => {
    //console.log('login');
});

app.post('/logout', jsonParser, util.verify_token, (req, res) => {
    //console.log(req.body);
    res.send("logout");
});

app.post('/auth', jsonParser, util.verify_token, (req, res) => {
    //console.log(req.body);
    res.send("authorized!");
});

app.post('/newUser', jsonParser, util.check_user_pass_data, db.create_new_user, util.issue_token, (req, res) => {
    //console.log(req.body);
    res.send();
});

app.post('/newSession', jsonParser, util.verify_token, db.create_new_session, (req, res) => {
    //console.log(req.body);
    res.send();
});

app.post('/setUpScenario', jsonParser, util.verify_token, util.check_setup_vars, db.add_wallets_to_db, (req, res) => {
    //console.log(req.body);
    res.send();
});

app.post('/addTransactions', jsonParser, util.verify_token, util.check_transaction_vars, db.add_transaction_to_db, (req, res) => {
    res.send();
});

app.listen(port, () => console.log(`Vitcoin server is listening on port ${port}!`));

module.exports = app; // for testing