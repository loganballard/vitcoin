'use strict';

const express = require('express');
let router = express.Router();

const json_parser = require('body-parser').json();
const acct_router = require('./routes/account_route');
const action_router = require('./routes/action_route');
const app = express();
const port = 3000;

app.use(json_parser);
app.use('/', router);

router.use('/account', acct_router);
router.use('/action', action_router);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Vitcoin server is listening on port ${port}!`));

module.exports = app; // for testing