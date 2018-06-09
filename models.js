/* const uuid = require('uuid');

// employees model: manages employees
const employeeList = {
    // method 1: get endpoint to retrieve all employees
    get: function() {
        console.log('Retrieving a list of all employees');
        return Object.keys(this.items).map(key => this.items[key]);
    },
    // method 2: post endpoint to create a new employee
    create: function(firstName, lastName, gender, hours) {
        console.log('creating new employee');
        const employee = {
            id: uuid.v4(),
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            hours: hours
        };
        this.items[employee.id] = employee;
        return employee;
    },
    // method 3: delete endpoint to delete an employee
    delete: function(id) {
        console.log(`Deleting employee \`${id}\``);
        delete this.items[id];
      },
    // method 4: put endpoint to update an employee
    update: function(updatedEmployee) {
        console.log(`Deleting employee with id: \`${updatedEmployee.id}\``);
        const {id} = updatedEmployee;
        // if (!(id in this.items)) {
        //     throw StorageException(
        //     `Can't update employee \`${id}\` because doesn't exist.`)
        // }
        this.items[updatedEmployee.id] = updatedEmployee;
        return updatedEmployee;
    }
};

function createEmployeeList() {
    const storage = Object.create(employeeList);
    storage.items = {};
    return storage;
}

module.exports = {
    employeeList: createEmployeeList()
};

 */

// CREATING SCHEMA

'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


// Schema to represent an employee
/* const employeeSchema = mongoose.Schema({
    employee: {
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
    },
    gender: {type: String, required: true},
    hours: {type: Number, required: true},
  }); */
const employeeSchema = mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    gender: {type: String, required: true},
    hours: {type: Number, required: true},
  });

  employeeSchema.virtual('employeeName').get(function() {
    // return `${this.employee.first_name} ${this.employee.last_name}`.trim();
    return `${this.first_name} ${this.last_name}`.trim();
  });
  
  employeeSchema.methods.serialize = function() {
    return {
      id: this._id,
      employee: this.employeeName,
      gender: this.gender,
      hours: this.hours,
    };
  };

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = {Employee};