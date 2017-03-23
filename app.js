/* SETUP (MODULES) */
var credentials = require('./config/Credentials');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var morgan = require('morgan');
var jwt = require('jsonwebtoken');

/* BODY PARSER */
var options = {
	inflate: true,
	limit: '100kb',
	type: 'application/octet-stream'
};

/* INITIALIZES MONGOOSE (MONGODB) */
mongoose.Promise = global.Promise;
mongoose.connect(credentials.mongoConnection);


/* SETUP (APP) */
var app = express();

/* INITIALIZES APP */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(require('mongodb-js-errors/express'));

require('./routes/Index')(app);

app.get('/favicon.ico', function(req, res) {
    res.send(204);
});

module.exports = app;