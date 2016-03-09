server.route([
  {
    method: 'GET',
    path:'/kvstore',
    handler: function (req, reply){
      reply({});
    }
  },
  {
    method:'GET',
    path:'/kvstore/:key',
    handler: function (req, reply){
      k = req.params;
    }
  },
  {
    method: 'POST',
    path: '/kvstore/string',
    handler: function (){

    }
  },
  {
    method: 'POST',
    path: '/kvstore/number',
    handler: function (){

    }
  },
  {
    method: 'POST',
    path: '/kvstore/array/string',
    handler: function (){

    }
  },
  {
    method: 'POST',
    path: '/kvstore/array/number',
    handler: function (){

    }
  },
  {
    method: 'POST',
    path: '/kvstore/array',
    handler: function (){

    }
  }
]);

