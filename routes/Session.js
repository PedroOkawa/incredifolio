var express = require('express');
var middlewareHelper = require('../utils/helper/MiddlewareHelper');
var router = express.Router();

/* MIDDLEWARE used to valdiate token */
router.use(middlewareHelper);

/* POST a screenshot into a specific portfolio. */
router.post('/validate',
	function(req, res, next) {
		res.status(204).send();
	}
);

module.exports = router;