var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
var Schema = mongoose.Schema;

var Screenshot = new Schema({
	id: Number,
	description: String,
	image: String,
	portfolio: {
		type: Schema.ObjectId,
		ref: 'Portfolio',
		childPath: 'screenshots'
	}
});

Screenshot.plugin(relationship, {
	relationshipPathName: 'portfolio'
});

module.exports = mongoose.model('Screenshot', Screenshot);