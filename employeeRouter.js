const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// first, importing the model
const {employeeList} = require('./models');
// populating the "database"
employeeList.create("Peter", "Parker", "male", 30);
employeeList.create("Jennifer", "Good", "female", 30);
employeeList.create("Sue", "Newman", "female", 40);
// implementing the get endpoint
router.get('/', (req,res) => {
    res.json(employeeList.get());
});
// app.get('/', (req, res) => {
// 
// })

// app.get('/timetable', (req, res) => {
// 
// })

// app.get('/employees', (req, res) => {
// 
// })

module.exports = router;