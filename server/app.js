/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
// My own Imports // DS
var Grid = require('gridfs-stream');

// Connect to database
Grid.mongo = mongoose.mongo;
mongoose.connect(config.mongo.uri, config.mongo.options);

mongoose.connection.on('connected', function() {
  	//set Grid
	var gfs = Grid(mongoose.connection.db);
    app.set('gridfs', gfs);
    console.log('Connected GridFS!!');
    //console.log(gfs);
    // all set!
  })

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: (config.env === 'production') ? false : true,
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;