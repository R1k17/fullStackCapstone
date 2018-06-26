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
/* 
router.get('/:id', (req, res) => {
    TimeTable
    .findById(req.params.id)
    .then(timeTable => res.json(employee.serialize()))
    .catch(err => {
        console.log(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['dayName'];
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
        })
        .then(timeTable => res.status(201).json(timeTable.serialize()))
        .catch(err => {
            console.log(err);
            res.status(500).json({error: 'Something went wrong'});
        });
});

router.put('/:id', (req, res) => {
    if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message = (`Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).json({message: message});
    }
    const toUpdate = {};
    const updateableFields = ['dayName'];

    updateableFields.forEach(field => {
        if(field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    TimeTable
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(timeTable => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', jsonParser, (req, res) => {
    TimeTable
        .findByIdAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});
 */
module.exports = router;