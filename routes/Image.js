var dependenciesManager = require('../utils/manager/DependenciesManager');
var express = require('express');
var middlewareHelper = require('../utils/helper/MiddlewareHelper');
var router = express.Router({ mergeParams: true });
var imageController = require('../utils/controller/ImageController');

/* MIDDLEWARE used to valdiate token */
router.use(middlewareHelper);

/* POST an image into a specific portfolio. */
router.post('/', dependenciesManager.upload.single('file'), imageController.create);

module.exports = router;