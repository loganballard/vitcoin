process.env.NODE_ENV = 'test';

const chai = require('chai');
const chai_http = require('chai-http');
const should = chai.should();

let app = require('../main/index');

chai.use(chai_http);

describe('home GET', () => {
    it('it should return hello world', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.eq("Hello World!");
                done();
            })
    });
});

process.env.NODE_ENV = undefined;