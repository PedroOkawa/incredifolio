const fs = require('fs');
const path = require('path');

var async = require('async');
var BSON = require('bson');
var credentials = require('../config/credentials');
var dependencies = require('../controller/manager/dependencies')
var errorResponses = require('../response/error');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mkdirp = require('mkdirp');
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
	var portfolioObject = new Portfolio();
	portfolioObject.id = mongoose.Types.ObjectId();
	portfolioObject.name = req.body.name;
	portfolioObject.description = 'Description';

	portfolioObject.save(function(err, portfolio) {
		if(err) {
			res.status(500);
			return res.send(err);
		}

		portfolio = portfolio.replaceId();

		res.status(200);
		return res.json(portfolio);
	});
});

/* POST a screenshot into a specific portfolio. */
router.post('/:portfolioId/screenshots', dependencies.upload.single('file'), function(req, res, next) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);

	Portfolio
		.findOne({_id:portfolioId})
		.exec(function(err, portfolio) {
			var description = req.body.description;
			var file = req.file;

			if(err) {
				fs.unlinkSync(dependencies.output + file.filename, function(err) {
					if(err) {
						res.status(500);
						return res.json(err);
					}
				});
				
				return res.json(null);
			}

			if(!portfolio) {
				fs.unlinkSync(dependencies.output + file.filename, function(err) {
					if(err) {
						res.status(500);
						return res.json(err);
					}
				});

				return res.json(null);
			}

			var fileFolderSource = path.resolve('./' + dependencies.output);
			var fileFolderDest = path.resolve('./' + dependencies.output + '/' + portfolioId);

			mkdirp(fileFolderDest, function(err) {
				if(err) {
					fs.unlinkSync(dependencies.output + file.filename, function(err) {
						if(err) {
							res.status(500);
							return res.json(err);
						}
					});

					return res.json({ error: 'Error while trying to create folder: ' + fileFolderDest });
				}

				fs.rename(fileFolderSource + '/' + file.filename, fileFolderDest + '/' + file.filename, function(err) {
					if(err) {
						res.status(500);
						return res.json(err);
					}

					var screenshotObject = new Screenshot({portfolio: portfolioId});
					screenshotObject.id = mongoose.Types.ObjectId();
					screenshotObject.description = description;
					screenshotObject.image = path.resolve(fileFolderDest + '/' + file.filename);
					screenshotObject.save(function(err, screenshot) {
						if(err) {
							res.status(500);
							return res.send(err);
						}

						screenshot = screenshot.replaceId();
						res.status(200);
						return res.json(screenshot);
					});
				});
			});
		});
});

/* GET all portfolios (minify) paginated by date (Created At). */
router.get('/all', function(req, res, next) {
	var perPage = !req.query.perPage ? 10 : Number(req.query.perPage);
	var startDate = new Date(req.query.startDate * 1000);
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

			res.status(200);
			res.json(portfolios);
		});
});

/* GET portfolio's details (Complete description). */
router.get('/:portfolioId', function(req, res) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
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

			res.status(200);
			return res.json(portfolio);
		});
});

/* DELETE portfolio */
router.delete('/:portfolioId', function(req, res) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
	Portfolio
		.remove({_id:portfolioId})
		.exec(function(err) {
			if(err) {
				res.status(500);
				return res.json(err);
			}

			Screenshot
				.remove({portfolio:portfolioId})
				.exec(function(err) {
					if(err) {
						res.status(500);
						return res.json(err);
					}

					return res.json({ message: 'Deleted portfolio: ' + portfolioId });
				});
		});
});

/* DELETE portfolio */
router.delete('/:portfolioId/screenshots/:screenshotId', function(req, res) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
	var screenshotId = BSON.ObjectID.createFromHexString(req.params.screenshotId);

	Screenshot
		.remove({_id:screenshotId})
		.exec(function(err) {
			if(err) {
				res.status(500);
				return res.json(err);
			}

			return res.json({ message: 'Deleted screenshot: ' + screenshotId });
		});
});

module.exports = router;