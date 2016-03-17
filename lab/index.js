'use strict'

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');
const Server = require('../server.js');

lab.experiment('Counter', function() {

   lab.beforeEach(function (done) {
        const reset_counter = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: 0
            }
        };

        Server.inject(reset_counter, function(response){
          done();
        });

    });

  lab.test('counter should equal 0', function (done) {
        const options = {
            method: 'GET',
            url: '/counter',
        };

        Server.inject(options, function(response) {
            console.log("result: ", response.result);
            var result = response.result;
            Code.expect(result).to.deep.equal({counter: 0});
            done();
        });

  });

  lab.test('counter should equal 50', function (done) {
        const options = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: 50
            }
        };

        Server.inject(options, function(response) {
            Code.expect(response.result).to.deep.equal({counter: 50});
            Code.expect(response.statusCode).to.equal(200);
            done();
        });

  });

  lab.test('-2 should give error', function (done) {
        const options = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: -2
            }
        };

        Server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(400);
            done();
        });

  });

  lab.test('1002 should give error', function (done) {
        const options = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: 1002
            }
        };

        Server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(400);
            done();
        });

  });

  lab.test('"zero" should give error', function (done) {
        const options = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: "zero"
            }
        };

        Server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(400);
            done();
        });

  });

  lab.test('counter should increment by 1', function (done) {
        const reset_counter = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: 0
            }
        };

        const increment_counter = {
            method: 'PUT',
            url: '/counter/increment',
        };

        Server.inject(reset_counter, function(response) {

            Server.inject(increment_counter, function(response) {
                Code.expect(response.statusCode).to.equal(200);
                Code.expect(response.result).to.deep.equal({counter: 1});
                done();
            });

        });



  });

  lab.test('counter should not increment above 1000', function (done) {
        const setCounter1000 = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: 1000
            }
        };

        const counter_increment = {
            method: 'PUT',
            url: '/counter/increment',
        };

        Server.inject(setCounter1000, function(response) {
            Server.inject(counter_increment, function(response){
              Code.expect(response.statusCode).to.equal(400);
              done();
            });
        });

  });

  lab.test('counter should decrement by 1', function (done) {
        const setCounter1000 = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: 1000
            }
        };

        const counter_decrement = {
            method: 'PUT',
            url: '/counter/decrement',
        };

        Server.inject(setCounter1000, function(response) {
          Server.inject(counter_decrement, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.deep.equal({counter: 999});
            done();
          });
        });

  });

  lab.test('counter should not decrement below 0', function (done) {
        const option1 = {
            method: 'POST',
            url: '/counter',
            payload: {
                counter: 0
            }
        };

        const option2 = {
            method: 'PUT',
            url: '/counter/decrement',
        };

        Server.inject(option1, option2, function(response) {
            Code.expect(response.statusCode).to.equal(400);
            done();
        });

  });

});



lab.experiment('Kvstore', function() {

});