var credentials = require('../config/credentials');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Portfolio = require('../models/portfolio');
var Screenshot = require('../models/screenshot');

/* ERRORS DEFINITION */
function errorTokenNotProvided() {
	return {
		'code': '5004',
		'error': 'You must provide a token to make this request!'
	}
}

function errorInvalidToken() {
	return {
		'code': '5005',
		'error': 'Your token is invalid!'
	}
}

/* MIDDLEWARE used to valdiate token */
router.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if(!token) {
		res.status(401);
		return res.json(errorTokenNotProvided());
	}

	jwt.verify(token, credentials.jwtSecret, function(err, decoded) {
		if(err) {
			res.status(401);
			return res.json(errorInvalidToken());
		}

		req.decoded = decoded;
		return next();
	})
});

/* POST a portfolio. */
router.post('/', function(req, res, next) {
	var portfolio = new Portfolio();
	portfolio.id = 0;
	portfolio.name = req.body.name;

	portfolio.save(function(err) {
		if(err) {
			res.send(err);
		}

		var screenshot = new Screenshot({portfolio:portfolio._id});
		screenshot.description = 'screenshot test';
		screenshot.image = 'http://pics0.cdnvia.com/pics/querys/340/juegos-vestir-goku.jpg';

		screenshot.save(function(err) {
			if(err) {
				res.send(err);
			}

			res.json({ message: 'Portfolio ' + portfolio.name + ' created!' });
		});
	});
});

/* GET all portfolios (minify) paginated. */
router.get('/all', function(req, res, next) {
	Portfolio.find(function(err, portfolios) {
		if(err) {
			res.send(err);
		}

		res.json(portfolios);
	})
});

/* GET portfolio's details (Complete description). */
router.get('/:portfolioId', function(req, res, next) {
	//Reequest from database
	res.json(null);
});

module.exports = router;
