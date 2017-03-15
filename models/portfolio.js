var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Portfolio = new Schema({
	id: {
	    type: Schema.Types.ObjectId,
	    ref: 'portfolio',
  	},
	name: String,
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

Portfolio.method('replaceId', function() {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    return obj;
});

module.exports = mongoose.model('Portfolio', Portfolio);