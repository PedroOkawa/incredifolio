var express = require('express');
var middlewareHelper = require('../utils/helper/MiddlewareHelper');
var clientController = require('../utils/controller/ClientController');
var router = express.Router();

/* MIDDLEWARE used to valdiate token */
router.use(middlewareHelper);

/* POST a portfolio. */
router.post('/', clientController.create);

/* GET list all portfolios (minify) paginated by date (Created At). */
router.get('/list', clientController.list);

/* GET portfolio's details (Complete description). */
router.get('/:clientId', clientController.details);

/* DELETE portfolio */
router.delete('/:clientId', clientController.delete);

module.exports = router;