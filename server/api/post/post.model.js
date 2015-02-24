'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  body: String,
  date: Date
});

module.exports = mongoose.model('Post', PostSchema);