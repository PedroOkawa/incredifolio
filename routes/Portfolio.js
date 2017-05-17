var express = require('express');
var middlewareHelper = require('../utils/helper/MiddlewareHelper');
var portfolioController = require('../utils/controller/PortfolioController');
var router = express.Router();

/* MIDDLEWARE used to valdiate token */
router.use(middlewareHelper);

/* POST a portfolio. */
router.post('/', portfolioController.create);

/* GET list all portfolios (minify) paginated by date (Created At). */
router.get('/list', portfolioController.list);

/* GET portfolio's details (Complete description). */
router.get('/:portfolioId', portfolioController.details);

/* DELETE portfolio */
router.delete('/:portfolioId', portfolioController.delete);

/* PATCH portfolio */
router.patch('/:portfolioId', portfolioController.update);

module.exports = router;