var express = require('express');
var router = express.Router();
var config = require('../app/config');

var loginController = require('../app/controllers/login');
var songRequestController = require('../app/controllers/songRequest');
var botController = require('../app/controllers/bot');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.oauth) {
        res.redirect('/puntos');
    } else {
        res.render('index', {
            title: 'Twitch Chat Bot',
            loginPage: true,
            clientId: config.twitchApp.clientId,
            redirectUrl: config.twitchApp.redirectUrl,
            scope: config.twitchApp.scope
        });
    }
});

router.get('/login', loginController.login);

router.post('/join-channel', botController.joinChannel);
router.post('/leave-channel', botController.leaveChannel);

/* GET song request page */
router.get('/songrequest', songRequestController.songsList);
router.post('/songrequest/delete-song', songRequestController.deleteSong);
router.get('/songrequest/songs', songRequestController.getSongs);

module.exports = router;
