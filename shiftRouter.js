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
    const requiredFields = ['employee', 'start', 'end', 'hours'];
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
            dayId: req.body.dayId,
            start: req.body.start,
            end: req.body.end,
            hours: req.body.hours,
            employee: req.body.employee
        })
        .then(shift => res.status(201).json(shift.serialize()))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        });
});

module.exports = router;