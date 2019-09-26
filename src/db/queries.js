const login_query = 'SELECT * FROM users WHERE email = $1;';
const create_user_query = 'INSERT INTO users (email, passhash) VALUES ($1, $2) RETURNING id;';
const new_session_query = 'INSERT INTO sessions (user_id) VALUES ($1) RETURNING id;';
const add_wallet_session_query_template = "INSERT INTO walletBalance (sessionId, balance) VALUES %L RETURNING walletId;";
const add_transaction_query_template = "" +
    "INSERT INTO sessionBlockTransactions (sessionId, blockNum, transactionNum, fromWallet, toWallet, amount) " +
    "VALUES %L";
const update_wallet_balance_template = "" +
    "UPDATE walletBalance AS wB SET" +
    "   balance = wB.balance + up.balance" +
    "FROM (VALUES " +
    "       %L " +
    ") AS up(walletId, balance) " +
    "WHERE wB.walletId = up.walletId;";

module.exports = {
    login_query,
    create_user_query,
    new_session_query,
    add_transaction_query_template,
    add_wallet_session_query_template,
    update_wallet_balance_template
}