# making a bitcoin simulator

As of right now this is just a shitty login express js backend.  Need to do a bunch of stuff before it is actually useful.

### To Run (as it stands right now)

1. Create a local postgres database
2. match up the postgres definitions with that of `./src/config.js` (username, password, db, host, port)
3. Create a users table with id, name, passhash columns
```
    CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(30),
    passhash VARCHAR(255) 
    );
```
- note will probably want to change this to use email and also uniques
4. install depedencies with `npm i --save`
5. spin it up with `npm start`

## To do

1. tests
2. create react front end
3. define more api logic