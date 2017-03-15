var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
var Schema = mongoose.Schema;

var Screenshot = new Schema({
	id: {
	    type: Schema.Types.ObjectId,
	    ref: 'screenshot',
  	},
	description: String,
	image: String,
	portfolio: {
		type: Schema.Types.ObjectId,
		ref: 'Portfolio',
		childPath: 'screenshots'
	}
}, {
	versionKey: false
});

Screenshot.plugin(relationship, {
	relationshipPathName: 'portfolio'
});


module.exports = mongoose.model('Screenshot', Screenshot);