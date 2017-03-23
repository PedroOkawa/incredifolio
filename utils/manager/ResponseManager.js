/* Stores all error responses */
module.exports = {
	/* USER */
	/* Register */
	successRegister: function(user, token) {
		return {
			'message': 'User ' + user.username + ' created!',
			'token': token
		}
	},
	/* Authenticate */
	successAuthentication: function(user, token) {
		return {
			'message': 'User ' + user.username + ' authenticated!',
			'token': token
		}
	},
	/* GENERAL */
	/* Warns the user about an empty field */
	errorEmptyField: function(field) {
		return {
			'code': 5000,
			'error': 'You must provide ' + field
		}
	},
	/* USER */
	/* Warns thet the requested user to be creater already exists */
	errorAlreadyExist: function(object) {
		return {
			'code': 5001,
			'error': object + ' already exist!'
		};
	},
	/* Warns thet the requested user does not exists */
	errorDoesNotExist: function(object) {
		return {
			'code': 5002,
			'error': object + ' does not exist!'
		};
	},
	/* Warns thet the user's credentials requested are invalid */
	errorInvalidCredentials: function() {
		return {
			'code': 5003,
			'error': 'Invalid username or password!'
		};
	},
	/* MIDDLEWARE (TOKEN) */
	/* In case the user didn't specified any token */
	errorTokenNotProvided: function() {
		return {
			'code': 5004,
			'error': 'You must provide a token to make this request!'
		}
	},
	/* Called when the user token is invalid */
	errorInvalidToken: function() {
		return {
			'code': 5005,
			'error': 'Your token is invalid!'
		}
	},
	errorDatabase: function(err) {
		var message = 'Error on database' ;

		if('errors' in err && 'message' in err.errors[Object.keys(err.errors)[0]]) {
			message = err.errors[Object.keys(err.errors)[0]].message;	
		}

		return {
			'code': 5006,
			'error': message
		}
	}
}