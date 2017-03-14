var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
var Schema = mongoose.Schema;

var screenshotSchema = new Schema({
	id: Number,
	description: String,
	image: String,
	portfolio: {
		type: Schema.ObjectId,
		ref: 'Portfolio',
		childPath: 'screenshots'
	}
});

screenshotSchema.plugin(relationship, {
	relationshipPathName: 'portfolio'
});

module.exports = mongoose.model('Screenshot', screenshotSchema);