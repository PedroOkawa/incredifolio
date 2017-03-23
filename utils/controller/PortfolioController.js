var BSON = require('bson');
var portfolioDBHelper = require('../../utils/helper/PortfolioDBHelper');
var Portfolio = require('../../models/Portfolio');

module.exports = {

	/* Create a portfolio based on raw body. */
	create: function(req, res, next) {
		var portfolio = new Portfolio(req.body);

		portfolioDBHelper.insert(portfolio,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	},

	/* List all portfolios from a specific group (Minify). */
	list: function(req, res, next) {
		var perPage = !req.query.perPage ? 10 : Number(req.query.perPage);
		var startDate = new Date(req.query.startDate * 1000);

		portfolioDBHelper.list(startDate, perPage,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	},

	/* Show portfolio details */
	details: function(req, res) {
		var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);

		portfolioDBHelper.find(portfolioId,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	},

	/* Delete the specified portfolio */
	delete: function(req, res) {
		var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);

		portfolioDBHelper.remove(portfolioId,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	}

}