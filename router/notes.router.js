'use strict';

const express = require('express');

const router = express.Router();

// TEMP: Simple In-Memory Database
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

//Get All (and search by query)
router.get('/api/notes/', (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    } 
    res.json(list);
  });
});
  
//Get a single item  
router.get('/api/notes/:id', (req, res) => {
  const {id} = req.params;
  
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);    
    } if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});
  
//Put update an item
router.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;
  
  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];
  
  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  
  if (!updateObj.title) {
    const err = new Error('Missing title');
    err.status = 400;
    return next(err);
  }
  
  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

module.exports = router;


