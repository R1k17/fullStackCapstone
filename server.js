const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {PORT, DATABASE_URL} = require('./config');


const employeeRouter = require('./employeeRouter');
const timeTableRouter = require('./timeTableRouter');
const shiftRouter = require('./shiftRouter');

let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.use(jsonParser);
app.use(morgan('common'));
app.use('/employees', employeeRouter);
app.use('/timeTables', timeTableRouter);
// do I need line 30?
app.use('/shifts', shiftRouter);

app.use(express.static('public'));
// app.listen(process.env.PORT || 8080);



let server;

// run server
function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// close server
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, server, runServer, closeServer};