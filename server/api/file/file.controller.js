'use strict';

var _ = require('lodash');
var shortId = require('shortid');
var File = require('./file.model');
var http = require('http'), inspect = require('util').inspect;
var Busboy = require('busboy');
var os = require('os');
var path = require('path');
var fs = require("fs");
var uid = require('uid2');

// Get list of files
exports.index = function(req, res) {
  File.find(function (err, files) {
    if(err) { return handleError(res, err); }
    return res.json(200, files);
  });
};

// Get a single file
exports.show = function(req, res) {

  var gfs = req.app.get('gridfs');
  var readstream = gfs.createReadStream({
    _id: req.params.id
  });
  req.on('error', function(err) {
    res.send(500, err);
  });
  readstream.on('error', function (err) {
    res.send(500, err);
  });
  readstream.pipe(res);
};

// Creates a new file in the DB.
exports.create = function(req, res) {
  var is;
  var outs;
  var type;
  // Create new busboy with headers from request
  var busboy = new Busboy({ headers: req.headers});
  var gfs = req.app.get('gridfs');


  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  // %%%%% ----> Use Busboy here!!
  // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

      // %%%% Check filetype
      var type = mimetype.split(/[\/ ]+/);
      if ( type[1] !== 'pdf' &&  type[0] !== 'image') {
        // if file is not a pdf or image file -> reject http request
        console.log('Not an acceptable filetype!');
        res.status(400).json({ message: "This is not an accepted file type. Please make sure you are uploading image or pdf files."})
      }

      // %%%% Save tempfile to disk
      var saveTo = path.join(os.tmpDir(), path.basename(uid(22) + '.' + type[1]));
      file.pipe(fs.createWriteStream(saveTo));
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });

      // %%%% After file was written to disk
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
        outs = gfs.createWriteStream({ filename: filename});
        // %%% Read file from disk and pipe to DB
        fs.createReadStream(saveTo).pipe(outs);
        outs.on('close', function (file) {
          // %%%% After save to DB, delete from tmp.
          console.log("Written " + file.filename + " to Database with id: "+ file._id + "!");
          //Return file id to add to gig
          res.status(201).json({ fileID: file._id });
          fs.unlink(saveTo);
          console.log('Temp file deleted!');
        })
      });
    });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
  });

  busboy.on('finish', function() {
    console.log('Done parsing form!');
    //res.writeHead(200, { Connection: 'close', status: 'success', fileID: res.fileID });
    //res.status(201).json({ fileID: fileID });
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