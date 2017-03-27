var credentials = require('../../config/Credentials');
var jwt = require('jsonwebtoken');
var responseManager = require('../../utils/manager/ResponseManager');
var userDBHelper = require('../../utils/helper/UserDBHelper');

module.exports = {

	/* Register user on application */
	register: function(req, res, next) {
		if(!req.body || !req.body.username || !req.body.password) {
			var field = !req.body || !req.body.username ? 'username' : 'password';
			res.status(400);
			return res.send(responseManager.errorEmptyField(field));
		}

		userDBHelper.insert(req.body.username, req.body.password,
			function(status, response) {
				if(status == 200) {
					var token = jwt.sign(response, credentials.jwtSecret);
					response = responseManager.successUserResponse(response, token);
				}

				res.status(status);
				res.json(response);
			}
		);
	},

	/* Authenticate user on database based on username and password */
	authenticate: function(req, res, next) {
		if(!req.body || !req.body.username || !req.body.password) {
			var field = !req.body || !req.body.username ? 'username' : 'password';
			res.status(400);
			return res.send(responseManager.errorEmptyField(field));
		}

		userDBHelper.find(req.body.username, req.body.password,
			function(status, response) {
				if(!response) {
					status = 404;
					response = responseManager.errorDoesNotExist('User');
				}

				if(status == 200) {
					var token = jwt.sign(response, credentials.jwtSecret);
					response = responseManager.successUserResponse(response, token);
				}

				res.status(status);
				res.json(response);
			}
		);
	},

	/* Delete user from database based on username and password */
	delete: function(req, res, next) {
		if(!req.body || !req.body.username || !req.body.password) {
			var field = !req.body || !req.body.username ? 'username' : 'password';
			res.status(400);
			return res.send(responseManager.errorEmptyField(field));
		}

		userDBHelper.remove(req.body.username, req.body.password,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	}

}