'use strict';

let router = require('express').Router();
const util = require('../util');
const db = require('../db_access');
const account_controller = require('../controllers/account_controller');

router.post('/login', util.check_user_pass_data, db.login_with_name_and_pass, util.issue_token, account_controller.login);
router.post('/logout', util.verify_token, account_controller.logout);
router.post('/newUser', util.check_user_pass_data, db.create_new_user, util.issue_token, account_controller.new_user);

module.exports = router;
