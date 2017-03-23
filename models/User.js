var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	id: {
	    type: Schema.Types.ObjectId,
	    ref: 'user',
  	},
  	username: {
		type: String,
		required: true,
		unique: true
  	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	description: {
		type: String
	}
}, {
	versionKey: false
});

User.method('replaceId', function() {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    return obj;
});

module.exports = mongoose.model('User', User);