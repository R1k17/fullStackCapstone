const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {TimeTable} = require('./models');

router.get('/', (req, res) => {
    TimeTable
    .find()
    .then(timeTables => {
        console.log(timeTables);
        res.json(timeTables.map(timeTable => timeTable.serialize()))
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/:id', (req, res) => {
    TimeTable
    .findById(req.params.id)
    .then(timeTable => res.json(timeTable.serialize()))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'})
    });
});


router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['dayName', 'start', 'end', 'hours', 'employee'];
    for(let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\`in request body`
            console.log(message);
            return res.status(400).send(message);
        }
    }
    TimeTable
        .create({
            dayName: req.body.dayName,
            shifts: {
                start: req.body.shifts.start,
                end: req.body.shifts.end,
                hours: req.body.shifts.hours,
                employee: req.body.shifts.employee
            }
        })
        .then(timeTable => res.status(201).json(timeTable.serialize()))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        });
});

module.exports = router;