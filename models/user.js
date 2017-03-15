var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	id: {
	    type: Schema.Types.ObjectId,
	    ref: 'user',
  	},
	name: String,
	password: String,
	description: String
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