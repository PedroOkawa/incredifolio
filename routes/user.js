var credentials = require('../config/credentials');
var errorResponses = require('../response/error');
var successResponses = require('../response/success');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

/* POST user's register */
router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		var field = !req.body.username ? 'username' : 'password';
		res.status(400);
		return res.send(errorResponses.errorEmptyField(field));
	}
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({
		name: username
	}, function(err, user) {
		if(err) {
			res.status(500);
			return res.send(err);
		}

		if(user) {
			res.status(409);
			return res.json(errorResponses.errorUserAlreadyExist());
		}

		user = new User();
		user._id = mongoose.Types.ObjectId();
		user.name = username;
		user.password = password;

		user.save(function(err) {
			if(err) {
				res.status(500);
				res.send(err);
			}

			var token = jwt.sign(user, credentials.jwtSecret);
			res.status(200);
			return res.json(successResponses.successRegister(user, token));
		});
	});
});

/* POST user's authentication */
router.post('/authenticate', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		var field = !req.body.username ? 'username' : 'password';
		res.status(400);
		return res.send(errorResponses.errorEmptyField(field));
	}
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({
		name: username
	}, function(err, user) {
		if(err) {
			res.status(500);
			return res.send(err);
		}

		if(!user) {
			res.status(404);
			return res.json(errorResponses.errorDoesNotExist('User'));
		}

		if(user.password != password) {
			res.status(401);
			return res.json(errorResponses.errorInvalidCredentials());
		}

		var token = jwt.sign(user, credentials.jwtSecret);
		res.status(200);
		return res.json(successResponses.successAuthentication(user, token));
	});
});

module.exports = router;