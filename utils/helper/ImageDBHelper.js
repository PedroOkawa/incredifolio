const fs = require('fs-extra');
const path = require('path');

var credentials = require('../../config/Credentials');
var dependenciesManager = require('../../utils/manager/DependenciesManager');
var mkdirp = require('mkdirp');
var Portfolio = require('../../models/Portfolio');
var portfolioDBHelper = require('../../utils/helper/PortfolioDBHelper');
var responseManager = require('../../utils/manager/ResponseManager');

module.exports = {

	/* INSERT */
	insert: function(portfolioId, file, callback) {
		portfolioDBHelper.find(portfolioId,
			function(status, response) {
				var fileFolderSource = path.resolve('./' + dependenciesManager.output);
				var fileFolderDest = path.resolve('./' + dependenciesManager.output + '/' + portfolioId + dependenciesManager.mainImageFolder);

				if(status != 200) {
					fs.removeSync(fileFolderDest + file.filename, function(err) {
						if(err) {
							return callback(500, err);
						}
					});

					return callback(status, response);
				}

				fs.removeSync(fileFolderDest,
					function(err) {
						if(err) {
							return callback(500, err);
						}
						
						var portfolio = response;
						mkdirp(fileFolderDest,
							function(err) {
								if(err) {
									fs.removeSync(dependenciesManager.output + '/' + file.filename,
										function(err) {
											if(err) {
												return callback(500, err);
											}
										}
									);

									return res.json({ error: 'Error while trying to create folder: ' + fileFolderDest });
								}

								var startIndex = file.filename.lastIndexOf(".");
								var endIndex = file.filename.length;
								var extension = file.filename.substring(startIndex, endIndex);

								fs.rename(fileFolderSource + '/' + file.filename, fileFolderDest + '/' + file.filename,
									function(err) {
										if(err) {
											return callback(500, err);
										}

										var image = credentials.host + dependenciesManager.imagesFolder + '/' + portfolioId + dependenciesManager.mainImageFolder + '/' + file.filename;
										portfolio.image = image;

										portfolioDBHelper.update(portfolioId, portfolio,
											function(err) {
												return callback(200, portfolio);
											}
										);
									}
								);
							}
						);
					}
				);
			}
		)
	}

} 