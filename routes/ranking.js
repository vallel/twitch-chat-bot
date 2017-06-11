var express = require('express');
var router = express.Router();

var rankingController = require('../app/controllers/ranking.js');

router.get('/', rankingController.rankingList);

module.exports = router;
