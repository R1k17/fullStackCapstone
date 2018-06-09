const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// first, importing the model
const {Employee} = require('./models');

// implementing the get endpoint
router.get('/', (req,res) => {
    console.log(res.body);
    
    Employee
    .find()
    
    .then(employees => {
        res.json(employees.map(employee => employee.serialize()))
        /* res.json({
            employees: employees.map(
              (employee) => employee.serialize())
          }); */
    })
});

router.post('/', jsonParser, (req, res) => {
    // add required fields
    /* https://courses.thinkful.com/node-001v5/project/1.4.3 */
    // test if required fields are filled
    const requiredFields = ['first_name', 'last_name', 'gender', 'hours'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    Employee
        .create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            gender: req.body.gender,
            hours: req.body.hours
        })
        .then(employee => res.status(201).json(employee.serialize()))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        });
});

router.delete('/:id', jsonParser, (req,res) => {
    // employeeList.delete(req.params.id);
    // console.log(`Deleted employee with ID: ${req.params.id}`);
    // res.status(204).end();
    
});

router.put('/:id', (req,res) => {
// add required fields
/* https://courses.thinkful.com/node-001v5/project/1.4.5 */
// add error handling
console.log(`Updating employee with ID:\`${req.params.id}\``);
    //   employeeList.update({
    //     id: req.params.id,
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     gender: req.body.gender,
    //     hours: req.body.hours
    //   });
    //   res.status(204).end();
})

module.exports = router;