'use strict';

const faker = require('faker');
const express = require('express');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const {Employee} = require('../server/models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
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
        gender: 'Female',
        hours: 30,
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Main url', function(){
    before(function() {
        return runServer(TEST_DATABASE_URL);
    })

    beforeEach(function() {
        return seedEmployeeData();
    })

    afterEach(function() {
        return tearDownDb();
    })
    
    after(function() {
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
            });
        });
    });

    describe('POST', function() {
        it('should add an employee', function() {
            const newEmployee = generateEmployeeData();

            return chai.request(app)
            .post('/employees')
            .send(newEmployee)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('first_name', 'last_name', 'gender', 'hours');
                
                expect(res.body.first_name).to.equal(newEmployee.first_name);
                expect(res.body.last_name).to.equal(newEmployee.last_name);
                expect(res.body.gender).to.equal(newEmployee.gender);
                expect(res.body.hours).to.equal(newEmployee.hours);
                return Employee.findById(res.body.id);
            })
            .then(function(employee) {
                expect(employee.first_name).to.equal(newEmployee.first_name);
                expect(employee.last_name).to.equal(newEmployee.last_name);
                expect(employee.gender).to.equal(newEmployee.gender);
                expect(employee.hours).to.equal(newEmployee.hours);
            });
        });
    });
    describe('PUT', function() {
        it('update an employee', function() {
            const updateData = {
                first_name: 'Jane',
                last_name: 'Doe',
                gender: 'female',
                hours: 40
            };
            return Employee
            .findOne()
            .then(function(employee) {
                updateData.id = employee.id;
                return chai.request(app)
                .put(`/employees/${employee.id}`)
                .send(updateData);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
                return Employee.findById(updateData.id);
            })
            .then(function(employee) {
                expect(employee.first_name).to.equal(updateData.first_name);
                expect(employee.last_name).to.equal(updateData.last_name);
                expect(employee.gender).to.equal(updateData.gender);
                expect(employee.hours).to.equal(updateData.hours);
            });
        });
    });
    describe('DELETE', function() {
        it('should delete an employee', function() {
            let employee
            return Employee
            .findOne()
            then(function(_employee) {
                employee = _employee;
                return chai.request(app).delete(`/employees/${employee.id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
                return Employee.findById(employee.id);
            })
            .then(function(_employee) {
                expect(_employee).to.be.null;
            });
        });
    });
});