var BSON = require('bson');
var clientDBHelper = require('../../utils/helper/ClientDBHelper');
var Client = require('../../models/Client');

module.exports = {

	/* Create a client based on raw body. */
	create: function(req, res, next) {
		var client = new Client(req.body);

		clientDBHelper.insert(client,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	},

	/* List all clients */
	list: function(req, res, next) {
		var perPage = !req.query.perPage ? 10 : Number(req.query.perPage);
		var startDate = !req.query.startDate ? Date.now : new Date(req.query.startDate * 1000);

		clientDBHelper.list(startDate, perPage,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	},

	/* Show client details */
	details: function(req, res) {
		var clientId = BSON.ObjectID.createFromHexString(req.params.clientId);

		clientDBHelper.find(clientId,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	},

	/* Delete the specified client */
	delete: function(req, res) {
		var clientId = BSON.ObjectID.createFromHexString(req.params.clientId);

		clientDBHelper.remove(clientId,
			function(status, response) {
				res.status(status);
				res.json(response);
			}
		);
	}

}