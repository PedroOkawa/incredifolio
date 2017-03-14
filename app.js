/* SETUP (MODULES) */
var credentials = require('./config/credentials');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

/* SETUP (GENERAL) */
var mongoosePath = credentials.mongoConnection();

/* SETUP (ROUTES) */
var index = require('./routes/index');
var portfolio = require('./routes/portfolio');

/* SETUP (APP) */
var app = express();

/* INITIALIZES MONGOOSE (MONGODB) */
mongoose.Promise = global.Promise;
mongoose.connect(mongoosePath);

/* INITIALIZES APP */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/portfolio', portfolio);

module.exports = app;