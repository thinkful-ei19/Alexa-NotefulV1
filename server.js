'use strict';

const express = require('express');
const { PORT } = require('./config');

// TEMP: Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');  // <<== add this
const notes = simDB.initialize(data);

//Create an Express application
const app = express();
const morgan = require('morgan');

app.use(morgan('common'));

app.use(express.static('public'));


app.get('/api/notes/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
  else {
    res.json(data);
  }
});


app.get('/api/notes/:id', (req, res) => {
  // console.log(req.params.id);
  const {id} = req.params;

  notes.find(id, (err, item) => {
    if (err) {
    console.error(err);    
  } if (item) {
  res.json(data.find(item => item.id === Number(id)));
  console.log(item);
   } else {
     console.log('not found');
   }
  });
});




// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });

app.use(function (req, res, next) {
  var err = new Error('Not Found');
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



