'use strict';

var _ = require('lodash');
var Gig = require('./gig.model');

// Get list of gigs
exports.index = function(req, res) {
  Gig.find(function (err, gigs) {
    if(err) { return handleError(res, err); }
    return res.json(200, gigs);
  });
};

// Get a single gig
exports.show = function(req, res) {
  Gig.findById(req.params.id, function (err, gig) {
    if(err) { return handleError(res, err); }
    if(!gig) { return res.send(404); }
    return res.json(gig);
  });
};

// Creates a new gig in the DB.
exports.create = function(req, res) {
  console.log(req.body);
  Gig.create(req.body, function(err, gig) {
    if(err) { return handleError(res, err); }
    return res.json(201, gig);
  });
};

// Updates an existing gig in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  console.log(req.body);
  Gig.findById(req.params.id, function (err, gig) {
    if (err) { return handleError(res, err); }
    if(!gig) { return res.send(404); }
    var updated = _.merge(gig, req.body);
    console.log("Updated: " + updated);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, gig);
    });
  });
};

// Deletes a gig from the DB.
exports.destroy = function(req, res) {
  Gig.findById(req.params.id, function (err, gig) {
    if(err) { return handleError(res, err); }
    if(!gig) { return res.send(404); }
    gig.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}