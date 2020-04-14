var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Consumer = require('./api/models/consumersModel'), //created model loading here
  bodyParser = require('body-parser'),
  messagequeue = require('./api/library/messageQueuing');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/oix');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/consumersRoutes'); //importing route
routes(app); //register the route

var receive_routes = require('./api/routes/receiveRoutes'); //importing route
receive_routes(app); //register the route

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

messagequeue.start();

console.log('Message queue started: ');
