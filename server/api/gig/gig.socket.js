/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Gig = require('./gig.model');

exports.register = function(socket) {
  Gig.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Gig.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('gig:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('gig:remove', doc);
}