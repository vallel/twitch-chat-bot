var express = require('express');
var router = express.Router();

var commandController = require('../app/controllers/command.js');

router.get('/', commandController.index);
router.post('/gamble/guardar', commandController.saveGamble);
router.post('/nuevo', commandController.create);

module.exports = router;