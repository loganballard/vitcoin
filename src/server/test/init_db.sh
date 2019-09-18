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
psql -X -h localhost -p 42069 -d test-apis -U admin -c "CREATE TABLE users (ID SERIAL PRIMARY KEY, email VARCHAR(30), passhash VARCHAR(255));"
psql -X -h localhost -p 42069 -d test-apis -U admin -c "CREATE TABLE sessions (id SERIAL, user_id INTEGER REFERENCES users(ID), active BOOLEAN DEFAULT 't', PRIMARY KEY (id, user_id));"
unset PGPASSWORD