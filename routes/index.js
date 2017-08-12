var express = require('express');
var router = express.Router();

var loginController = require('../app/controllers/login');
var songRequestController = require('../app/controllers/songRequest');
var botController = require('../app/controllers/bot');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.twitchId) {
        res.redirect('/puntos');
    } else {
        res.render('index', {
            title: process.env.APP_NAME,
            notLogged: true,
            clientId: process.env.APP_CLIENT_ID,
            redirectUrl: process.env.APP_AUTH_REDIRECT_URL,
            scope: process.env.APP_AUTH_SCOPE
        });
    }
});

router.get('/login', loginController.login);
router.get('/stay-tuned', loginController.stayTuned);

router.post('/join-channel', botController.joinChannel);
router.post('/leave-channel', botController.leaveChannel);

/* GET song request page */
router.get('/songrequest', songRequestController.songsList);
router.post('/songrequest/delete-song', songRequestController.deleteSong);
router.get('/songrequest/songs', songRequestController.getSongs);

module.exports = router;
