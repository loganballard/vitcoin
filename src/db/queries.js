const login_query = 'SELECT * FROM users WHERE email = $1;';
const create_user_query = 'INSERT INTO users (email, passhash) VALUES ($1, $2) RETURNING id;';
const new_session_query = 'INSERT INTO sessions (user_id) VALUES ($1) RETURNING id;';
const add_wallet_session_query_template = "INSERT INTO wallet_balance (session_id, balance) VALUES %L RETURNING wallet_id;";
const add_transaction_query_template = "" +
    "INSERT INTO session_block_transactions (session_id, block_num, transaction_num, from_wallet, to_wallet, amount) " +
    "VALUES %L";
const update_wallet_balance_template = "" +
    "UPDATE wallet_balance AS wB SET" +
    "   balance = wB.balance + up.balance" +
    "FROM (VALUES " +
    "       %L " +
    ") AS up(wallet_id, balance) " +
    "WHERE wB.wallet_id = up.wallet_id;";

module.exports = {
    login_query,
    create_user_query,
    new_session_query,
    add_transaction_query_template,
    add_wallet_session_query_template,
    update_wallet_balance_template
};