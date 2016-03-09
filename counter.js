'use strict';
const Joi = require('joi');

let counterStore = {
  counter: 0
};


module.exports = [
 {
    method: 'GET',
    path:'/counter',
    handler: function (req, reply) {
      reply(counterStore);
    }
  },
  {
    method: 'POST',
    path: '/counter',
    handler: function (req, reply) {
      n = req.payload.n;
      counterStore.counter = n;
    },
    config:{
      validate: {
        payload: {
          n: Joi.number().integer().min(0).max(1000)
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/counter/increment',
    handler: function (req, reply) {
      n = req.payload.n;
      n++;
      counterStore.counter = n;
    },
    config: {
      validate: {
        payload: {
          n: Joi.number().integer().max(1000)
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/counter/decrement',
    handler: function (n, reply) {
      n--;
      if(n < 0){
        n = 0;
      }
      counterStore.counter = n;
    },
    config: {
      validate: {
        payload: {
          n: Joi.number().integer().min(0)
        }
      }
    }
  }
];
