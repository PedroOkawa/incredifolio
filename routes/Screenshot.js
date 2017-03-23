var dependenciesManager = require('../utils/manager/DependenciesManager');
var express = require('express');
var middlewareHelper = require('../utils/helper/MiddlewareHelper');
var router = express.Router({ mergeParams: true });
var screenshotController = require('../utils/controller/ScreenshotController');

/* MIDDLEWARE used to valdiate token */
router.use(middlewareHelper);

/* POST a screenshot into a specific portfolio. */
router.post('/', dependenciesManager.upload.single('file'), screenshotController.create);

/* DELETE screenshot from a specific portfolio */
router.delete('/:screenshotId', screenshotController.delete);

module.exports = router;