/* Stores all error responses */
module.exports = {
	/* USER */
	/* Authenticate or Register */
	successUserResponse: function(user, token) {
		return {
			'user': user,
			'token': token
		}
	},
	/* GENERAL */
	/* Warns the user about an empty field */
	errorEmptyField: function(field) {
		return {
			'code': 5000,
			'message': 'You must provide ' + field
		}
	},
	/* USER */
	/* Warns thet the requested user to be creater already exists */
	errorAlreadyExist: function(object) {
		return {
			'code': 5001,
			'message': object + ' already exist!'
		};
	},
	/* Warns thet the requested user does not exists */
	errorDoesNotExist: function(object) {
		return {
			'code': 5002,
			'message': object + ' does not exist!'
		};
	},
	/* Warns thet the user's credentials requested are invalid */
	errorInvalidCredentials: function() {
		return {
			'code': 5003,
			'message': 'Invalid username or password!'
		};
	},
	/* MIDDLEWARE (TOKEN) */
	/* In case the user didn't specified any token */
	errorTokenNotProvided: function() {
		return {
			'code': 5004,
			'message': 'You must provide a token to make this request!'
		}
	},
	/* Called when the user token is invalid */
	errorInvalidToken: function() {
		return {
			'code': 5005,
			'message': 'Your token is invalid!'
		}
	},
	/* Called when the user token is invalid */
	errorCredentialsMismatch: function() {
		return {
			'code': 5006,
			'message': 'Authentication failed due to a credentials mismatch!'
		}
	},
	errorDatabase: function(err) {
		var message = 'Error on database';

		console.log(err);

		if('message' in err) {
			message = err.message;
		}

		if('errors' in err && 'message' in err.errors[Object.keys(err.errors)[0]]) {
			message = err.errors[Object.keys(err.errors)[0]].message;	
		}

		return {
			'code': 5007,
			'message': message
		}
	}
}