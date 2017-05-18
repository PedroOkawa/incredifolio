const fs = require('fs-extra');
const path = require('path');

var dependenciesManager = require('../../utils/manager/DependenciesManager');
var mkdirp = require('mkdirp');
var Portfolio = require('../../models/Portfolio');
var responseManager = require('../../utils/manager/ResponseManager');
var Screenshot = require('../../models/Screenshot');

module.exports = {

	/* FIND */
	list: function(startDate, perPage, callback) {
		var query = !startDate ? {} : { createdAt: { $lt: new Date(startDate) } };

		Portfolio
			.find(query)
			.limit(perPage)
			.sort('-createdAt')
			.populate('screenshots')
			.exec(
				function(err, response) {
					if(err) {
						return callback(500, responseManager.errorDatabase(err));
					}

					for(var i = 0; i < response.length; i++) {
						response[i] = response[i].generateOutput();
						delete response[i].screenshots;
						delete response[i].client;
					}

					return callback(200, response);
				}
			);
	},

	find: function(portfolioId, callback) {
		Portfolio
			.findOne({_id:portfolioId})
			.populate('screenshots')
			.exec(
				function(err, response) {
					if(err) {
						return callback(500, responseManager.errorDatabase(err));
					}

					if(!response) {
						return callback(404, responseManager.errorDoesNotExist('Portfolio'));
					}

					response = response.generateOutput();
					for(var i = 0; i < response.screenshots.length; i++) {
						var screenshot = new Screenshot(response.screenshots[i]);
						response.screenshots[i] = screenshot.generateOutput();
					}
					
					if(response.client) {
						response.client = response.client.generateOutput();
					}

					return callback(200, response);
				}
			);
	},
	
	/* INSERT */
	insert: function(portfolio, callback) {
		portfolio.save(
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
	remove: function(portfolioId, callback) {
		module.exports.find(portfolioId,
			function(status, response) {
				if(status != 200) {
					return callback(status, response);
				}

				Portfolio
					.remove({ _id:portfolioId })
					.exec(function(err) {
						if(err) {
							return callback(500, responseManager.errorDatabase(err));
						}

						Screenshot
							.remove({ portfolio:portfolioId })
							.exec(function(err) {
								if(err) {
									return callback(500, responseManager.errorDatabase(err));
								}

								var fileFolderDest = path.resolve('./' + dependenciesManager.output + '/' + portfolioId);

								fs.removeSync(fileFolderDest,
									function(err) {
										if(err) {
											return callback(500, err);
										}
									}
								);

								return callback(200, { id:portfolioId });
							}
						);
					}
				);
			}
		);
	},

	/* UPDATE */
	update: function(portfolioId, portfolio, callback) {
		var patch = JSON.parse(JSON.stringify(portfolio));

		delete patch._id;
		delete patch.id;
		delete patch.createdAt;
		delete patch.portfolio;
		delete patch.screenshots;

		Portfolio
			.update({ _id:portfolioId }, { $set: patch })
			.exec(function(err) {
					if(err) {
						return callback(500, responseManager.errorDatabase(err));
					}

					module.exports.find(portfolioId,
						function(status, response) {
							if(status != 200) {
								return callback(status, response);
							}

							return callback(200, response);
						}
					);
				}
			);
	}

} 