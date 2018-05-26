/* 
Add one test that verifies that when you hit up the root url for your client, you get a 200 status code and HTML.

==== Integration test ====
So far, we've seen how to write unit tests for small pieces of code. 
In this assignment, we dive into integration testing. Integration tests 
target an app's HTTP layer, and, as such, test and document how clients 
will interact with your API.

*/
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