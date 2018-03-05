'use strict';

const express = require('express');

// TEMP: Simple In-Memory Database
const data = require('./db/notes.json');


const app = express();
app.use(express.static('public'));

app.get('/api/notes/', (req, res) => {
  //http://localhost:8080/api/notes/?searchTerm=cats
  const searchTerm = req.query.searchTerm;
  const filteredNote = data.filter(note => note.title.includes(searchTerm)) ;
  res.json(filteredNote);
});

const findById = (id) => {
  return data.find(note => note.id === id);
};

app.get('/api/notes/:id', (req, res) => {
  // console.log(req.params.id);
  res.json(findById(req.params.id));
});

//Listen for incoming connections
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


