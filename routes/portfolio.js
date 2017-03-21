var BSON = require('bson');
var database = require('../controller/utils/database');
var dependencies = require('../controller/manager/dependencies');
var express = require('express');
var middleware = require('../controller/utils/middleware');
var router = express.Router();
var Portfolio = require('../models/portfolio');
var Screenshot = require('../models/screenshot');

/* MIDDLEWARE used to valdiate token */
router.use(function(req, res, next) {
	middleware.tokenValidation(req, res, next);
});

/* POST a portfolio. */
router.post('/', function(req, res, next) {
	database.insertPortfolio(req.body.name, 'Description',
		function(status, response) {
			res.status(status);
			res.json(response);
		}
	);
});

/* POST a screenshot into a specific portfolio. */
router.post('/:portfolioId/screenshots', dependencies.upload.single('file'), function(req, res, next) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
	var description = req.body.description;
	var file = req.file;


	database.insertScreenshot(portfolioId, file, description,
		function(status, response) {
			res.status(status);
			res.json(response);
		}
	);
});

/* GET all portfolios (minify) paginated by date (Created At). */
router.get('/all', function(req, res, next) {
	var perPage = !req.query.perPage ? 10 : Number(req.query.perPage);
	var startDate = new Date(req.query.startDate * 1000);

	database.findPortfoliosPaginated(startDate, perPage,
		function(status, response) {
			res.status(status);
			res.json(response);
		}
	);
});

/* GET portfolio's details (Complete description). */
router.get('/:portfolioId', function(req, res) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);

	database.findPortfolio(portfolioId,
		function(status, response) {
			res.status(status);
			res.json(response);
		}
	);
});

/* DELETE portfolio */
router.delete('/:portfolioId', function(req, res) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);

	database.removePortfolio(portfolioId,
		function(status, response) {
			res.status(status);
			res.json(response);
		}
	);
});

/* DELETE screenshot from a specific portfolio */
router.delete('/:portfolioId/screenshots/:screenshotId', function(req, res) {
	var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
	var screenshotId = BSON.ObjectID.createFromHexString(req.params.screenshotId);

	database.removeScreenshot(portfolioId, screenshotId,
		function(status, response) {
			res.status(status);
			res.json(response);
		}
	);
});

module.exports = router;