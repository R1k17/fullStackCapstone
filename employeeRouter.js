const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Employee} = require('./models');

router.get('/', (req,res) => {
    Employee
    .find()
    .then(employees => {
        res.json({
            employees: employees.map(
              (employee) => employee.serialize())
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/:id', (req, res) => {
    Employee
    .findById(req.params.id)
    .then(employee => res.json(employee.serialize()))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

router.post('/', jsonParser, (req, res) => {
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

router.put('/:id', (req,res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({message: message});
    }
    const toUpdate = {};
    const updateableFields = ['first_name', 'last_name', 'gender', 'hours'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    Employee
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(employee => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});


router.delete('/:id', jsonParser, (req,res) => {
    Employee
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;