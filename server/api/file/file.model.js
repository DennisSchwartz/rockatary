'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FileSchema = new Schema({
  filename: String,
  post: String
});

module.exports = mongoose.model('File', FileSchema);