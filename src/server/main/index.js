const express = require('express');
const jsonParser = require('body-parser').json();
const verify_token = require('./verify_token');
const login = require('./login');
const db_functions = require('./db_access');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/login', jsonParser, login.check_user_pass_data, db_functions.login_with_name_and_pass, login.issue_token, (req, res) => {
    console.log('login');
});

app.post('/logout', jsonParser, verify_token, (req, res) => {
    console.log(req.body);
    res.send("logout");
});

app.post('/auth', jsonParser, verify_token, (req, res) => {
    console.log(req.body);
    res.send("authorized!");
});

app.post('/newUser', jsonParser, login.check_user_pass_data, db_functions.create_new_user, login.issue_token, (req, res) => {
    console.log(req.body);
    res.send();
});

app.post('/newSession', jsonParser, verify_token, db_functions.create_new_session, (req, res) => {
    console.log(req.body);
    res.send();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app; // for testing