'use strict';

var _ = require('lodash');
var shortId = require('shortid');
var File = require('./file.model');
var http = require('http'), inspect = require('util').inspect;
var Busboy = require('busboy');
var streamifier = require('streamifier');
var os = require('os');
var path = require('path');
var fs = require("fs");

// Get list of files
exports.index = function(req, res) {
  File.find(function (err, files) {
    if(err) { return handleError(res, err); }
    return res.json(200, files);
  });
};

// Get a single file
exports.show = function(req, res) {

  var readstream = gridfs.createReadStream({
    _id: req.params.id
  });
  req.on('error', function(err) {
    res.send(500, err);
  });
  readstream.on('error', function (err) {
    res.send(500, err);
  });
  readstream.pipe(res);

 // File.findById(req.params.id, function (err, file) {
 //   if(err) { return handleError(res, err); }
 //   if(!file) { return res.send(404); }
 //   return res.json(file);
 // });
};

// Creates a new file in the DB.
exports.create = function(req, res) {
  var is;
  var outs;
  var type;
  var busboy = new Busboy({ headers: req.headers});
  console.log('In file upload function! (create)');
  var gfs = req.app.get('gridfs');

  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%% ----> Use Busboy/Multiparty here!!
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  console.log('Trying Busboy:');
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      type = mimetype;
      var extension = type.split(/[\/ ]+/).pop();
      console.log('This is the filetype:');
      console.log(extension);
      // %%%% SAVE TO DISK
      var saveTo = path.join(os.tmpDir(), path.basename(fieldname));
      file.pipe(fs.createWriteStream(saveTo));

      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
        outs = gfs.createWriteStream({ filename: 'test.png'});
        // %%% HOWTO STREAM File???
        fs.createReadStream(saveTo).pipe(outs);
        outs.on('close', function (file) {
          console.log("Written to somewhere!");
          console.log("ID:" + file._id);
        })
      });
  });

  req.pipe(busboy);

};

// Updates an existing file in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  File.findById(req.params.id, function (err, file) {
    if (err) { return handleError(res, err); }
    if(!file) { return res.send(404); }
    var updated = _.merge(file, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, file);
    });
  });
};

// Deletes a file from the DB.
exports.destroy = function(req, res) {
  File.findById(req.params.id, function (err, file) {
    if(err) { return handleError(res, err); }
    if(!file) { return res.send(404); }
    file.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}