var credentials = require('../../.config/credentials');
var errorResponses = require('../../response/error');
var jwt = require('jsonwebtoken');

module.exports = {
	tokenValidation: function(req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if(!token) {
			res.status(401);
			return res.json(errorResponses.errorTokenNotProvided());
		}

		jwt.verify(token, credentials.jwtSecret, function(err, decoded) {
			if(err) {
				res.status(401);
				return res.json(errorResponses.errorInvalidToken());
			}

			req.decoded = decoded;
			return next();
		})
	}
}