process.env.NODE_ENV = 'test';

const chai = require('chai');
const chai_http = require('chai-http');
const should = chai.should();

let app = require('../main/app');
chai.use(chai_http);


describe('/ GET', () => {
    it('it should return hello world', done => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.eq("Hello World!");
                done();
            });
    });
});


describe('/newUser POST', () => {
    it('newUser does not work with no attached data', done => {
        chai.request(app)
            .post('/account/newUser')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('new user does not work with no attached password', done => {
        chai.request(app)
            .post('/account/newUser')
            .set('Content-Type', 'application/json')
            .send({user: "asdf"})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.message.should.contain('username or password not supplied');
                done();
            });
    });

    it('new user does not work with no attached username', done => {
        chai.request(app)
            .post('/account/newUser')
            .set('Content-Type', 'application/json')
            .send({password: "asdf"})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.message.should.contain('username or password not supplied');
                done();
            });
    });

    it('new user works with correct data attached', done => {
        chai.request(app)
            .post('/account/newUser')
            .set('Content-Type', 'application/json')
            .send({user: "realuser", password: "realpassword"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain('new user');
                res.body.message.should.contain('successfully logged in');
                res.body.token.should.not.be.null;
                done();
            });
    });

});

describe('/login POST', () => {
   it('login does not work with no attached data', done => {
       chai.request(app)
           .post('/account/login')
           .set('Content-Type', 'application/json')
           .end((err, res) => {
               res.should.have.status(401);
               done();
           });
    });

    it('login does not work with no attached password', done => {
        chai.request(app)
            .post('/account/login')
            .set('Content-Type', 'application/json')
            .send({user: "asdf"})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.message.should.contain('username or password not supplied');
                done();
            });
    });

    it('login does not work with no attached username', done => {
        chai.request(app)
            .post('/account/login')
            .set('Content-Type', 'application/json')
            .send({password: "asdf"})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.message.should.contain('username or password not supplied');
                done();
            });
    });

    it('login does not work with incorrect user and password', done => {
        chai.request(app)
            .post('/account/login')
            .set('Content-Type', 'application/json')
            .send({password: "notReal", user: "notReal"})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.message.should.contain('login unsuccessful');
                done();
            });
    });

    it('login does work with correct user and password', done => {
        chai.request(app)
            .post('/account/login')
            .set('Content-Type', 'application/json')
            .send({password: "realpassword", user: "realuser"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain('successfully logged in');
                res.body.token.should.not.be.null;
                done();
            });
    });
});

describe('/logout POST', () => {
    it('logout should not work with no token', done => {
        chai.request(app)
            .post('/account/logout')
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.message.should.contain('no token provided');
                done();
            });
    });

    it('logout should not work with an invalid token', done => {
        chai.request(app)
            .post('/account/logout')
            .set('x-access-token', 'asdf')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.message.should.contain('bad token provided');
                done();
            });
    });

    it('logout works with a valid testing token', done => {
        chai.request(app)
            .post('/account/logout')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});


describe('/newSession POST', () => {
    it('newSession does not work with no attached token', done => {
        chai.request(app)
            .post('/action/newSession')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('newSession does not work with bad attached token', done => {
        chai.request(app)
            .post('/action/newSession')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'badtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('newSession works with correct data attached', done => {
        chai.request(app)
            .post('/action/newSession')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({id: 1})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain("successfully created new session!");
                res.body.token.should.not.be.null;
                res.body.session.should.not.be.null;
                done();
            });
    });

});


describe('/setUpScenario POST', () => {
    it('setUpScenario does not work with no attached token', done => {
        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('setUpScenario does not work with bad attached token', done => {
        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'badtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('setUpScenario fails without attached data', done => {
        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('setUpScenario fails without attached wallet', done => {
        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({starting_balance: 10})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('setUpScenario fails without attached balance', done => {
        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({wallet_num: 10})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('setUpScenario fails without attached sessionId', done => {
        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({wallet_num: 10, starting_balance: 10})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('setUpScenario succeeds with all vars attached', done => {
        // ensure new user
        chai.request(app)
            .post('/account/newUser')
            .set('Content-Type', 'application/json')
            .send({user: "realuserwallet", password: "realpassword"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain('successfully logged in');
                res.body.token.should.not.be.null;
            });

        // ensure new session
        chai.request(app)
            .post('/action/newSession')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({id: 1})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain("successfully created new session!");
                res.body.token.should.not.be.null;
                res.body.session.should.not.be.null;
            });

        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({wallet_num: 10, starting_balance: 10, session_id: 1})
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('setUpScenario returns correct amount of wallets', done => {
        // ensure new user
        chai.request(app)
            .post('/account/newUser')
            .set('Content-Type', 'application/json')
            .send({user: "realuserwalletcount", password: "realpassword"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain('successfully logged in');
                res.body.token.should.not.be.null;
            });

        // ensure new session
        chai.request(app)
            .post('/action/newSession')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({id: 1})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain("successfully created new session!");
                res.body.token.should.not.be.null;
                res.body.session.should.not.be.null;
            });

        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({wallet_num: 10, starting_balance: 10, session_id: 1})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.wallets.should.have.property('length');
                res.body.wallets.length.should.equal(10);
                done();
            });

    });
});


describe('/addTransactions POST', () => {

    it('addTransactions fails without token', done => {
        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('addTransactions fails without sessionId', done => {
        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({block_num: 0, transactions: [{to: 1, from: 1, amount: 1}]})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('addTransactions fails without block number', done => {
        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, transactions: [{to: 1, from: 1, amount: 1}]})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('addTransactions fails without list of transactions', done => {
        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0})
            .end((err, res) => {
                res.should.have.status(401);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: ''})
            .end((err, res) => {
                res.should.have.status(401);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: []})
            .end((err, res) => {
                res.should.have.status(401);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: [] })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('addTransactions fails with list of incomplete transactions', done => {

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: [{}] })
            .end((err, res) => {
                res.should.have.status(401);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: [{}, {}] })
            .end((err, res) => {
                res.should.have.status(401);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: [{to: 1, from: 1, amount: 1}, {}] })
            .end((err, res) => {
                res.should.have.status(401);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: [{to: 1, from: 1, amount: 1}, {} ] })
            .end((err, res) => {
                res.should.have.status(401);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: [{},{to: 1, from: 1, amount: 1} ] })
            .end((err, res) => {
                res.should.have.status(401);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: [{to: 1, from: 1, amount: 1}, {to: 1, from: 1}, {from: 1, amount: 1}, {amount: 1}] })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });

    it('addTransactions succeeds with correct information', done => {

        // ensure new user
        chai.request(app)
            .post('/account/newUser')
            .set('Content-Type', 'application/json')
            .send({user: "realuserwallet", password: "realpassword"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain('successfully logged in');
                res.body.token.should.not.be.null;
            });

        // ensure new session
        chai.request(app)
            .post('/action/newSession')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({id: 1})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain("successfully created new session!");
                res.body.token.should.not.be.null;
                res.body.session.should.not.be.null;
            });

        // ensure more than one wallet
        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({wallet_num: 10, starting_balance: 10, session_id: 1})
            .end((err, res) => {
                res.should.have.status(200);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 0, transactions: [{to: 1, from: 1, amount: 1}] })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.not.be.null;
                res.body.message.should.contain("successfully updated wallet balance");
                res.body.message.should.contain( "added transaction(s)!");
                res.body.token.should.not.be.null;
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 1, transactions: [{to: 1, from: 2, amount: 10}, {to: 2, from: 3, amount: 111}, {to: 3, from: 1, amount: 21}, {to: 1, from: 2, amount: 10}] })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.not.be.null;
                res.body.message.should.contain("successfully updated wallet balance");
                res.body.message.should.contain( "added transaction(s)!");
                res.body.token.should.not.be.null;
                done();
            });
    });

    it('addTransactions fails with duplicate transaction or nonexistant wallet information', done => {

        // ensure new user
        chai.request(app)
            .post('/account/newUser')
            .set('Content-Type', 'application/json')
            .send({user: "realuserwallet", password: "realpassword"})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain('successfully logged in');
                res.body.token.should.not.be.null;
            });

        // ensure new session
        chai.request(app)
            .post('/action/newSession')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({id: 1})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.contain("successfully created new session!");
                res.body.token.should.not.be.null;
                res.body.session.should.not.be.null;
            });

        // ensure more than one wallet
        chai.request(app)
            .post('/action/setUpScenario')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({wallet_num: 10, starting_balance: 10, session_id: 1})
            .end((err, res) => {
                res.should.have.status(200);
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 1, transactions: [{to: 1, from: 1, amount: 1}, {to: 1, from: 1, amount: 1}, {to: 1, from: 1, amount: 1}, {to: 1, from: 1, amount: 1}] })
            .end((err, res) => {
                res.should.have.status(500);
                res.body.message.should.not.be.null;
                res.body.message.should.contain("Database error adding transaction information");
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 1, transactions: [{to: -1, from: 1, amount: 1}] })
            .end((err, res) => {
                res.should.have.status(500);
                res.body.message.should.not.be.null;
                res.body.message.should.contain("Database error adding transaction information");
            });

        chai.request(app)
            .post('/action/addTransactions')
            .set('Content-Type', 'application/json')
            .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY4NzQ3MTc0fQ.Bg_4iyndW_NojmO3dLpunxC-0MTPGHmDgOwpURE35hc')
            .send({session_id: 1, block_num: 1, transactions: [{to: 100000, from: 1, amount: 1}] })
            .end((err, res) => {
                res.should.have.status(500);
                res.body.message.should.not.be.null;
                res.body.message.should.contain("Database error adding transaction information");
                done();
            });
    });

});

process.env.NODE_ENV = undefined;