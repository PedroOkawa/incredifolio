var portfolio = require('../routes/Portfolio');
var screenshot = require('../routes/Screenshot');
var user = require('../routes/User');

module.exports = function(app) {

	app.use('/user', user);
	app.use('/portfolio', portfolio);
	app.use('/portfolio/:portfolioId/screenshot', screenshot);

}