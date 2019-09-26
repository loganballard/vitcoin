'use strict';
const express = require('express');
const json_parser = require('body-parser').json();
const morgan = require('morgan');
const acct_router = require('./routes/account_route');
const action_router = require('./routes/action_route');
const app = express();
const port = 3000;
const log_level = (process.env.NODE_ENV === 'test' ) ? false : (process.env.NODE_ENV === 'dev') ? 'dev' : 'tiny';

let router = express.Router();

app.use(json_parser);
if (log_level) app.use(morgan(log_level));
app.use('/', router);

router.use('/account', acct_router);
router.use('/action', action_router);
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Vitcoin server is listening on port ${port}!`));

module.exports = app; // for testing