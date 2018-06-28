// CREATING SCHEMA

'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shiftSchema = mongoose.Schema({
  id: String,
  start: Number,
  end: Number,
  hours: Number,
  employee: String
}, {collection: "shifts"})

shiftSchema.virtual('shiftName').get(function() {
  return this.employee;
})

shiftSchema.methods.serialize = function() {
  return {
    id: this.id,
    start: this.start,
    end: this.end,
    hours: this.hours,
    employee: this.employee
  }
}

const timeTableSchema = mongoose.Schema({
  // shift: {
  //   id: String,
  //   start: Number,
  //   end: Number,
  //   hours: Number,
  //   employee: String
  days: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
  },
}, {collection: "timeTables"})


// timeTableSchema.virtual('timeTableName').get(function() {
//   return this.dayName;
// })

timeTableSchema.methods.serialize = function() {
  return {
    days: {
      monday: this.days.monday,
      tuesday: this.days.tuesday,
      wednesday: this.days.wednesday,
      thursday: this.days.thursday,
      friday: this.days.friday,
      saturday: this.days.saturday,
      sunday: this.days.sunday,
    }
    // shift: {
    //   id: this.shift.id,
    //   start: this.shift.start,
    //   end: this.shift.end,
    //   hours: this.shift.hours,
    //   employee: this.shift.employee,
    // }
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
      employee: this.first_name + ' ' + this.last_name,
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