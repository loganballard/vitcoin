# making a bitcoin simulator

[![Build Status](https://travis-ci.org/loganballard/vitcoin.svg?branch=master)](https://travis-ci.org/loganballard/vitcoin)

As of right now this is just a shitty login express js backend.  Need to do a bunch of stuff before it is actually useful.

### To Run (as it stands right now)

1. Create a local postgres database
2. match up the postgres definitions with that of `./src/server/main/config/config.js` (username, password, db, host, port)
3. Create the tables according to `./src/db/table_definitions.sql`
4. install dependencies with `npm i`
5. spin it up with `npm start`

## To Test
MacOS/Linux:
1. `npm test`

Windows: 
1. Spin up a docker instance according to the script in `./src/server/main/test/init_test_db.sh` (this sucks I know)
2. `./node_modules/.bin/mocha  ./src/server/test --exit`
3. `npm run-script test-teardown`
4. Contemplate why windows has stupid powershell

## To do

1. create react front end
2. define more api logic