/* Stores all success responses */
module.exports = {
	/* USER */
	/* Register */
	successRegister: function(user, token) {
		return {
			'message': 'User ' + user.name + ' created!',
			'token': token
		}
	},
	/* Authenticate */
	successAuthentication: function(user, token) {
		return {
			'message': 'User ' + user.name + ' authenticated!',
			'token': token
		}
	}
}