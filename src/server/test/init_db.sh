set +x

docker run \
  --name test-api-in-container \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=test-apis \
  -p 42069:5432 \
  -d \
  postgres

export PGPASSWORD=admin
while [ 1 -eq 1 ]; do
  sleep 2
  psql -X -h localhost -p 42069 -d test-apis -U admin -c "CREATE TABLE users (ID SERIAL PRIMARY KEY, name VARCHAR(30), passhash VARCHAR(255));"
  if [ $? -eq 0 ]; then
    break
  fi
done