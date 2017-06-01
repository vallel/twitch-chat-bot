var Song = require('../models/song.js');

exports.songs_list = function(req, res, next) {

    res.render('songrequest', { 
        title: 'Twitch Chat Bot - Song Request',
        songRequestPage: true
    });
};