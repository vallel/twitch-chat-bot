var express = require('express');
var router = express.Router();

var songRequestController = require('../app/controllers/songRequest.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Twitch Chat Bot', indexPage: true });
});

/* GET song request page */
router.get('/songrequest', songRequestController.songsList);
router.post('/songrequest/delete-song/:id', songRequestController.deleteSong);
router.get('/songrequest/songs', songRequestController.getSongs);

module.exports = router;
