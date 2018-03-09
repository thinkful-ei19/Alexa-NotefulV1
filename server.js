'use strict';

const express = require('express');
const morgan = require('morgan');

const { PORT } = require('./config');

const notesRouter = require('./router/notes.router');

//Create an Express application
const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());


app.use('/', notesRouter);


app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.startServer = function (port) {
  return new Promise((resolve, reject) => {
    this.listen(port, function () {
      this.stopServer = require('util').promisify(this.close);
      resolve(this);
    }).on('error', reject);
  });
};

//Listen for incoming connections
if(require.main === module) {
  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;



