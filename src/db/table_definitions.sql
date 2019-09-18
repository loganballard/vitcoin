-- Table to store user information
CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(30),
    passhash VARCHAR(255)
);

