/* Stores all error responses */
module.exports = {
	/* GENERAL */
	/* Warns the user about an empty field */
	errorEmptyField: function(field) {
		return {
			'code': '5000',
			'error': 'You must provide ' + field
		}
	},
	/* USER */
	/* Warns thet the requested user to be creater already exists */
	errorUserAlreadyExist: function() {
		return {
			'code': '5001',
			'error': 'User already exist!'
		};
	},
	/* Warns thet the requested user does not exists */
	errorUserDoesNotExist: function() {
		return {
			'code': '5002',
			'error': 'User does not exist!'
		};
	},
	/* Warns thet the user's credentials requested are invalid */
	errorInvalidCredentials: function() {
		return {
			'code': '5003',
			'error': 'Invalid username or password!'
		};
	},
	/* MIDDLEWARE (TOKEN) */
	/* In case the user didn't specified any token */
	errorTokenNotProvided: function() {
		return {
			'code': '5004',
			'error': 'You must provide a token to make this request!'
		}
	},
	/* Called when the user token is invalid */
	errorInvalidToken: function() {
		return {
			'code': '5005',
			'error': 'Your token is invalid!'
		}
	}
}