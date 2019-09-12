const express = require('express');
const jsonParser = require('body-parser').json();
const verify_token = require('./verify_token');
const login = require('./login');
const login_with_name_and_pass = require('./db_access');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/login', jsonParser, login.login, login_with_name_and_pass, login.issue_token, (req, res) => {
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));