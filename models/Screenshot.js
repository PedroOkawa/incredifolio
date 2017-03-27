var mongoose = require('mongoose');
var relationship = require('mongoose-relationship');
var Schema = mongoose.Schema;

var Screenshot = new Schema({
	id: {
	    type: Schema.Types.ObjectId,
	    ref: 'screenshot',
  	},
	image: {
		type: String,
		required: true
	},
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

Screenshot.method('generateOutput', function() {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    return obj;
});


module.exports = mongoose.model('Screenshot', Screenshot);