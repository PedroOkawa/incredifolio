var bcrypt = require('bcrypt');
var security = require('../config/Security');
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

User.method('generateOutput', function() {
    var obj = this.toObject();

    obj.id = obj._id;
    delete obj.password;
    delete obj._id;

    return obj;
});

User.pre('save',
	function(next) {
	    var user = this;
	    if(!user.isModified('password')) {
	    	return next();
	    }

	    bcrypt.genSalt(security.saltFactor,
	    	function(err, salt) {
		        if(err) {
		        	return next(err);
		        }

		        bcrypt.hash(user.password, salt,
		        	function(err, hash) {
			            if(err) {
			            	return next(err);
			            }

			            user.password = String(hash);
			            next();
			        }
		        );
		    }
	    );
	}
);

module.exports = mongoose.model('User', User);