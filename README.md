# making a bitcoin simulator

As of right now this is just a shitty login express js backend.  Need to do a bunch of stuff before it is actually useful.

### To Run (as it stands right now)

1. Create a local postgres database
2. match up the postgres definitions with that of `./src/server/main/config/config.js` (username, password, db, host, port)
3. Create the tables according to `./src/db/table_definitions.sql`
4. install dependencies with `npm i`
5. spin it up with `npm start`

## To Test
1. `npm run-script test-setup` (mac/linux only, windows no go)
2. `npm test`
3. `npm run-script test-teardown`

## To do

1. create react front end
2. define more api logic