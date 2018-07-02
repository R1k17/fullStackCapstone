const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Shift} = require('./models');

router.get('/', (req, res) => {
    Shift
    .find()
    .then(Shifts => {
        console.log(Shifts);
        res.json(Shifts.map(Shift => Shift.serialize()))
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'startTime', 'endTime','hours'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    Shift
        .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            hours: req.body.hours
        })
        .then(shift => res.status(201).json(shift.serialize()))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        });
});

module.exports = router;