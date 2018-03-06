'use strict';

const express = require('express');

// TEMP: Simple In-Memory Database
const data = require('./db/notes');


//Create an Express application
const app = express();


app.use(express.static('public'));

app.get('/api/notes/', (req, res) => {
  //http://localhost:8080/api/notes/?searchTerm=cats
  const searchTerm = req.query.searchTerm;
  if (searchTerm) {
    // const filteredNote = data.filter(note => note.title.includes(searchTerm)) ;
  // res.json(filteredNote);
    const filteredList = data.filter(function(item) {
      return item.title.includes(searchTerm);
    });
    res.json(filteredList);
  } else {
    res.json(data);
  }
});

const findById = (id) => {
  return data.find(note => note.id === Number(id));
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


