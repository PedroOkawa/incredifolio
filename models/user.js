var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	id: Number,
	name: String,
	password: String,
	description: String
});

module.exports = mongoose.model('User', User);