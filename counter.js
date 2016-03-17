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
      var counter = req.payload.counter;
      counterStore.counter = counter;
      reply(counterStore);
    },
    config:{
      validate: {
        payload: {
          counter: Joi.number().integer().min(0).max(1000)
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/counter/increment',
    handler: function (req, reply) {
      counterStore.counter++;
      if(counterStore.counter > 1000){
        reply("You cannot increment above 1000").code(400);
      }
      else {
      reply(counterStore);
      }
    },
  },
  {
    method: 'PUT',
    path: '/counter/decrement',
    handler: function (req, reply) {
      counterStore.counter--;
      if(counterStore.counter < 0){
        reply("You cannot decrement below 0").code(400);
      }
      else {
      reply(counterStore);
      }
    }
  }
];
