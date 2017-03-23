var express = require('express');
var router = express.Router();
var userController = require('../utils/controller/UserController');

/* POST user's register */
router.post('/register', userController.register);

/* POST user's authentication */
router.post('/authenticate', userController.authenticate);

/* DELETE user */
router.delete('/delete', userController.delete);

module.exports = router;