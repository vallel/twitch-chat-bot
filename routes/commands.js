var express = require('express');
var router = express.Router();

var commandController = require('../app/controllers/command.js');

// router.get('/');
router.post('/gamble/guardar', commandController.saveGamble);

module.exports = router;