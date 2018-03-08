'use strict';

const timeoutPromise = new Promise((resolve, reject) => {
  const rand = Boolean(Math.round(Math.random()));
  setTimeout(function () {
    if(rand) {
      resolve('Heads!');
    } else { 
      reject('Tails');
    }
  }, 1000);
});

timeoutPromise
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });



