'use strict';
const Joi = require('joi');

let kvstore = {};

module.exports = [
  {
    method: 'GET',
    path:'/kvstore',
    handler: function (req, reply){
      reply(kvstore);
    }
  },
  {
    method:'GET',
    path:'/kvstore/:key',
    handler: function (req, reply){
      var key = req.params.key;

      // if(!(kvstore.hasOwnProperty(key))){
      //   reply('key does not exist').code(404);
      // }
      // else {

        reply(key);

      // }
    }
  },
  {
    method: 'POST',
    path: '/kvstore/string',
    handler: function (req, reply){

      var key = req.payload.key;
      var value = req.payload.value;

      if (kvstore.hasOwnProperty(key)){
        reply("already has that key").code(409);
      }
      else {
        kvstore[key] = value;
        reply(key + ": " + value);
      }
    },
    config: {
      validate: {
        payload: Joi.object().keys({
          key: Joi.string().regex(/([a-zA-Z0-9-_])\w+/).required(),
          value: Joi.string().max(10).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/kvstore/number',
    handler: function (req, reply){
      var key = req.payload.key;
      var value = req.payload.value;

      if (kvstore.hasOwnProperty(key)){
        reply("already has that key").code(409);
      }
      else {
        kvstore[key] = value;
        reply(key + ": " + value);
      }
    },
    config: {
      validate: {
        payload: Joi.object({
          key: Joi.string().regex(/([a-zA-Z0-9-_])\w+/).required(),
          value: Joi.number().min(0).max(1000).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/kvstore/array/string',
    handler: function (req, reply){
      var key = req.payload.key;
      var value = req.payload.value;

      if (kvstore.hasOwnProperty(key)){
        reply("already has that key").code(409);
      }
      else {
        kvstore[key] = value;
        reply(key + ": " + value);
      }
    },
    config: {
      validate: {
        payload: {
          key: Joi.string().regex(/([a-zA-Z0-9-_])\w+/).required(),
          value: Joi.array().items(Joi.string().max(10).required())
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/kvstore/array/number',
    handler: function (req, reply){
      var key = req.payload;
      var k, v;
      for (var i in key){
        k = i;
        v = key[i];
      }
      reply(key);
    },
    config: {
      validate: {
        payload: {
          k: Joi.string().token(),
          v: Joi.array().ordered(Joi.number().min(0).max(1000))
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/kvstore/array',
    handler: function (req, reply){
      var key = req.payload;
      var k, v;
      for (var i in key){
        k = i;
        v = key[i];
      }
      reply(key);
    },
    config: {
      validate: {
        payload: {
          k: Joi.string().token(),
          v: Joi.array().items(Joi.string().max(10), Joi.number().min(0).max(1000))
        }
      }
    }
  }
 ];

