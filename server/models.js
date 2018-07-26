// CREATING SCHEMA

'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shiftSchema = mongoose.Schema({
  shiftId: String,
  dayId: String,
  start: Number,
  end: Number,
  hours: Number,
  employee: String
}, {collection: "shifts"})

shiftSchema.methods.serialize = function() {
  return {
    shiftId: this._id,
    dayId: this.dayId,
    start: this.start,
    end: this.end,
    hours: this.hours,
    employee: this.employee
  }
}

const timeTableSchema = mongoose.Schema({
  day: {
    dayName: String,
  }
}, {collection: "timeTables"})

timeTableSchema.methods.serialize = function() {
  return {
      id: this._id,
      day: {
        dayName: this.day.dayName,
      },
  };
};

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
      id: this._id,
      employeeName: this.employeeName,
      first_name: this.first_name,
      last_name: this.last_name,
      gender: this.gender,
      hours: this.hours,
    };
  };

const Employee = mongoose.model('Employee', employeeSchema);
const TimeTable = mongoose.model('TimeTable', timeTableSchema);
const Shift = mongoose.model('Shift', shiftSchema);

module.exports = {Employee, TimeTable, Shift};