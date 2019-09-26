-- Table to store user information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(30),
    passhash VARCHAR(255)
);

/*
 * table to store session information - note that this is not used for authentication
 * but for maintaining a record of whos doing what
*/
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    active BOOLEAN DEFAULT 't'
);

-- table to store transactional data (session + block + wallet <--> wallet)
CREATE TABLE session_block_transactions (
    session_id INTEGER REFERENCES sessions(id),
    block_num INTEGER NOT NULL,
    transaction_num INTEGER NOT NULL,
    from_wallet INTEGER references wallet_balance(wallet_id),
    to_wallet INTEGER references wallet_balance(wallet_id),
    amount INTEGER NOT NULL,
    PRIMARY KEY (session_id, block_num, transaction_num)
);

-- table to store wallets and their balances
CREATE TABLE wallet_balance (
    wallet_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL,
    balance INTEGER NOT NULL
);