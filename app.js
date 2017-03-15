/* SETUP (MODULES) */
var credentials = require('./config/credentials');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var morgan = require('morgan');
var jwt = require('jsonwebtoken');

/* SETUP (ROUTES) */
var index = require('./routes/index');
var portfolio = require('./routes/portfolio');
var user = require('./routes/user');

/* SETUP (APP) */
var app = express();

/* INITIALIZES MONGOOSE (MONGODB) */
mongoose.Promise = global.Promise;
mongoose.connect(credentials.mongoConnection);

/* INITIALIZES APP */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/portfolio', portfolio);
app.use('/user', user);

module.exports = app;