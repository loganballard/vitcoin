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
    user_id INTEGER REFERENCES users(ID),
    active BOOLEAN DEFAULT 't'
);

-- table to store transactional data (session + block + wallet <--> wallet)
CREATE TABLE sessionBlockTransactions (
    sessionId INTEGER REFERENCES sessions(id),
    blockNum INTEGER NOT NULL,
    transactionNum INTEGER NOT NULL,
    fromWallet INTEGER references walletBalance(walletId),
    toWallet INTEGER references walletBalance(walletId),
    amount INTEGER NOT NULL,
    PRIMARY KEY (sessionId, blockNum, transactionNum)
);

-- table to store wallets and their balances
CREATE TABLE walletBalance (
    walletId SERIAL PRIMARY KEY,
    sessionId INTEGER NOT NULL,
    balance INTEGER NOT NULL
);