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


app.use('/v1', notesRouter);


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

//Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});



