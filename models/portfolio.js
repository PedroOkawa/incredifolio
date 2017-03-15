var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Portfolio = new Schema({
	id: Number,
	name: String,
	screenshots:[
		{
			type: Schema.ObjectId,
			ref: 'Screenshot'
		}
	]
});

module.exports = mongoose.model('Portfolio', Portfolio);