const Pool = require('pg').Pool;
const conn_pool = new Pool({
   user: 'admin',
   host: 'localhost',
   password: 'admin',
   database: 'api',
   port: 5432
});

const login_query = 'SELECT * FROM users WHERE name = $1 AND passhash = $2;';

function login_with_name_and_pass (req, res, next) {
    const name = req.body.user;
    const pass = req.body.password;

    conn_pool.query(login_query, [name, pass])
        .then(results => {
            if (results.rows.length > 0) {
                req.body.id = results.rows[0].id;
                next();
            } else {
                return res.status(401).json({
                    message: "user not found"
                });
            }
        })
        .catch(err => {
            return res.status(401).json({
                err: err,
                message: "user not found"
            });
        });
}

module.exports = login_with_name_and_pass;