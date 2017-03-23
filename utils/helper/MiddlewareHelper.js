var credentials = require('../../config/Credentials');
var responseManager = require('../../utils/manager/ResponseManager');
var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(!token) {
		res.status(401);
		return res.json(responseManager.errorTokenNotProvided());
	}

	jwt.verify(token, credentials.jwtSecret,
		function(err, decoded) {
			if(err) {
				res.status(401);
				return res.json(responseManager.errorInvalidToken());
			}

			req.decoded = decoded;
			return next();
		}
	)
}