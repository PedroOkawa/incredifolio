var credentials = require('../config/credentials');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');

/* RESPONSE DEFINITION */
function successRegister(user, token) {
	return {
		'message': 'User ' + user.name + ' created!',
		'token': token
	}
}

function successAuthentication(user, token) {
	return {
		'message': 'User ' + user.name + ' authenticated!',
		'token': token
	}
}

/* ERRORS DEFINITION */
function errorEmptyFields() {
	return {
		'code': '5000',
		'error': 'You must provide username and password!'
	}
}

function errorAlreadyExist() {
	return {
		'code': '5001',
		'error': 'User already exist!'
	};
}

function errorDoesNotExist() {
	return {
		'code': '5002',
		'error': 'User does not exist!'
	};
}

function errorInvalidCredentials() {
	return {
		'code': '5003',
		'error': 'Invalid username or password!'
	};
}

/* POST user's register */
router.post('/register', function(req, res, next) {
	if(!req.body || !req.body.username || !req.body.password) {
		res.status(400);
		return res.send(errorEmptyFields());
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
			return res.json(errorAlreadyExist());
		}

		user = new User();
		user.name = username;
		user.password = password;

		user.save(function(err) {
			if(err) {
				res.status(500);
				res.send(err);
			}

			var token = jwt.sign(user, credentials.jwtSecret);
			res.status(200);
			return res.json(successRegister(user, token));
		});
	});
});

/* POST user's authentication */
router.post('/authenticate', function(req, res, next) {
	if(!req.body || !req.body.username || !req.body.password) {
		res.status(400);
		return res.send(errorEmptyFields());
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
			return res.json(errorDoesNotExist());
		}

		if(user.password != password) {
			res.status(401);
			return res.json(errorInvalidCredentials());
		}

		var token = jwt.sign(user, credentials.jwtSecret);
		res.status(200);
		return res.json(successAuthentication(user, token));
	});
});

module.exports = router;