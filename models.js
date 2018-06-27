// CREATING SCHEMA

'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const timeTableSchema = mongoose.Schema({
  dayName: {type: String, required: true},
  shift: [{
    shiftStart: {type: Number, required: true},
    shiftEnd: {type: Number, required: true},
    hours: {type: Number, required: true},
    employee: {type: String, required: true}
  }]
}, {collection: "timeTables"})

timeTableSchema.virtual('timeTableName').get(function() {
  return this.dayName;
})

timeTableSchema.methods.serialize = function() {
  return {
    dayName: this.dayName,
    shift: [{
      shiftStart: this.shift.shiftStart,
      shiftEnd: this.shiftEnd,
      hours: this.hours,
      employee: this.employee
    }]
  };
};
/* 
const shiftSchema = mongoose.Schema({
  shiftName: {type: String, required: true},
  time: {type: Number, required: true},
  employee: {type: Object, required: true}
})
 */

const employeeSchema = mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    gender: {type: String, required: true},
    hours: {type: Number, required: true},
  });

  employeeSchema.virtual('employeeName').get(function() {
    return this.first_name + ' ' + this.last_name;
  });
  
  employeeSchema.methods.serialize = function() {
    return {
      // Do I want to display the ID for the user?
      id: this._id,
      employee: this.first_name + ' ' + this.last_name,
      first_name: this.first_name,
      last_name: this.last_name,
      gender: this.gender,
      hours: this.hours,
    };
  };

const Employee = mongoose.model('Employee', employeeSchema);
const TimeTable = mongoose.model('TimeTable', timeTableSchema);

module.exports = {Employee, TimeTable};