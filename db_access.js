const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const salt_rounds = 10;
const conn_pool = new Pool({
   user: 'admin',
   host: 'localhost',
   password: 'admin',
   database: 'api',
   port: 5432
});

const login_query = 'SELECT * FROM users WHERE name = $1';
const create_user_query = 'INSERT INTO users (name, passhash) VALUES ($1, $2);';

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
                            return res.status(401).json({
                                message: message,
                                err: "password incorrect"
                            });
                        }
                    })
                    .catch(err => {
                        return res.status(401).json({
                            message: message,
                            err: "user not found"
                        });
                    });
            } else {
                return res.status(401).json({
                    message: message,
                    err: "user not found"
                });
            }
        })
        .catch(err => {
            return res.status(401).json({
                message: message,
                err: err || null
            });
        });
}

exports.create_new_user = function (req, res, next) {
    const name = req.body.user;
    const pass = req.body.password;

    bcrypt.hash(pass, salt_rounds)
        .then(hash_pass => {
            conn_pool.query(create_user_query, [name, hash_pass])
                .then(results => {
                    req.body.id = 2;
                    console.log(results.rows[0]);
                    next();
                })
                .catch(err => {
                    return res.status(500).json({
                        err: err,
                        message: "something went wrong"
                    });
                });
        })
        .catch(err => {
            return res.status(500).json({
                err: err,
                message: "something went wrong"
            });
        });
}