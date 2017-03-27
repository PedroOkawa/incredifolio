var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Portfolio = new Schema({
	id: {
	    type: Schema.Types.ObjectId,
	    ref: 'portfolio',
  	},
	portfolioName: {
		type: String,
		required: true
	},
	portfolioLogo: {
		type: String
	},
	clientName: {
		type: String
	},
	clientLogo: {
		type: String
	},
	description: {
		type: String
	},
	createdAt: {
		type : Date,
		default: Date.now
	},
	screenshots:[
		{
			type: Schema.Types.ObjectId,
			ref: 'Screenshot',
        	_id: false
		}
	]
}, {
	versionKey: false
});

Portfolio.method('generateOutput', function() {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    return obj;
});

module.exports = mongoose.model('Portfolio', Portfolio);