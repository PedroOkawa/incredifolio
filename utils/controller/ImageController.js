var BSON = require('bson');
var imageDBHelper = require('../../utils/helper/ImageDBHelper');

module.exports = {

	/* Create an image for the specific portfolio */
	create: function(req, res, next) {
		var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
		var file = req.file;

		imageDBHelper.insert(portfolioId, file,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	},

	/* Deletes the specified screenshot */
	delete: function(req, res) {
		var portfolioId = BSON.ObjectID.createFromHexString(req.params.portfolioId);
		var imageId = BSON.ObjectID.createFromHexString(req.params.imageId);

		imageDBHelper.remove(portfolioId, screenshotId,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	}

}