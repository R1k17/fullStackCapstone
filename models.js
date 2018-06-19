// CREATING SCHEMA

'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* 
const timeTableSchema = mongoose.Schema({
  dayName: {type: String, required: true}
})

const shiftSchema = mongoose.Schema({
  shiftName: {type: String, required: true}
})
 */

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
    return this.first_name + ' ' + this.last_name;
  });
  
  employeeSchema.methods.serialize = function() {
    return {
      // Do I want to display the ID for the user?
      id: this._id,
      employee: this.employeeName,
      firstName: this.first_name,
      lastName: this.last_name,
      gender: this.gender,
      hours: this.hours,
    };
  };

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = {Employee};