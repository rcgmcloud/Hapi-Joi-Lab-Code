//var Boom = require('boom');
//var err = Boom.badRequest('MyError');
//var Joi = require('joi');


const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 3000 });

if(!process.env.hasOwnProperty("NODE_ENV")
    || process.env.NODE_ENV === "test"){

  server.start((err) => {

      if (err) {
          throw err;
      }
      console.log('Server running at:', server.info.uri);
  });

}


const counter = require("./counter");
const kvstore = require("./kvstore");

server.route(counter);
server.route(kvstore);
module.exports = server;