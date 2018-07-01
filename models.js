// CREATING SCHEMA

'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shiftSchema = mongoose.Schema({
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
    dayId: this.dayId,
    start: this.start,
    end: this.end,
    hours: this.hours,
    employee: this.employee
  }
}

const timeTableSchema = mongoose.Schema({
  day: {
    dayId: String,
    dayName: String,
  }
/* monday: {
    dayName: String,
    shifts: {
      startTime: Number,
      endTime: Number,
      hours: Number,
      employee: String
    }
  },
  tuesday: {
    dayName: String,
    shifts: {
      startTime: Number,
      endTime: Number,
      hours: Number,
      employee: String
    }
  },
  wednesday: {
    dayName: String,
    shifts: {
      startTime: Number,
      endTime: Number,
      hours: Number,
      employee: String
    }
  },
  thursday: {
    dayName: String,
    shifts: {
      startTime: Number,
      endTime: Number,
      hours: Number,
      employee: String
    }
  },
  friday: {
    dayName: String,
    shifts: {
      startTime: Number,
      endTime: Number,
      hours: Number,
      employee: String
    }
  },
  saturday: {
    dayName: String,
    shifts: {
      startTime: Number,
      endTime: Number,
      hours: Number,
      employee: String
    }
  },
  sunday: {
    dayName: String,
    shifts: {
      startTime: Number,
      endTime: Number,
      hours: Number,
      employee: String
    }
  }, */
  // tableName: String,
  
    // shifts: [
    //   {
    //     shiftId: String,
    //     start: Number,
    //     end: Number,
    //     hours: Number,
    //     firstName: String,
    //     lastName: String,
    //     employee: String
    //   }
    // ]
  
  
}, {collection: "timeTables"})


// timeTableSchema.virtual('timeTableName').get(function() {
//   return this.dayName;
// })


timeTableSchema.methods.serialize = function() {
  return {
      id: this._id,
      // tableName: this.tableName,
      day: {
        // dayId: this._id + this.monday.dayName,
        // dayId: this.day._id + this.day.dayName,
        dayId: this.day.dayId,
        dayName: this.day.dayName,
        
      },

      // shift: {
    //   id: this.shift.id,
    //   start: this.shift.start,
    //   end: this.shift.end,
    //   hours: this.shift.hours,
    //   employee: this.shift.employee,
    // }

      /* tuesday: {
        dayName: this.tuesday.dayName,
        shifts: {}
      },
      wednesday: {
        dayName: this.wednesday.dayName,
        shifts: {}
      },
      thursday: {
        dayName: this.thursday.dayName,
        shifts: {}
      },
      friday: {
        dayName: this.friday.dayName,
        shifts: {}
      },
      saturday: {
        dayName: this.saturday.dayName,
        shifts: {}
      },
      sunday: {
        dayName: this.sunday.dayName,
        shifts: {}
      }, */
    
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