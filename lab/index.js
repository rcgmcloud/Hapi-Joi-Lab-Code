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
                Code.expect(response.result).to.deep.equal({counter: 1});
                Code.expect(response.statusCode).to.equal(200);
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
            method: 'PUT',
            url: '/counter/decrement',
        };

        Server.inject(option1, function(response) {
            Code.expect(response.statusCode).to.equal(400);
            done();
        });

  });

});



lab.experiment('Kvstore', function() {

  //GET kvstore
  lab.test('kvstore should be empty', function (done) {
     const options = {
            method: 'GET',
            url: '/kvstore',
        };

        Server.inject(options, function(response) {
            var result = response.result;
            Code.expect(result).to.deep.equal({});
            done();
        });
  });

  //GET kvstore key
  lab.test('if "spam" requested, value should be "musubi', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/string',
            payload: {
                key: "spam",
                value: "musubi"
            }
        };
    const get = {
            method: 'GET',
            url: '/kvstore/spam'
        };

        Server.inject(post, function(response) {
          Server.inject(get, function(response) {
            var result = response.result;
            Code.expect(result).to.deep.equal({key: "spam", value: "musubi"});
            done();
          });
        });
  });
  lab.test('if key does not exist, return 404', function (done) {
      const get = {
            method: 'GET',
            url: '/kvstore/leprechaun'
        };

      Server.inject(get, function(response) {
        Code.expect(response.statusCode).to.equal(404);
        done();
      });
  });

  //POST kvstore/string
  lab.test('key should be "pine", value should be "apple"', function (done) {
      const post = {
            method: 'POST',
            url: '/kvstore/string',
            payload: {
              key: "pine",
              value: "apple"
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key: "pine", value: "apple"})
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key with numbers, letters, underscore, or dashes should be allowed', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/string',
            payload: {
              key: "Pine1_-",
              value: "apple"
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key: "Pine1_-", value: "apple"})
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key should not contain illegal characters', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/string',
            payload: {
              key: "$*^&",
              value: "apple"
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('if key exists, should return 409 status code', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/string',
            payload: {
              key: "pine",
              value: "apple"
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(409);
        done();
      });
  });
  lab.test('value should be a string', function (done) {
      const post = {
            method: 'POST',
            url: '/kvstore/string',
            payload: {
              key: "pine",
              value: 4
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('value string should not exceed 10 characters', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/string',
            payload: {
              key: "pine",
              value: "123456789TE"
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });


  //POST kvstore/number
  lab.test('key should be "cloud", value should be 9', function (done) {
     const post = {
            method: 'POST',
            url: '/kvstore/number',
            payload: {
              key: "cloud",
              value: 9
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key: "cloud", value: 9});
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key with numbers, letters, underscore, or dashes should be allowed', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/number',
            payload: {
              key: "Metal1_-",
              value: 4
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key: "Metal1_-", value: 4});
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key should not contain illegal characters', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/number',
            payload: {
              key: "$*^&",
              value: 5
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('if key exists, should return 409 status code', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/number',
            payload: {
              key: "cloud",
              value: 10
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(409);
        done();
      });
  });
  lab.test('value should be a number', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/number',
            payload: {
              key: "cloud",
              value: "ten"
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('value should be between 0 and 1000', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/number',
            payload: {
              key: "cloud",
              value: 1001
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });

  //POST kvstore/array/string
  lab.test('key should be "colors", value should be ["red", "yellow", "blue"]', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/string',
            payload: {
              key: "color",
              value: ["red", "yellow", "blue"]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key: "color", value: ["red", "yellow", "blue"]})
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key with numbers, letters, underscore, or dashes should be allowed', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/string',
            payload: {
              key: "Play1_-",
              value: ["Doh", "Doe"]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key: "Play1_-", value: ["Doh", "Doe"]});
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key should not contain illegal characters', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/string',
            payload: {
              key: "$*^&",
              value: ["Doh", "Doe"]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('if key exists, should return 409 status code', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/string',
            payload: {
              key: "color",
              value: ["red", "yellow", "blue"]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(409);
        done();
      });
  });
  lab.test('value should be an array with only strings', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/string',
            payload: {
              key: "red8",
              value: ["red", 8]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('value strings should not exceed 10 characters', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/string',
            payload: {
              key: "states",
              value: ["alaska", "mississippi"]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });

  //POST kvstore/array/number
  lab.test('key should be "prime", value should be [3, 5, 7]', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/number',
            payload: {
              key: "prime",
              value: [3, 5, 7]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key: "prime", value: [3, 5, 7]});
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key should not contain illegal characters', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/number',
            payload: {
              key: "$*^&",
              value: [3, 4]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('if key exists, should return 409 status code', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/number',
            payload: {
              key: "prime",
              value: [11, 13]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(409);
        done();
      });
  });
  lab.test('if key exists, should return 409 status code', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/number',
            payload: {
              key: "prime",
              value: [3, 5, 7]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(409);
        done();
      });
  });
  lab.test('value should be an array with only numbers', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/number',
            payload: {
              key: "mix",
              value: [3, 5, "seven"]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('numbers should be between 0 and 1000', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array/number',
            payload: {
              key: "prime",
              value: [3, 5, 1001]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });

//POST kvstore/array
  lab.test('key should be "profile", value should be ["John", 35]', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array',
            payload: {
              key: "profile",
              value: ["John", 35]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key:"profile", value: ["John", 35]})
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key with numbers, letters, underscore, or dashes should be allowed', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array',
            payload: {
              key: "Action1_-",
              value: ["Jump", 4]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.result).to.deep.equal({key: "Action1_-", value: ["Jump", 4]});
        Code.expect(response.statusCode).to.equal(200);
        done();
      });
  });
  lab.test('key should not contain illegal characters', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array',
            payload: {
              key: "#$*^&",
              value: ["Doh", 4]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('if key exists, should return 409 status code', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array',
            payload: {
              key: "profile",
              value: ["Doh", 4]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(409);
        done();
      });
  });
  lab.test('value strings should not exceed 10 characters', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array',
            payload: {
              key: "bigWords",
              value: ["supercalifragilistix", 4]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });
  lab.test('numbers should be between 0 and 1000', function (done) {
    const post = {
            method: 'POST',
            url: '/kvstore/array',
            payload: {
              key: "bigNum",
              value: ["high", 1001]
            }
      };
      Server.inject(post, function(response) {
        Code.expect(response.statusCode).to.equal(400);
        done();
      });
  });


});