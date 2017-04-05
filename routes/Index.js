var client = require('../routes/Client');
var portfolio = require('../routes/Portfolio');
var screenshot = require('../routes/Screenshot');
var session = require('../routes/Session');
var user = require('../routes/User');

module.exports = function(app) {

	app.use('/client', client);
	app.use('/portfolio', portfolio);
	app.use('/portfolio/:portfolioId/screenshot', screenshot);
	app.use('/session', session);
	app.use('/user', user);

}