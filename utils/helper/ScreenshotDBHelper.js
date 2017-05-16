const fs = require('fs-extra');
const path = require('path');

var credentials = require('../../config/Credentials');
var dependenciesManager = require('../../utils/manager/DependenciesManager');
var mkdirp = require('mkdirp');
var Portfolio = require('../../models/Portfolio');
var portfolioDBHelper = require('../../utils/helper/PortfolioDBHelper');
var responseManager = require('../../utils/manager/ResponseManager');
var Screenshot = require('../../models/Screenshot');

module.exports = {

	/* FIND */
	find: function(portfolioId, screenshotId, callback) {
		portfolioDBHelper.find(portfolioId,
			function(status, response) {
				if(status != 200) {
					return callback(status, response);
				}

				Screenshot
					.findOne({ _id:screenshotId})
					.exec(function(err, response) {
						if(err) {
							return callback(500, responseManager.errorDatabase(err));
						}

						if(!response) {
							return callback(404, responseManager.errorDoesNotExist('Screenshot'));
						}

						return callback(200, response);
					}
				);
			}
		);
	},
	
	/* INSERT */
	insert: function(portfolioId, file, callback) {
		portfolioDBHelper.find(portfolioId,
			function(status, response) {
				if(status != 200) {
					fs.removeSync(dependenciesManager.output + file.filename, function(err) {
						if(err) {
							return callback(500, err);
						}
					});

					return callback(status, response);
				}

				var fileFolderSource = path.resolve('./' + dependenciesManager.output);
				var fileFolderDest = path.resolve('./' + dependenciesManager.output + '/' + portfolioId);

				mkdirp(fileFolderDest,
					function(err) {
						if(err) {
							fs.removeSync(dependenciesManager.output + file.filename,
								function(err) {
									if(err) {
										return callback(500, err);
									}
								}
							);

							return res.json({ error: 'Error while trying to create folder: ' + fileFolderDest });
						}

						fs.rename(fileFolderSource + '/' + file.filename, fileFolderDest + '/' + file.filename,
							function(err) {
								if(err) {
									return callback(500, err);
								}

								var screenshotObject = new Screenshot({portfolio: portfolioId});
								screenshotObject.image = credentials.host + dependenciesManager.imagesFolder + '/' + portfolioId + '/' + file.filename;
								screenshotObject.save(
									function(err, screenshot) {
										if(err) {
											return callback(500, responseManager.errorDatabase(err));
										}

										screenshot = screenshot.generateOutput();
										return callback(201, screenshot);
									}
								);
							}
						);
					}
				);

			}
		)
	},

	/* REMOVE */
	remove: function(portfolioId, screenshotId, callback) {
		portfolioDBHelper.find(portfolioId,
			function(status, response) {
				if(status != 200) {
					return callback(status, response);
				}

				const portfolio = response;

				module.exports.find(portfolioId, screenshotId,
					function(status, response) {
						if(status != 200) {
							return callback(status, response);
						}

						const screenshot = response;

						Screenshot
							.remove({ _id:screenshotId })
							.exec(
								function(err) {
									if(err) {
										return callback(500, err);
									}

									fs.removeSync(screenshot.image, function(err) {
										if(err) {
											return callback(500, err);
										}
									});

									return callback(200, { id:screenshotId });
								}
							);
					}
				);
			}
		);
	}


} 