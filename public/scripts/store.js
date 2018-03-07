// eslint-disable-next-line no-unused-vars
'use strict';

const store = (function(){

  const findAndUpdate = function(id, newData) {
    const newId = store.find(note => note.id === id);
    Object.assign(newId, newData);
  };
  
  return {
    notes: [],
    currentNote: false,
    currentSearchTerm: '',
    findAndUpdate
  };
  
}());
