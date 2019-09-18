const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const config = (process.env.NODE_ENV === 'test') ? require('./config/test_config') : require('./config/config');
const util = require('./util');
const conn_pool = new Pool({
   user: config.db_username,
   password: config.db_password,
   host: config.db_host,
   database: config.db_database,
   port: config.db_port
});

const login_query = 'SELECT * FROM users WHERE name = $1';
const create_user_query = 'INSERT INTO users (name, passhash) VALUES ($1, $2) RETURNING id;';

exports.login_with_name_and_pass = function (req, res, next) {
    const name = req.body.user;
    const pass = req.body.password;
    let message = "login unsuccessful";

    conn_pool.query(login_query, [name])
        .then(results => {
            if (results.rows.length > 0) {
                bcrypt.compare(pass, results.rows[0].passhash)
                    .then(compare_result => {
                        if (compare_result === true) {
                            req.body.id = results.rows[0].id;
                            next();
                        } else {
                            return util.error_response(res, 401, message, "password incorrect");
                        }
                    })
                    .catch(err => { util.error_response(res, 401, "user not found", err); });
            } else {
                return util.error_response(res, 401, message, "user not found");
            }
        })
        .catch(err => { util.error_response(res, 401, message, err || null); });
}

exports.create_new_user = function (req, res, next) {
    const name = req.body.user;
    const pass = req.body.password;
    let message = "something went wrong creating user";

    bcrypt.hash(pass, config.salt_rounds)
        .then(hash_pass => {
            conn_pool.query(create_user_query, [name, hash_pass])
                .then(results => {
                    req.body.id = results.rows[0].id;
                    next();
                })
                .catch(err => { util.error_response(res, 500, message, err); });
        })
        .catch(err => { util.error_response(res, 500, message, err); });
}