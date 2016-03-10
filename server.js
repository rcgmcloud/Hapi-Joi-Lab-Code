//var Boom = require('boom');
//var err = Boom.badRequest('MyError');
//var Joi = require('joi');
const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({ port: 3000 });

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});


const counter = require("./counter");
const kvstore = require("./kvstore");

server.route(counter);
server.route(kvstore);
//var schema = { a: Joi.string().max(255).required()};

// counterStore = {
//   counter: 0
// };

// kvstore = {};