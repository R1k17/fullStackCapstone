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

// shiftSchema.virtual('shiftName').get(function() {
//   return this.employee;
// })

shiftSchema.methods.serialize = function() {
  return {
    shiftId: this._id,
    dayId: this.dayId,
    start: this.start,
    end: this.end,
    hours: this.hours,
    employee: this.employeeName
  }
}

const timeTableSchema = mongoose.Schema({
  day: {
    // dayId: String,
    dayName: String,
  }
}, {collection: "timeTables"})


// timeTableSchema.virtual('timeTableName').get(function() {
//   return this.dayName;
// })


timeTableSchema.methods.serialize = function() {
  return {
      id: this._id,
      // tableName: this.tableName,
      day: {
        // dayId: this.day.dayId,
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
      // Do I want to display the ID for the user?
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