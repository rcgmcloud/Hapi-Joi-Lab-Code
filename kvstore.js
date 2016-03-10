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
      if(!key){
        reply().code(404);
      }
      reply(key);
    }
  },
  {
    method: 'POST',
    path: '/kvstore/string',
    handler: function (req, reply){
      var isKey = req.params;
      if(isKey){
        reply().code(409);
      }

      var key = req.payload;
      var k, v;
      for(var i in key){
        k = i;
        v = key[i];
      }
      reply(key);
    },
    config: {
      validate: {
        payload: {
          k: Joi.string().token(),
          v: Joi.string().max(10).required()

        }
      }
    }
  },
  {
    method: 'POST',
    path: '/kvstore/number',
    handler: function (req, reply){
      var key = req.payload;
      var k, v;
      for(var i in key){
        k = i;
        v = key[i];
      }
      reply(key);
    },
    config: {
      validate: {
        payload: {
          k: Joi.string().token(),
          v: Joi.number().min(0).max(1000)
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/kvstore/array/string',
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
          v: Joi.array().ordered(Joi.string().max(10))
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

