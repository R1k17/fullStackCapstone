const express = require('express');
const app = express();
const morgan = require('morgan');


const employeeRouter = require('./employeeRouter');

app.use(morgan('common'));
app.use('/employees', employeeRouter);

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);


module.exports = app;