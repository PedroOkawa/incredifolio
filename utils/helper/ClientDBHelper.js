const fs = require('fs-extra');
const path = require('path');

var dependenciesManager = require('../../utils/manager/DependenciesManager');
var mkdirp = require('mkdirp');
var Client = require('../../models/Client');
var responseManager = require('../../utils/manager/ResponseManager');

module.exports = {

	/* FIND */
	list: function(startDate, perPage, callback) {
		var query = !startDate ? {} : { createdAt: { $lt: startDate } };

		Client
			.find(query)
			.limit(perPage)
			.sort('-createdAt')
			.populate('portfolios')
			.exec(
				function(err, response) {
					if(err) {
						return callback(500, responseManager.errorDatabase(err));
					}

					for(var i = 0; i < response.length; i++) {
						response[i] = response[i].generateOutput();
						delete response[i].portfolios;
					}

					return callback(200, response);
				}
			);
	},

	find: function(clientId, callback) {
		Client
			.findOne({_id:clientId})
			.populate('portfolios')
			.exec(
				function(err, response) {
					if(err) {
						return callback(500, responseManager.errorDatabase(err));
					}

					if(!response) {
						return callback(404, responseManager.errorDoesNotExist('Client'));
					}

					response = response.generateOutput();
					for(var i = 0; i < response.portfolios.length; i++) {
						var portfolio = new Portfolio(response.portfolios[i]);
						response.portfolios[i] = portfolio.generateOutput();
					}

					return callback(200, response);
				}
			);
	},
	
	/* INSERT */
	insert: function(client, callback) {
		client.save(
			function(err, response) {
				if(err) {
					return callback(500, responseManager.errorDatabase(err));
				}

				response = response.generateOutput();

				return callback(201, response);
			}
		);
	},

	/* REMOVE */
	remove: function(clientId, callback) {
		module.exports.find(clientId,
			function(status, response) {
				if(status != 200) {
					return callback(status, response);
				}

				Client
					.remove({ _id:clientId })
					.exec(function(err) {
						if(err) {
							return callback(500, responseManager.errorDatabase(err));
						}

						return callback(200, { id:clientId });
					}
				);
			}
		);
	}

} 