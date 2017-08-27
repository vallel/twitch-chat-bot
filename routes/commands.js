var express = require('express');
var router = express.Router();

var commandController = require('../app/controllers/command.js');

router.get('/', commandController.index);
router.get('/:commandName', commandController.get);
router.post('/gamble/guardar', commandController.saveGamble);
router.post('/guardar', commandController.save);
router.get('/borrar/:commandName', commandController.delete);

module.exports = router;