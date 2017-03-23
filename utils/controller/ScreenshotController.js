var BSON = require('bson');
var Screenshot = require('../../models/Screenshot');
var screenshotDBHelper = require('../../utils/helper/ScreenshotDBHelper');

module.exports = {

	/* Create a screenshot for the specific portfolio */
	create: function(req, res, next) {
		var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
		var file = req.file;

		screenshotDBHelper.insert(portfolioId, file,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	},

	/* Deletes the specified screenshot */
	delete: function(req, res) {
		var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
		var screenshotId = BSON.ObjectID.createFromHexString(req.params.screenshotId);

		screenshotDBHelper.remove(portfolioId, screenshotId,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	}

}