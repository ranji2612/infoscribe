var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var blogSchema = new Schema({
	ObjectId : Schema.ObjectId,
	title : String,
	description : String,
	pc : Number,
	assignee : String
  },{ collection: 'demotask' });

module.exports = mongoose.model('MyTask', blogSchema);