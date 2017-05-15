const fs = require('fs-extra');
const path = require('path');

var dependenciesManager = require('../../utils/manager/DependenciesManager');
var mkdirp = require('mkdirp');
var Portfolio = require('../../models/Portfolio');
var portfolioDBHelper = require('../../utils/helper/PortfolioDBHelper');
var responseManager = require('../../utils/manager/ResponseManager');
var User = require('../../models/User');

var bcrypt = require('bcrypt');
var security = require('../../config/Security');

module.exports = {
	
	/* FIND */
	find: function(username, password, callback) {
		User.findOne({ username: '/^' + username + '$/i' },
			function(err, response) {
				if(err) {
					return callback(500, responseManager.errorDatabase(err));
				}

				if(!response) {
					return callback(404, responseManager.errorDoesNotExist('User'));
				}

				var salt = String(bcrypt.genSaltSync(security.saltFactor));
				if(!bcrypt.compareSync(password, response.password)) {
					return callback(403, responseManager.errorCredentialsMismatch());
				}

				response = response.generateOutput();
				return callback(200, response);
			}
		);
	},

	/* INSERT */
	insert: function(username, password, callback) {
		module.exports.find(username, password,
			function(status, response) {
				if(status != 404) {
					if(status != 200 && status != 403) {
						return callback(status, response);
					}

					if(response) {
						return callback(409, responseManager.errorAlreadyExist('User'));
					}
				}

				user = new User();
				user.username = username;
				user.password = password;

				user.save(
					function(err, response) {
						if(err) {
							return callback(500, responseManager.errorDatabase(err));
						}

						response = response.generateOutput();

						return callback(200, response);
					}
				);
			}
		);
	},

	/* REMOVE */
	remove: function(username, password, callback) {
		module.exports.find(username, password,
			function(status, response) {
				if(status != 200) {
					return callback(status, response);
				}

				if(!response) {
					return callback(404, responseManager.errorDoesNotExist('User'));
				}

				User
					.remove({ username: '/^' + username + '$/i', password: password })
					.exec(
						function(err) {
							if(err) {
								return callback(500, err);
							}

							return callback(200, { username: username });
						}
					);
			}
		);
	}

} 