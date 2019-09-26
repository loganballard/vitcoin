set +x

docker run \
  --name test-api-in-container \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=test-apis \
  -p 42069:5432 \
  -d \
  postgres

sleep 3 # wait til docker-pg is up TODO figure out nonhack for this

export PGPASSWORD=admin

psql -X -h localhost -p 42069 -d test-apis -U admin -c \
"CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(30),
    passhash VARCHAR(255)
);"
psql -X -h localhost -p 42069 -d test-apis -U admin -c \
"CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    active BOOLEAN DEFAULT 't'
);"
psql -X -h localhost -p 42069 -d test-apis -U admin -c \
"CREATE TABLE wallet_balance (
    wallet_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(id),
    balance INTEGER NOT NULL
);"
psql -X -h localhost -p 42069 -d test-apis -U admin -c \
"CREATE TABLE session_block_transactions (
    session_id INTEGER REFERENCES sessions(id),
    block_num INTEGER NOT NULL,
    transaction_num INTEGER NOT NULL,
    from_wallet INTEGER references wallet_balance(wallet_id),
    to_wallet INTEGER references wallet_balance(wallet_id),
    amount INTEGER NOT NULL,
    PRIMARY KEY (session_id, block_num, transaction_num)
);"

unset PGPASSWORD