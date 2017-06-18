var express = require('express');
var router = express.Router();

var commandController = require('../app/controllers/command.js');

// router.get('/');
router.post('/guardar', commandController.save);

module.exports = router;