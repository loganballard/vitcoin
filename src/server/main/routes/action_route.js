'use strict';

let router = require('express').Router();
const util = require('../util');
const db = require('../db_access');
const action_controller = require('../controllers/action_controller');

router.post('/newSession', util.verify_token, db.create_new_session, action_controller.new_session);
router.post('/setUpScenario', util.verify_token, util.check_setup_vars, db.add_wallets_to_db, action_controller.set_up_scenario);
router.post('/addTransactions', util.verify_token, util.check_transaction_vars, db.add_transaction_to_db, db.update_wallet_balance, action_controller.add_transaction);

module.exports = router;
