var express = require('express');
var router = express.Router();
var Portfolio = require('../models/portfolio');
var Screenshot = require('../models/screenshot');

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
