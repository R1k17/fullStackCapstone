const uuid = require('uuid');

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
    // method 3: put endpoint to update an employee
};

function createEmployeeList() {
    const storage = Object.create(employeeList);
    storage.items = {};
    return storage;
}

module.exports = {
    employeeList: createEmployeeList()
};