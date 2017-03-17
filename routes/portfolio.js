var async = require('async');
var BSON = require('bson');
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
	portfolio.description = 'Description';

	portfolio.save(function(err) {
		if(err) {
			res.status(500);
			return res.send(err);
		}

		portfolio = portfolio.replaceId();
		
		return res.json({ message: 'Portfolio ' + portfolio.name + ' created!' });
		/*

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

		*/
	});
});

/* POST a portfolio. */
router.post('/:portfolioId', function(req, res, next) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
	console.log('portfolioId: ' + portfolioId);
	Portfolio
		.findOne({_id:portfolioId})
		.populate('screenshots')
		.exec(function(err, portfolio) {
			if(err) {
				return res.send(err);
			}

			portfolio = portfolio.replaceId();

			for(var i = 0; i < portfolio.screenshots.length; i++) {
				delete portfolio.screenshots[i]._id;
			}

			res.json(portfolio);
		});
});

/* GET all portfolios (minify) paginated by date (Created At). */
router.get('/all', function(req, res, next) {
	var perPage = !req.query.perPage ? 10 : Number(req.query.perPage);
	var startDate = req.query.startDate;

	var query = !startDate ? {} : { createdAt: { $lt: startDate } };

	Portfolio
		.find(query)
		.limit(perPage)
		.sort('-createdAt')
		.populate('screenshots')
		.exec(function(err, portfolios) {
			if(err) {
				return res.send(err);
			}

			for(var i = 0; i < portfolios.length; i++) {
				portfolios[i] = portfolios[i].replaceId();
				delete portfolios[i].screenshots;
			}

			res.json(portfolios);
		});
});

/* GET portfolio's details (Complete description). */
router.get('/:portfolioId', function(req, res, next) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
	console.log('portfolioId: ' + portfolioId);
	Portfolio
		.findOne({_id:portfolioId})
		.populate('screenshots')
		.exec(function(err, portfolio) {
			if(err) {
				return res.send(err);
			}

			if(!portfolio) {
				return res.send(null);
			}

			portfolio = portfolio.replaceId();

			for(var i = 0; i < portfolio.screenshots.length; i++) {
				delete portfolio.screenshots[i]._id;
			}

			res.json(portfolio);
		});
});

module.exports = router;
