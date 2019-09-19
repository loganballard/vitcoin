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
    id SERIAL,
    user_id INTEGER REFERENCES users(ID),
    active BOOLEAN DEFAULT 't',
    PRIMARY KEY (id, user_id)
);