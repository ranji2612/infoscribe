var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dbSchema = new Schema({
	'pollId'	: String,
	'choice'	: String,
	'votes'		: Number,
	'lastUpd'	: Number
  	},{ collection: 'projects' });

module.exports = mongoose.model('projects', dbSchema);