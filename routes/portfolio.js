var async = require('async');
var credentials = require('../config/credentials');
var errorResponses = require('../response/error');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Portfolio = require('../models/portfolio');
var Screenshot = require('../models/screenshot');

/* MIDDLEWARE used to valdiate token */
router.use(function(req, res, next) {
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
});

/* POST a portfolio. */
router.post('/', function(req, res, next) {
	var portfolio = new Portfolio();
	portfolio.id = mongoose.Types.ObjectId();
	portfolio.name = req.body.name;

	portfolio.save(function(err) {
		if(err) {
			res.status(500);
			return res.send(err);
		}

		portfolio = portfolio.replaceId();

		var screenshots = [];

		for(var i = 0; i < 5; i++) {
			var screenshot = new Screenshot({portfolio: portfolio.id});
			screenshot.id = mongoose.Types.ObjectId();
			screenshot.description = 'screenshot test';
			screenshot.image = 'http://pics0.cdnvia.com/pics/querys/340/juegos-vestir-goku.jpg';
			screenshots[i] = screenshot;
		}

		async.eachSeries(screenshots, function(screenshot, asyncdone) {
			screenshot.save(asyncdone);
		}, function(err) {
			if(err) {
				res.status(500);
				return res.send(err);
			}

			return res.json({ message: 'Portfolio ' + portfolio.name + ' created!' });
		});
	});
});

/* GET all portfolios (minify) paginated. */
router.get('/all', function(req, res, next) {
	Portfolio
		.find({})
		.populate('screenshots')
		.exec(function(err, portfolios) {
			if(err) {
				return res.send(err);
			}

			for(var i = 0; i < portfolios.length; i++) {
				portfolios[i] = portfolios[i].replaceId();
				for(var j = 0; j < portfolios[i].screenshots.length; j++) {
					delete portfolios[i].screenshots[j]._id;
				}
			}

			res.json(portfolios);
		});
});

/* GET portfolio's details (Complete description). */
router.get('/:portfolioId', function(req, res, next) {
	//Reequest from database
	res.json(null);
});

module.exports = router;
