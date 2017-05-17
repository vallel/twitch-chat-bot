var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Twitch Chat Bot', indexPage: true });
});

/* GET song request page */
router.get('/songrequest', function(req, res, next) {
  res.render('songrequest', { title: 'Twitch Chat Bot - Song Request', songRequestPage: true });
});

module.exports = router;
