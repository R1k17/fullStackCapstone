'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Main url', function(){
    it('should check if main url runs', function() {
        return chai.request(app)
        .get('/')
        .then(function(res) {
            expect(res).to.have.status(200);
        });
    });
});