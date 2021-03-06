'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GigSchema = new Schema({
  	title: String,
  	date: Date,
  	location: String,
  	status: Boolean,
  	flyer: String,
  	contact: Date,
  	comment: String,
  	pics: [ String ]
});

module.exports = mongoose.model('Gig', GigSchema);