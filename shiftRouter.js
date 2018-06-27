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