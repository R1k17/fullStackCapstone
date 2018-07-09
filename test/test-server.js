'use strict';

const express = require('express');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');


const {Employee} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
// const app = require('../server.js');
const expect = chai.expect;

chai.use(chaiHttp);

function seedEmployeeData() {
    console.info('seeding employee data');
    const seedData = [];
    for(let i=1; i<=5; i++){
        seedData.push(generateEmployeeData());
    }
    return Employee.insertMany(seedData);
}

function generateEmployeeData() {
    return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        // gender: faker.gender(),
        gender: 'Female',
        // hours: faker.random.number(),
        hours: 30,
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

// GET test implemented?
// if true, how to run the test on TEST_DATABASE_URL?
// https://github.com/R1k17/BlogAPI2/blob/master/test/server_test.js
// https://travis-ci.org/
// https://courses.thinkful.com/node-001v5/assignment/1.5.4
describe('Main url', function(){
    before(function() {
        return runServer(TEST_DATABASE_URL);
    })

    beforeEach(function() {
        return seedEmployeeData();
    })

    afterEach(function() {
        return closeServer();
    })
    describe('GET', function() {
        it('should check if main url runs', function() {
            return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
            });
        });

        it('should list employess on GET', function() {
            return chai.request(app)
            .get('/employees')
            .then(function(res) {
                expect(res).to.have.status(200);
            })
        })
    })
});