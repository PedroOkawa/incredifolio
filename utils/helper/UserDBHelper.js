const fs = require('fs-extra');
const path = require('path');

var dependenciesManager = require('../../utils/manager/DependenciesManager');
var mkdirp = require('mkdirp');
var Portfolio = require('../../models/Portfolio');
var portfolioDBHelper = require('../../utils/helper/PortfolioDBHelper');
var responseManager = require('../../utils/manager/ResponseManager');
var User = require('../../models/User');

module.exports = {
	
	/* FIND */
	find: function(username, password, callback) {
		User.findOne({ username: username, password: password },
			function(err, user) {
				if(err) {
					console.log('test 1');
					return callback(500, responseManager.errorDatabase(err));
				}

				return callback(200, user);
			}
		);
	},

	/* INSERT */
	insert: function(username, password, callback) {
		module.exports.find(username, password,
			function(status, response) {
				if(status != 200) {
					return callback(status, response);
				}

				if(response) {
					return callback(409, responseManager.errorAlreadyExist('User'));
				}

				user = new User();
				user.username = username;
				user.password = password;

				user.save(
					function(err) {
						if(err) {
							console.log('test 2');
							return callback(500, responseManager.errorDatabase(err));
						}

						return callback(200, user);
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
					.remove({ username: username, password: password })
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