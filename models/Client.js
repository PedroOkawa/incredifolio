var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Client = new Schema({
	id: {
	    type: Schema.Types.ObjectId,
	    ref: 'client',
  	},
	name: {
		type: String,
		required: true
	},
	image: {
		type: String
	},
	description: {
		type: String
	},
	createdAt: {
		type : Date,
		default: Date.now
	},
	portfolios: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Portfolio',
	        _id: false
		}
	]
}, {
	versionKey: false
});

Client.method('generateOutput', function() {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    return obj;
});

module.exports = mongoose.model('Client', Client);